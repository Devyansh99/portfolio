"use client";

import { useSyncExternalStore } from "react";

function makeMediaSubscribe(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

const narrowQuery = "(max-width: 767px)";
const subscribeNarrow = makeMediaSubscribe(narrowQuery);

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

export function useWebGL2(): boolean {
  return useSyncExternalStore(subscribeNever, detectWebGL2, () => false);
}
