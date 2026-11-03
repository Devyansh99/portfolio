"use client";

import { useEffect, useRef } from "react";

const CHARS = "01ABCDEF<>/{}[]$#アイウエオカキクケコサシスセソ";

export function MatrixRain({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      onDone();
      return;
    }
    const size = 16;
    let w = 0;
    let h = 0;
    let drops: number[] = [];
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      drops = Array.from({ length: Math.ceil(w / size) }, () => Math.random() * -40);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = 0;
    const started = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 45) return;
      last = now;
      const t = now - started;
      const fade = t > 4200 ? Math.max(0, 1 - (t - 4200) / 800) : 1;
      ctx.fillStyle = "rgba(5,7,10,0.14)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${size}px ui-monospace, Consolas, monospace`;
      ctx.globalAlpha = fade;
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * size;
        ctx.fillStyle = "#d8fff0";
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * size, y);
        ctx.fillStyle = "#3dffb0";
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * size, y - size);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(tick);
    const timer = window.setTimeout(onDone, 5000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, [onDone]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[85] size-full opacity-90"
    />
  );
}
