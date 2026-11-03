"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";

type Pointer = { x: number; y: number };

function Network({
  pointer,
  count,
}: {
  pointer: RefObject<Pointer>;
  count: number;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const spin = useRef(0.6);
  const narrow = useThree((state) => state.viewport.aspect < 1);

  const positions = useMemo(() => {
    const rand = mulberry32(7);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = rand() * 2 - 1;
      const theta = rand() * Math.PI * 2;
      const r = 2.2 + rand() * 0.9;
      const s = Math.sqrt(1 - u * u);
      arr[i * 3] = r * s * Math.cos(theta);
      arr[i * 3 + 1] = r * u;
      arr[i * 3 + 2] = r * s * Math.sin(theta);
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const g = group.current;
    if (g) {
      spin.current += delta * 0.08;
      const p = pointer.current;
      const { viewport } = state;
      g.position.x = THREE.MathUtils.damp(
        g.position.x,
        p.x * viewport.width * 0.12,
        4,
        delta,
      );
      g.position.y = THREE.MathUtils.damp(
        g.position.y,
        p.y * viewport.height * 0.12,
        4,
        delta,
      );
      g.rotation.y = THREE.MathUtils.damp(
        g.rotation.y,
        spin.current + p.x * 0.7,
        4,
        delta,
      );
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -p.y * 0.6, 4, delta);
    }
    const m = inner.current;
    if (m) {
      m.rotation.y -= delta * 0.25;
      m.rotation.z += delta * 0.12;
    }
  });

  return (
    <group scale={narrow ? 0.5 : 0.85}>
      <group ref={group} rotation={[0.2, 0.6, 0]}>
        <mesh>
          <icosahedronGeometry args={[1.6, 2]} />
          <meshBasicMaterial color="#3dffb0" wireframe transparent opacity={0.22} />
        </mesh>
        <mesh ref={inner}>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshBasicMaterial color="#ffb547" wireframe transparent opacity={0.55} />
        </mesh>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color="#3dffb0"
            size={0.03}
            sizeAttenuation
            transparent
            opacity={0.85}
          />
        </points>
      </group>
    </group>
  );
}

type HeroSceneProps = {
  pointer: RefObject<Pointer>;
  active: boolean;
  low: boolean;
  onReady: () => void;
};

export default function HeroScene({
  pointer,
  active,
  low,
  onReady,
}: HeroSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={low ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: false, powerPreference: "low-power" }}
      onCreated={onReady}
    >
      <Network pointer={pointer} count={low ? 500 : 900} />
    </Canvas>
  );
}
