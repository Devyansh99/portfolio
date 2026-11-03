"use client";

import dynamic from "next/dynamic";
import { useInView } from "framer-motion";
import { useRef } from "react";
import type { PointerEvent } from "react";
import { figureCaption } from "@/data/copy";
import { useCanRender3D, useDeviceTier } from "@/lib/capabilities";
import { SmartClipPoster } from "./SmartClipPoster";

const SmartClipScene = dynamic(() => import("./SmartClipScene"), {
  ssr: false,
});

export function SmartClipFigure() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const seen = useInView(wrapRef, { once: true });
  const inView = useInView(wrapRef, { margin: "200px" });
  const can3D = useCanRender3D();
  const tier = useDeviceTier();
  const scrubRef = useRef(1);
  const counterRef = useRef<HTMLSpanElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    scrubRef.current = 0.3 + ((e.clientX - r.left) / r.width) * 2.2;
  };

  return (
    <figure>
      <div
        ref={wrapRef}
        onPointerMove={onMove}
        className="relative h-[240px] border border-paper-ink/15 md:h-[360px]"
      >
        {can3D && seen ? (
          <SmartClipScene
            active={inView}
            scrubRef={scrubRef}
            counterRef={counterRef}
            count={tier === "high" ? 3000 : 1200}
          />
        ) : (
          <SmartClipPoster />
        )}
      </div>
      <figcaption className="mt-3 text-[13px] leading-snug text-paper-muted">
        {figureCaption}{" "}
        {can3D && (
          <span ref={counterRef} className="font-mono">
            clips saved: 0 (simulation)
          </span>
        )}
      </figcaption>
    </figure>
  );
}
