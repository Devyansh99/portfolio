"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { mulberry32 } from "@/lib/rng";

const HEX = "0123456789ABCDEF";
const CELL_W = 6;
const CELL_H = 8;
const MINT = "61,255,176";
const MONO = "ui-monospace, Consolas, Menlo, monospace";

const SCAN = 2600;
const PARSE = 2400;
const HOLD = 2600;
const BACK = 1800;
const REST = 800;
const TOTAL = SCAN + PARSE + HOLD + BACK + REST;

const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

function buildCode(
  img: HTMLImageElement,
  w: number,
  h: number,
): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d");
  const cols = Math.ceil(w / CELL_W);
  const rows = Math.ceil(h / CELL_H);
  const small = document.createElement("canvas");
  small.width = cols;
  small.height = rows;
  const sctx = small.getContext("2d", { willReadFrequently: true });
  if (!octx || !sctx) return out;

  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  sctx.drawImage(
    img,
    ((w - dw) * 0.5) / CELL_W,
    ((h - dh) * 0.2) / CELL_H,
    dw / CELL_W,
    dh / CELL_H,
  );
  const px = sctx.getImageData(0, 0, cols, rows).data;

  octx.fillStyle = "#05070a";
  octx.fillRect(0, 0, w, h);
  octx.font = `700 ${CELL_H + 1}px ${MONO}`;
  octx.textBaseline = "top";
  const rand = mulberry32(11);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = (r * cols + c) * 4;
      const lum = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
      const a = Math.min(1, Math.max(0, (lum - 0.06) * 1.7));
      octx.fillStyle = `rgba(${MINT},${(0.08 + a * 0.92).toFixed(2)})`;
      octx.fillText(HEX[Math.floor(rand() * 16)], c * CELL_W, r * CELL_H);
    }
  }
  return out;
}

export function ScanPortrait({
  inset = "inset-2",
  sizes,
  priority = false,
}: {
  inset?: string;
  sizes: string;
  priority?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = wrap.current;
    const canvas = canvasRef.current;
    const label = labelRef.current;
    if (!box || !canvas || !label) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new window.Image();
    img.src = "/devyansh.jpg";
    let layer: HTMLCanvasElement | null = null;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let start = 0;
    let last = 0;
    let scrolledAt = 0;
    const onScroll = () => {
      scrolledAt = performance.now();
    };
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });

    const size = () => {
      const r = box.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return;
      w = Math.round(r.width);
      h = Math.round(r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      layer = img.complete && img.naturalWidth ? buildCode(img, w, h) : null;
    };

    const brackets = () => {
      ctx.strokeStyle = `rgba(${MINT},0.9)`;
      ctx.lineWidth = 2;
      const m = 6;
      const l = 14;
      const corners = [
        [m, m, 1, 1],
        [w - m, m, -1, 1],
        [m, h - m, 1, -1],
        [w - m, h - m, -1, -1],
      ];
      for (const [x, y, dx, dy] of corners) {
        ctx.beginPath();
        ctx.moveTo(x, y + dy * l);
        ctx.lineTo(x, y);
        ctx.lineTo(x + dx * l, y);
        ctx.stroke();
      }
    };

    const scanLine = (y: number) => {
      const g = ctx.createLinearGradient(0, y - 28, 0, y);
      g.addColorStop(0, `rgba(${MINT},0)`);
      g.addColorStop(1, `rgba(${MINT},0.35)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, y - 28, w, 28);
      ctx.fillStyle = `rgba(${MINT},1)`;
      ctx.fillRect(0, y - 1, w, 2);
    };

    const verified = () => {
      const bw = Math.min(w - 24, 150);
      const bx = (w - bw) / 2;
      const by = h / 2 - 16;
      ctx.fillStyle = "rgba(5,7,10,0.88)";
      ctx.fillRect(bx, by, bw, 32);
      ctx.strokeStyle = "#ffb547";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, bw, 32);
      ctx.fillStyle = "#ffb547";
      ctx.font = `700 11px ${MONO}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ACCESS VERIFIED", w / 2, h / 2);
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden || box.offsetParent === null) return;
      if (now - last < 33 || now - scrolledAt < 160) return;
      last = now;
      if (!start) start = now;
      if (w === 0 || (layer === null && img.complete && img.naturalWidth)) {
        size();
      }
      if (w === 0) return;

      const t = (now - start) % TOTAL;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      brackets();

      let text = "standby";
      if (t < SCAN) {
        scanLine(ease(t / SCAN) * h);
        text = "scanning face...";
      } else if (t < SCAN + PARSE) {
        const p = ease((t - SCAN) / PARSE);
        const y = p * h;
        if (layer && y > 0) ctx.drawImage(layer, 0, 0, w, y, 0, 0, w, y);
        scanLine(y);
        const hex = Math.floor(p * 0xffff)
          .toString(16)
          .toUpperCase()
          .padStart(4, "0");
        text = `parsing 0x${hex}`;
      } else if (t < SCAN + PARSE + HOLD) {
        const k = t - SCAN - PARSE;
        if (layer) {
          ctx.globalAlpha = 0.88 + 0.12 * Math.sin(k / 70);
          ctx.drawImage(layer, 0, 0, w, h);
          ctx.globalAlpha = 1;
        }
        if (k > 500) verified();
        text = k > 500 ? "access verified" : "hash ok...";
      } else if (t < SCAN + PARSE + HOLD + BACK) {
        const p = ease((t - SCAN - PARSE - HOLD) / BACK);
        const y = p * h;
        if (layer && h - y > 0) {
          ctx.drawImage(layer, 0, y, w, h - y, 0, y, w, h - y);
        }
        scanLine(y);
        text = "restoring image";
      }
      if (label.textContent !== text) label.textContent = text;
    };

    const ro = new ResizeObserver(size);
    ro.observe(box);
    img.onload = size;
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll, { capture: true });
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className={`absolute ${inset} overflow-hidden`}>
      <Image
        src="/devyansh.jpg"
        alt="Portrait of Devyansh Agarwal"
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover object-[50%_20%]"
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      />
      <span
        ref={labelRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-bg/70 px-1.5 py-0.5 font-mono text-[10px] text-mint"
      />
    </div>
  );
}
