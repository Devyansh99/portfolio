import { useSyncExternalStore } from "react";

const KEY = "portfolio-shell-history";
const EMPTY: string[] = [];
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache === null) {
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
      cache = Array.isArray(parsed)
        ? parsed.filter((x): x is string => typeof x === "string").slice(-50)
        : [];
    } catch {
      cache = [];
    }
  }
  return cache;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function pushHistory(cmd: string) {
  cache = [...read(), cmd].slice(-50);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // storage unavailable: history stays in memory
  }
  listeners.forEach((fn) => fn());
}

export function useShellHistory(): string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
