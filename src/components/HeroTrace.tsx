"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/capabilities";
import { mulberry32 } from "@/lib/rng";
import { sceneState } from "@/lib/scene-store";

const N = 240;

function toPoints(buf: Float32Array) {
  let s = "";
  for (let i = 0; i < N; i++) {
    s += `${i},${(32 - buf[i] * 28).toFixed(1)} `;
  }
  return s;
}

const staticPoints = (() => {
  const r = mulberry32(11);
  const buf = new Float32Array(N);
  for (let i = 0; i < N; i++) buf[i] = (r() - 0.5) * 0.08;
  return toPoints(buf);
})();

export function HeroTrace() {
  const reduce = usePrefersReducedMotion();
  const lineRef = useRef<SVGPolylineElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) return;
    const buf = new Float32Array(N);
    const rand = mulberry32(17);
    let raf = 0;
    let last = 0;
    let peak = 0;

    const tick = (ts: number) => {
      if (ts - last > 33) {
        last = ts;
        buf.copyWithin(0, 1);
        const kick = sceneState.trace * (rand() > 0.5 ? 1 : -1) * (0.5 + rand() * 0.5);
        const v = (rand() - 0.5) * 0.08 + kick;
        buf[N - 1] = v;
        peak = Math.max(peak * 0.985, Math.abs(v));
        lineRef.current?.setAttribute("points", toPoints(buf));
        if (readRef.current) {
          readRef.current.textContent =
            peak < 0.33 ? "low" : peak < 0.66 ? "medium" : "high";
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <div className="flex items-center gap-6" aria-hidden>
      <svg
        viewBox="0 0 240 64"
        preserveAspectRatio="none"
        className="h-10 w-full md:h-16"
      >
        <polyline
          ref={lineRef}
          points={staticPoints}
          fill="none"
          stroke="var(--mint)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="label shrink-0 whitespace-nowrap">
        impact <span ref={readRef}>low</span>
      </span>
    </div>
  );
}
