import type { SceneId } from "@/data/sections";

type Listener = () => void;

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export const sceneState = {
  section: "hero" as SceneId,
  project: null as string | null,
  pointerX: 0,
  pointerY: 0,
  pointerFine: false,
  moveTick: 0,
  impactPending: false,
  impactX: 0,
  impactY: 0,
  trace: 0,
  ready: false,
};

export function subscribeScene(cb: Listener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export const getSection = () => sceneState.section;
export const getReady = () => sceneState.ready;

export function setSection(id: SceneId) {
  if (sceneState.section !== id) {
    sceneState.section = id;
    emit();
  }
}

export function setHoveredProject(id: string | null) {
  sceneState.project = id;
}

export function setPointer(x: number, y: number, fine: boolean) {
  sceneState.pointerX = x;
  sceneState.pointerY = y;
  sceneState.pointerFine = fine;
  sceneState.moveTick += 1;
}

export function registerImpact(e: { clientX: number; clientY: number }) {
  sceneState.impactX = (e.clientX / window.innerWidth) * 2 - 1;
  sceneState.impactY = -((e.clientY / window.innerHeight) * 2 - 1);
  sceneState.impactPending = true;
}

export function markReady() {
  if (!sceneState.ready) {
    sceneState.ready = true;
    emit();
  }
}
