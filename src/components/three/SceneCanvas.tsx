"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useState } from "react";
import { CameraRig } from "./CameraRig";
import { Field } from "./Field";

export default function SceneCanvas({ side }: { side: number }) {
  const [dpr, setDpr] = useState<number | [number, number]>([1, 1.5]);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 2.4, 7], fov: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <CameraRig />
      <Field side={side} />
    </Canvas>
  );
}
