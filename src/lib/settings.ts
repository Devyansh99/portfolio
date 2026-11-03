"use client";

import { useSyncExternalStore } from "react";

type Key = "motion" | "crt";

const listeners = new Set<() => void>();
const state: Record<Key, boolean | null> = { motion: null, crt: null };

function read(key: Key): boolean {
  try {
    const v = window.localStorage.getItem(`hud:${key}`);
    if (v !== null) return v === "1";
  } catch {
    // storage unavailable, fall through to defaults
  }
  if (key === "motion") {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return false;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useSetting(key: Key): boolean {
  return useSyncExternalStore(
    subscribe,
    () => {
      if (state[key] === null) state[key] = read(key);
      return state[key] as boolean;
    },
    () => (key === "motion" ? true : false),
  );
}

export function setSetting(key: Key, value: boolean) {
  state[key] = value;
  try {
    window.localStorage.setItem(`hud:${key}`, value ? "1" : "0");
  } catch {
    // ignore storage failures
  }
  listeners.forEach((l) => l());
}
