"use client";

import { useSyncExternalStore } from "react";

function makeMediaSubscribe(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const pointerFineQuery = "(pointer: fine)";
const narrowQuery = "(max-width: 767px)";

const subscribeReducedMotion = makeMediaSubscribe(reducedMotionQuery);
const subscribePointerFine = makeMediaSubscribe(pointerFineQuery);
const subscribeNarrow = makeMediaSubscribe(narrowQuery);

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
}

export function usePointerFine(): boolean {
  return useSyncExternalStore(
    subscribePointerFine,
    () => window.matchMedia(pointerFineQuery).matches,
    () => false,
  );
}

export function useDeviceTier(): "high" | "low" {
  return useSyncExternalStore(
    subscribeNarrow,
    () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const narrow = window.matchMedia(narrowQuery).matches;
      const cores = navigator.hardwareConcurrency || 8;
      return coarse || narrow || cores <= 4 ? "low" : "high";
    },
    () => "low",
  );
}

let webglSupported: boolean | undefined;

function detectWebGL2(): boolean {
  if (webglSupported === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupported = Boolean(canvas.getContext("webgl2"));
    } catch {
      webglSupported = false;
    }
  }
  return webglSupported;
}

const subscribeNever = () => () => {};

export function useCanRender3D(): boolean {
  const reduce = usePrefersReducedMotion();
  const webgl = useSyncExternalStore(subscribeNever, detectWebGL2, () => false);
  return webgl && !reduce;
}
