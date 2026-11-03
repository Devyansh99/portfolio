"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";

const P = 12;
const TRACE_N = 256;

function profile(x: number) {
  const m = ((x % P) + P) % P;
  return -0.55 * Math.exp(-((m - 3) ** 2) / 0.18) - 0.4 * Math.exp(-((m - 9) ** 2) / 0.12);
}

type SceneProps = {
  scrubRef: RefObject<number>;
  counterRef: RefObject<HTMLSpanElement | null>;
  count: number;
};

type Sim = {
  t: number;
  cool: number;
  flash: number;
  clips: number;
};

function Scene({ scrubRef, counterRef, count }: SceneProps) {
  const road = useRef<THREE.Group>(null);
  const bufferMat = useRef<THREE.LineBasicMaterial>(null);
  const sim = useRef<Sim>({ t: 0, cool: 0, flash: 0, clips: 0 });
  const rand = useRef(mulberry32(41));

  const positions = useMemo(() => {
    const r = mulberry32(13);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = -P + 3 * P * ((i + r()) / count);
      arr[i * 3] = x;
      arr[i * 3 + 1] = profile(x);
      arr[i * 3 + 2] = (r() - 0.5) * 2.2;
    }
    return arr;
  }, [count]);

  const bufferEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4, 1.2, 2.6)),
    [],
  );
  const phoneEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.35, 0.6, 0.06)),
    [],
  );
  const traceLine = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(TRACE_N * 3);
    for (let i = 0; i < TRACE_N; i++) arr[i * 3] = -5 + (10 * i) / (TRACE_N - 1);
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({ color: "#5e5a52" }),
    );
  }, []);

  useFrame((_, dt) => {
    const s = sim.current;
    const d = Math.min(dt, 0.05);
    s.t += d * 1.2 * scrubRef.current;
    const local = s.t % P;
    if (road.current) road.current.position.x = -local;

    const prof = profile(local);
    if (prof < -0.2 && s.cool <= 0) {
      s.clips += 1;
      s.flash = 1.2;
      s.cool = 2.2;
      if (counterRef.current) {
        counterRef.current.textContent = `clips saved: ${s.clips} (simulation)`;
      }
    }
    s.cool -= d;
    s.flash -= d;
    bufferMat.current?.color.set(s.flash > 0 ? "#8f5200" : "#5e5a52");

    const pos = traceLine.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < TRACE_N - 1; i++) arr[i * 3 + 1] = arr[(i + 1) * 3 + 1];
    arr[(TRACE_N - 1) * 3 + 1] = -1.7 - prof * 1.4 + (rand.current() - 0.5) * 0.06;
    pos.needsUpdate = true;
  });

  return (
    <>
      <group ref={road}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color="#141614"
            size={0.035}
            sizeAttenuation
            transparent
            opacity={0.7}
          />
        </points>
      </group>
      <lineSegments geometry={bufferEdges} position={[0, 0.2, 0]}>
        <lineBasicMaterial ref={bufferMat} color="#5e5a52" />
      </lineSegments>
      <lineSegments geometry={phoneEdges} position={[0, 1.1, 0]}>
        <lineBasicMaterial color="#141614" />
      </lineSegments>
      <primitive object={traceLine} />
    </>
  );
}

type SmartClipSceneProps = SceneProps & { active: boolean };

export default function SmartClipScene({
  active,
  ...props
}: SmartClipSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 5.2, 8], fov: 32 }}
      gl={{ antialias: false, alpha: true }}
      onCreated={({ camera }) => camera.lookAt(0, -0.9, 0)}
    >
      <Scene {...props} />
    </Canvas>
  );
}
