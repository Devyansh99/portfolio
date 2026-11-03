"use client";

import dynamic from "next/dynamic";
import { useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import type { SceneId } from "@/data/sections";
import { useCanRender3D, useDeviceTier } from "@/lib/capabilities";
import {
  getReady,
  setPointer,
  setSection,
  subscribeScene,
} from "@/lib/scene-store";

const SceneCanvas = dynamic(() => import("./three/SceneCanvas"), {
  ssr: false,
});

export function SceneRoot({ children }: { children: ReactNode }) {
  const can3D = useCanRender3D();
  const tier = useDeviceTier();
  const ready = useSyncExternalStore(subscribeScene, getReady, () => false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSection(e.target.getAttribute("data-scene") as SceneId);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document
      .querySelectorAll("[data-scene]")
      .forEach((el) => observer.observe(el));

    const onMove = (e: PointerEvent) => {
      setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
        e.pointerType === "mouse",
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const showPoster = !(can3D && ready);

  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 z-0 h-svh transition-opacity duration-700 ${
          showPoster ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
      {can3D && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
          <div
            className={`h-full w-full transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          >
            <SceneCanvas side={tier === "high" ? 144 : 80} />
          </div>
        </div>
      )}
    </>
  );
}
