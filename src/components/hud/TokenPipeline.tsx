"use client";

import { useEffect, useRef } from "react";

type Snippet = [string[], string[]];

const SNIPPETS: Snippet[] = [
  [["while", " (deadline", " >", " now", ")"], [" {", " coffee", "++", ";", " sleep", "--", ";", " }"]],
  [["if", " (loss", " ==", " NaN", ")"], [" {", " lr", " /=", " 10", ";", " pray", "()", ";", " }"]],
  [["git", " commit", " -m"], [" \"works", " on", " my", " machine", "\""]],
  [["SELECT", " cause", " FROM", " bugs"], [" WHERE", " hours_spent", " >", " 3", " AND", " fix", " =", " 'typo'", ";"]],
  [["model", ".fit", "(data", ")"], [" #", " epoch", " 1", "/100", ",", " eta", ":", " 3", " days"]],
  [["pip", " install"], [" sleep", "  #", " ERROR", ":", " no", " matching", " version"]],
];

const POOL = [" sleep", " coffee", " panic", " TODO", " cry()", " retry", " later", " NaN", " deadline", " tea", " maybe", " undefined", " 404", " again", " sigh", " hope"];
const LAYERS = [5, 7, 7, 5];
const ROWS = 6;
const STEP_MS = 1500;
const HOLD_MS = 2400;

const hash = (s: string) => {
  let v = 2166136261;
  for (const c of s) v = Math.imul(v ^ c.charCodeAt(0), 16777619);
  return ((v >>> 0) % 10000) / 10000;
};
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const vis = (t: string) => t.replace(/^ /, "·");

function rgb(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const n = parseInt(v.replace("#", ""), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

function readPalette() {
  return {
    mint: rgb("--mint", "#3dffb0"),
    dim: rgb("--mint-dim", "#1f8f66"),
    amber: rgb("--amber", "#ffb547"),
    line: rgb("--line", "#17262b"),
    ink: rgb("--ink", "#d7e0dc"),
    muted: rgb("--muted", "#8a9b95"),
    bg: rgb("--bg", "#05070a"),
    surface: rgb("--surface", "#0a1013"),
    surface2: rgb("--surface-2", "#0f181c"),
  };
}

type Node = { x: number; y: number; k: number; i: number; act: number };
type Edge = { a: Node; b: Node; pulse: boolean };

export function TokenPipeline({ active, low }: { active: boolean; low: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(cv).fontFamily;

    let pal = readPalette();
    let W = 0;
    let H = 0;
    let dots: [number, number][] = [];
    let mx = -999;
    let my = -999;
    let ripples: { x: number; y: number; t: number }[] = [];
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let compact = false;
    let col: Record<string, [number, number]> = {};
    let top = 0;
    let row = 0;
    let ch = 0;
    let lineY = 0;
    let headY = 0;

    const c = (k: keyof typeof pal, a = 1) => `rgba(${pal[k]},${a})`;

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      if (!low) for (let y = 11; y < H; y += 22) for (let x = 11; x < W; x += 22) dots.push([x, y]);

      compact = W < 560;
      const width = Math.min(W - 24, 920);
      const left = (W - width) / 2;
      lineY = 8;
      headY = lineY + 58;
      top = headY + 14;
      row = Math.max(22, Math.min(40, (H - top - 8) / ROWS));
      ch = Math.round(row * 0.82);

      const keys = compact ? ["tok", "att", "smp"] : ["tok", "emb", "att", "net", "smp"];
      const fr = compact ? [0.34, 0.36, 0.3] : [0.18, 0.15, 0.21, 0.24, 0.22];
      const gap = compact ? 10 : 14;
      const inner = width - gap * (keys.length - 1);
      let x = left;
      col = {};
      keys.forEach((k, i) => {
        col[k] = [x, x + inner * fr[i]];
        x += inner * fr[i] + gap;
      });
      col.line = [left, left + width];

      nodes = [];
      edges = [];
      if (col.net) {
        const [a, b] = col.net;
        const bottom = top + (ROWS - 1) * row + ch;
        LAYERS.forEach((n, k) => {
          const nx = a + 8 + ((b - a - 16) * k) / (LAYERS.length - 1);
          for (let i = 0; i < n; i++)
            nodes.push({ x: nx, y: top + (i + 0.5) * ((bottom - top) / n), k, i, act: 0 });
        });
        for (const a2 of nodes)
          for (const b2 of nodes)
            if (b2.k === a2.k + 1) edges.push({ a: a2, b: b2, pulse: hash(`${a2.k}-${a2.i}-${b2.i}`) < 0.35 });
      }
    };

    let si = 0;
    let gi = still ? 6 : 0;
    let start = performance.now();
    let hold = 0;
    let cand: [string, number][] = [];
    let ctxTokens: string[] = [];

    const prep = () => {
      const [prompt, gen] = SNIPPETS[si];
      ctxTokens = prompt.concat(gen.slice(0, gi));
      const next = gen[gi];
      const distract = POOL.filter((t) => t !== next)
        .sort((a, b) => hash(a + gi + si) - hash(b + gi + si))
        .slice(0, 2);
      const p0 = 0.55 + hash(next + gi) * 0.35;
      const p1 = (1 - p0) * 0.65;
      cand = [
        [next, p0],
        [distract[0], p1],
        [distract[1], 1 - p0 - p1],
      ];
      for (const n of nodes) n.act = 0.2 + 0.8 * hash(`${n.k}.${n.i}${next}${gi}`);
    };

    const softRow = (tk: string[], i: number) => {
      const s = tk.map((t, j) =>
        j > i ? -1e9 : hash(`${tk[i]}|${t}`) * 2.2 + (j === i ? 1 : 0) + (j === i - 1 ? 0.6 : 0),
      );
      const m = Math.max(...s);
      const e = s.map((v) => Math.exp(v - m));
      const z = e.reduce((a, b) => a + b, 0);
      return e.map((v) => v / z);
    };

    const card = (k: string, y: number, hot: boolean) => {
      const [a, b] = col[k];
      ctx.fillStyle = c("surface2");
      ctx.fillRect(a, y, b - a, ch);
      ctx.strokeStyle = hot ? c("amber") : c("line");
      ctx.strokeRect(a + 0.5, y + 0.5, b - a - 1, ch - 1);
    };

    const header = (n: string, t: string, k: string) => {
      const [a, b] = col[k];
      ctx.font = `10px ${font}`;
      ctx.fillStyle = c("mint");
      ctx.fillText(n, a, headY);
      ctx.fillStyle = c("muted");
      ctx.fillText(t, a + 20, headY);
      ctx.strokeStyle = c("line");
      ctx.beginPath();
      ctx.moveTo(a, headY + 6.5);
      ctx.lineTo(b, headY + 6.5);
      ctx.stroke();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      ripples = ripples.filter((r) => now - r.t < 1600);

      for (const [bx, by] of dots) {
        const dx = bx - mx;
        const dy = by - my;
        const d = Math.hypot(dx, dy) || 1;
        let push = d < 130 ? (1 - d / 130) ** 2 * 16 : 0;
        let glow = d < 130 ? (1 - d / 130) * 0.35 : 0;
        for (const r of ripples) {
          const age = (now - r.t) / 1000;
          const off = Math.abs(Math.hypot(bx - r.x, by - r.y) - age * 320);
          if (off < 24) {
            const k = (1 - off / 24) * (1 - age / 1.6);
            push += k * 8;
            glow += k * 0.5;
          }
        }
        ctx.fillStyle = c("mint", 0.07 + glow);
        ctx.fillRect(bx + (dx / d) * push - 0.8, by + (dy / d) * push - 0.8, 1.6, 1.6);
      }

      const p = still || hold ? (still ? 0.92 : 1) : clamp((now - start) / STEP_MS);
      const [prompt, gen] = SNIPPETS[si];
      const done = prompt.concat(gen.slice(0, gi));

      const [la, lb] = col.line;
      ctx.font = `15px ${font}`;
      const pw = ctx.measureText(prompt.join("")).width;
      const tw = ctx.measureText(done.join("")).width;
      const off = Math.max(0, tw - (lb - la - 48));
      ctx.save();
      ctx.beginPath();
      ctx.rect(la, lineY, lb - la, 40);
      ctx.clip();
      ctx.fillStyle = c("surface", 0.85);
      ctx.fillRect(la, lineY, lb - la, 40);
      ctx.fillStyle = c("mint");
      ctx.fillText("$", la + 12, lineY + 25);
      ctx.fillStyle = c("ink");
      ctx.fillText(prompt.join(""), la + 30 - off, lineY + 25);
      ctx.fillStyle = c("mint");
      ctx.fillText(gen.slice(0, gi).join(""), la + 30 - off + pw, lineY + 25);
      if (still || Math.floor(now / 450) % 2) {
        ctx.fillStyle = c("amber");
        ctx.fillRect(la + 32 - off + tw, lineY + 12, 8, 17);
      }
      ctx.restore();
      ctx.strokeStyle = c("line");
      ctx.strokeRect(la + 0.5, lineY + 0.5, lb - la - 1, 39);

      header("01", "tokenize", "tok");
      if (col.emb) header("02", "embed", "emb");
      header("03", "attend", "att");
      if (col.net) header("04", "forward", "net");
      header("05", "sample", "smp");

      const tk = ctxTokens.slice(-ROWS);
      const n = tk.length;
      const appear = clamp(p / 0.2);
      const lit = clamp((p - 0.4) / 0.2);

      ctx.setLineDash([1, 4]);
      ctx.strokeStyle = c("line", 0.5);
      for (let i = 0; i < ROWS; i++) {
        const y = top + i * row + ch + 3;
        ctx.beginPath();
        ctx.moveTo(col.tok[0], y);
        ctx.lineTo(col.att[1], y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      const cw = (col.att[1] - col.att[0] - (ROWS - 1) * 3) / ROWS;
      for (let i = 0; i < ROWS; i++) {
        const y = top + i * row;
        const t = tk[i];
        const newest = i === n - 1;
        const alpha = newest ? appear : 1;
        if (t !== undefined) {
          ctx.globalAlpha = alpha;
          card("tok", y, newest);
          ctx.font = `12px ${font}`;
          ctx.fillStyle = newest ? c("amber") : c("ink");
          ctx.fillText(vis(t).slice(0, 10), col.tok[0] + 7, y + ch * 0.45);
          const id = Math.floor(hash(t) * 50257);
          ctx.font = `10px ${font}`;
          ctx.fillStyle = c("muted");
          ctx.fillText(`${id} · 0x${id.toString(16).padStart(4, "0")}`, col.tok[0] + 7, y + ch * 0.85);

          if (col.emb) {
            card("emb", y, false);
            const grow = newest ? clamp((p - 0.2) / 0.2) : 1;
            const bw = (col.emb[1] - col.emb[0] - 12) / 10 - 2;
            for (let k = 0; k < 10; k++) {
              const v = hash(`${t}#${k}`) * 2 - 1;
              const bh = v * (ch * 0.36) * grow;
              ctx.fillStyle = v > 0 ? c("mint", 0.35 + Math.abs(v) * 0.6) : c("amber", 0.3 + Math.abs(v) * 0.5);
              ctx.fillRect(col.emb[0] + 6 + k * (bw + 2), y + ch / 2 - Math.max(bh, 0), bw, Math.abs(bh) || 1);
            }
          }
          ctx.globalAlpha = 1;
        }

        const w = t !== undefined ? softRow(tk, i) : [];
        for (let j = 0; j < ROWS; j++) {
          const cx = col.att[0] + j * (cw + 3);
          if (t === undefined || j >= n || j > i) {
            ctx.strokeStyle = c("line");
            ctx.setLineDash([2, 3]);
            ctx.strokeRect(cx + 0.5, y + 0.5, cw - 1, ch - 1);
            ctx.setLineDash([]);
            continue;
          }
          ctx.globalAlpha = alpha;
          ctx.fillStyle = newest ? c("mint", 0.06 + w[j] * 0.94 * lit) : c("dim", 0.08 + w[j] * 0.55);
          ctx.fillRect(cx, y, cw, ch);
          ctx.globalAlpha = 1;
          if (newest && lit > 0.8 && w[j] > 0.25 && cw > 18) {
            ctx.fillStyle = c("bg");
            ctx.font = `9px ${font}`;
            ctx.fillText(w[j].toFixed(2).slice(1), cx + 3, y + ch / 2 + 3);
          }
        }
      }

      let hover: Node | null = null;
      if (col.net) {
        const g = still ? 4 : ((p - 0.6) / 0.25) * 3;
        let best = 12;
        for (const nd of nodes) {
          const d = Math.hypot(nd.x - mx, nd.y - my);
          if (d < best) {
            best = d;
            hover = nd;
          }
        }
        for (const e of edges) {
          const on = hover !== null && (e.a === hover || e.b === hover);
          ctx.strokeStyle = on ? c("amber") : g >= e.a.k + 1 ? c("mint", 0.14) : c("dim", 0.1);
          ctx.lineWidth = on ? 1.2 : 0.7;
          ctx.beginPath();
          ctx.moveTo(e.a.x, e.a.y);
          ctx.lineTo(e.b.x, e.b.y);
          ctx.stroke();
          const q = g - e.a.k;
          if (e.pulse && q > 0 && q < 1 && !hold && !still) {
            ctx.fillStyle = c("mint");
            ctx.beginPath();
            ctx.arc(e.a.x + (e.b.x - e.a.x) * q, e.a.y + (e.b.y - e.a.y) * q, 1.8, 0, 7);
            ctx.fill();
          }
        }
        ctx.lineWidth = 1;
        for (const nd of nodes) {
          const on = g >= nd.k || hold;
          ctx.fillStyle = nd === hover ? c("amber") : on ? c("mint", 0.25 + nd.act * 0.75) : c("surface2");
          ctx.strokeStyle = on ? c("mint") : c("dim");
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, 4.5, 0, 7);
          ctx.fill();
          ctx.stroke();
        }
      }

      const fill = clamp((p - 0.85) / 0.1);
      cand.forEach(([t, pp], i) => {
        const y = top + i * 2 * row;
        const chosen = i === 0 && p > 0.9;
        card("smp", y, chosen);
        const [a, b] = col.smp;
        ctx.font = `12px ${font}`;
        ctx.fillStyle = chosen ? c("amber") : c("ink");
        ctx.fillText(vis(t).slice(0, 9), a + 7, y + ch * 0.45);
        ctx.font = `10px ${font}`;
        ctx.fillStyle = c("muted");
        const pct = `${(pp * fill * 100).toFixed(0)}%`;
        ctx.fillText(pct, b - 7 - ctx.measureText(pct).width, y + ch * 0.45);
        ctx.fillStyle = c("bg");
        ctx.fillRect(a + 7, y + ch * 0.64, b - a - 14, 5);
        ctx.fillStyle = chosen ? c("amber") : i === 0 ? c("mint") : c("dim");
        ctx.fillRect(a + 7, y + ch * 0.64, (b - a - 14) * pp * fill, 5);
      });

      if (hover) {
        const label = `L${hover.k} n${hover.i}  act ${hover.act.toFixed(2)}  in ${hover.k ? LAYERS[hover.k - 1] : 0} out ${LAYERS[hover.k + 1] ?? 0}`;
        ctx.font = `11px ${font}`;
        const lw = ctx.measureText(label).width + 12;
        const tx = Math.min(hover.x + 10, W - lw - 4);
        const ty = hover.y - 34;
        ctx.fillStyle = c("bg");
        ctx.fillRect(tx, ty, lw, 26);
        ctx.strokeStyle = c("amber");
        ctx.strokeRect(tx + 0.5, ty + 0.5, lw - 1, 25);
        ctx.fillStyle = c("ink");
        ctx.fillText(label, tx + 6, ty + 17);
      }

      if (still) return;
      if (!hold && p >= 1) {
        gi++;
        if (gi >= gen.length) hold = now;
        else {
          start = now;
          prep();
        }
      }
      if (hold && now - hold > HOLD_MS) {
        hold = 0;
        gi = 0;
        si = (si + 1) % SNIPPETS.length;
        start = now;
        prep();
      }
    };

    layout();
    prep();

    let raf = 0;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const redraw = () => {
      layout();
      draw(performance.now());
    };
    if (still) redraw();
    else if (active) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(redraw);
    ro.observe(cv);
    const mo = new MutationObserver(() => {
      pal = readPalette();
      if (still) redraw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "style"] });

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      if (still) draw(performance.now());
    };
    const onLeave = () => {
      mx = -999;
      my = -999;
    };
    const onDown = (e: PointerEvent) => {
      if (still) return;
      const r = cv.getBoundingClientRect();
      ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
    };
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);
    cv.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
      cv.removeEventListener("pointerdown", onDown);
    };
  }, [active, low]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="A small language model writing code one token at a time"
      role="img"
      className="block h-full w-full touch-pan-y font-mono"
    />
  );
}
