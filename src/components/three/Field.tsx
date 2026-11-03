"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneId } from "@/data/sections";
import { markReady, sceneState } from "@/lib/scene-store";
import {
  createFieldUniforms,
  fragmentShader,
  vertexShader,
} from "./fieldMaterial";
import { buildSeeds, buildShapes, buildTints, shapeForSection } from "./shapes";

const ray = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const hit = new THREE.Vector3();
const ndc = new THREE.Vector2();

const OPACITY: Record<SceneId, number> = {
  hero: 1,
  about: 0.5,
  projects: 0.85,
  research: 0,
  skills: 0.25,
  experience: 0.25,
  contact: 0.8,
};

const GROUP_X: Record<SceneId, number> = {
  hero: 0.18,
  about: -0.18,
  projects: 0.2,
  research: 0,
  skills: 0,
  experience: 0,
  contact: 0,
};

const smooth = (x: number) => x * x * (3 - 2 * x);

type Runtime = {
  target: string;
  pending: string | null;
  pendingSince: number;
  mix: number;
  ready: boolean;
  lastTick: number;
  lastMove: number;
  lastGhost: number;
  ghostN: number;
  px: number;
  pz: number;
};

export function Field({ side }: { side: number }) {
  const n = side * side;
  const groupRef = useRef<THREE.Group>(null);
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const viewport = useThree((s) => s.viewport);

  const data = useMemo(() => {
    const shapes = buildShapes(side);
    return {
      shapes,
      seeds: buildSeeds(n),
      tints: buildTints(n),
      position: new Float32Array(n * 3),
      from: new Float32Array(shapes.terrain),
      to: new Float32Array(shapes.terrain),
      uniforms: createFieldUniforms(),
    };
  }, [side, n]);

  const rt = useRef<Runtime>({
    target: "terrain",
    pending: null,
    pendingSince: 0,
    mix: 1,
    ready: false,
    lastTick: 0,
    lastMove: 0,
    lastGhost: 0,
    ghostN: 0,
    px: 0,
    pz: 0,
  });

  useFrame((state, dt) => {
    const g = groupRef.current;
    const geo = geoRef.current;
    const mat = matRef.current;
    if (!g || !geo || !mat) return;

    const r = rt.current;
    const u = mat.uniforms;
    const t = state.clock.elapsedTime;
    const d = Math.min(dt, 0.05);
    const narrow = viewport.aspect < 1;
    const section = sceneState.section;

    if (!r.ready) {
      r.ready = true;
      markReady();
    }

    const want = shapeForSection(section, sceneState.project, narrow);
    if (want === r.target) {
      r.pending = null;
    } else if (want !== r.pending) {
      r.pending = want;
      r.pendingSince = t;
    } else if (t - r.pendingSince > 0.08) {
      const from = geo.getAttribute("aFrom") as THREE.BufferAttribute;
      const to = geo.getAttribute("aTo") as THREE.BufferAttribute;
      const fa = from.array as Float32Array;
      const ta = to.array as Float32Array;
      for (let i = 0; i < n; i++) {
        const m = smooth(
          Math.min(1, Math.max(0, r.mix * 1.4 - data.seeds[i] * 0.4)),
        );
        for (let c = 0; c < 3; c++) {
          const k = i * 3 + c;
          fa[k] = fa[k] + (ta[k] - fa[k]) * m;
        }
      }
      ta.set(data.shapes[want]);
      from.needsUpdate = true;
      to.needsUpdate = true;
      r.mix = 0;
      r.target = want;
      r.pending = null;
    }

    r.mix = Math.min(1, r.mix + d / 0.9);
    u.uMix.value = r.mix;
    u.uTime.value = t;
    u.uDpr.value = state.gl.getPixelRatio();
    u.uTerrain.value = THREE.MathUtils.damp(
      u.uTerrain.value,
      r.target === "terrain" ? 1 : 0,
      4,
      d,
    );
    u.uOpacity.value = THREE.MathUtils.damp(
      u.uOpacity.value,
      OPACITY[section] * (narrow ? 0.7 : 1),
      3,
      d,
    );
    g.visible = u.uOpacity.value > 0.01;

    const gx = narrow ? 0 : viewport.width * GROUP_X[section];
    g.position.x = THREE.MathUtils.damp(g.position.x, gx, 2.5, d);

    if (sceneState.moveTick !== r.lastTick) {
      r.lastTick = sceneState.moveTick;
      r.lastMove = t;
    }
    const idle = !sceneState.pointerFine || t - r.lastMove > 4;

    ndc.set(sceneState.pointerX, sceneState.pointerY);
    ray.setFromCamera(ndc, state.camera);
    let cx = r.px;
    let cz = r.pz;
    if (ray.ray.intersectPlane(plane, hit)) {
      cx = hit.x - g.position.x;
      cz = hit.z;
    }
    const cursor = u.uCursor.value as THREE.Vector2;
    cursor.set(
      THREE.MathUtils.damp(cursor.x, cx, 10, d),
      THREE.MathUtils.damp(cursor.y, cz, 10, d),
    );
    u.uDent.value = THREE.MathUtils.damp(u.uDent.value, idle ? 0 : 1, 4, d);

    const impact = u.uImpact.value as THREE.Vector2;
    if (sceneState.impactPending) {
      sceneState.impactPending = false;
      ndc.set(sceneState.impactX, sceneState.impactY);
      ray.setFromCamera(ndc, state.camera);
      if (ray.ray.intersectPlane(plane, hit)) {
        impact.set(hit.x - g.position.x, hit.z);
        u.uImpactT.value = t;
      }
    } else if (idle && section === "hero" && t - r.lastGhost > 3.5) {
      r.lastGhost = t;
      r.ghostN += 1;
      impact.set(
        ((r.ghostN * 0.618) % 1 - 0.5) * 8,
        -2 - ((r.ghostN * 0.37) % 1) * 8,
      );
      u.uImpactT.value = t;
    }

    const speed = Math.hypot(cursor.x - r.px, cursor.y - r.pz) / Math.max(d, 0.001);
    r.px = cursor.x;
    r.pz = cursor.y;
    const since = t - u.uImpactT.value;
    const ripple = since < 3 ? Math.exp(-2 * since) * 0.8 : 0;
    sceneState.trace = Math.min(
      1,
      Math.min(1, speed * 0.06) * u.uDent.value + ripple,
    );
  });

  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry ref={geoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[data.position, 3]}
          />
          <bufferAttribute
            attach="attributes-aFrom"
            args={[data.from, 3]}
            usage={THREE.DynamicDrawUsage}
          />
          <bufferAttribute
            attach="attributes-aTo"
            args={[data.to, 3]}
            usage={THREE.DynamicDrawUsage}
          />
          <bufferAttribute attach="attributes-aSeed" args={[data.seeds, 1]} />
          <bufferAttribute attach="attributes-aTint" args={[data.tints, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={data.uniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}
