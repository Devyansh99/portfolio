"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneId } from "@/data/sections";
import { sceneState } from "@/lib/scene-store";

type Pose = { pos: [number, number, number]; look: [number, number, number] };

const POSES: Record<SceneId, Pose> = {
  hero: { pos: [0, 2.4, 7], look: [0, -0.4, -3] },
  about: { pos: [-1.2, 1.2, 8], look: [0, 0, 0] },
  projects: { pos: [0, 2.6, 8], look: [0, 0, 0] },
  research: { pos: [-1.2, 1.2, 8], look: [0, 0, 0] },
  skills: { pos: [0, 0, 12], look: [0, 0, 0] },
  experience: { pos: [0, 0, 12], look: [0, 0, 0] },
  contact: { pos: [0, 0.4, 7], look: [0, 0, 0] },
};

const look = new THREE.Vector3(0, -0.4, -3);

export function CameraRig() {
  useFrame((state, dt) => {
    const pose = POSES[sceneState.section];
    const d = Math.min(dt, 0.05);
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, pose.pos[0], 2.5, d);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, pose.pos[1], 2.5, d);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, pose.pos[2], 2.5, d);
    look.x = THREE.MathUtils.damp(look.x, pose.look[0], 2.5, d);
    look.y = THREE.MathUtils.damp(look.y, pose.look[1], 2.5, d);
    look.z = THREE.MathUtils.damp(look.z, pose.look[2], 2.5, d);
    cam.lookAt(look);
  });

  return null;
}
