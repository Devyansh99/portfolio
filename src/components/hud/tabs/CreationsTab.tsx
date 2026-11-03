"use client";

import { useEffect, useState } from "react";
import { projects, type Project } from "@/data/projects";
import { mulberry32 } from "@/lib/rng";
import { Frame } from "../Frame";

function seedOf(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

function Glyph({ id }: { id: string }) {
  const r = mulberry32(seedOf(id));
  const nodes = Array.from({ length: 22 }, () => ({
    x: 6 + r() * 108,
    y: 6 + r() * 58,
  }));
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => {
    const near = nodes
      .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 }))
      .filter((n) => n.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    near.forEach((n) => edges.push([i, n.j]));
  });
  return (
    <svg viewBox="0 0 120 70" className="h-full w-full" aria-hidden>
      {edges.map(([a, b], k) => (
        <line
          key={k}
          x1={nodes[a].x.toFixed(1)}
          y1={nodes[a].y.toFixed(1)}
          x2={nodes[b].x.toFixed(1)}
          y2={nodes[b].y.toFixed(1)}
          stroke="var(--mint)"
          strokeOpacity="0.35"
          strokeWidth="0.4"
        />
      ))}
      {nodes.map((n, k) => (
        <circle
          key={k}
          cx={n.x.toFixed(1)}
          cy={n.y.toFixed(1)}
          r={k % 7 === 0 ? 1.6 : 0.9}
          fill={k % 7 === 0 ? "var(--amber)" : "var(--mint)"}
        />
      ))}
    </svg>
  );
}

const statusTone: Record<Project["status"], string> = {
  live: "text-mint",
  "in progress": "text-amber",
  private: "text-muted",
  academic: "text-muted",
};

export function CreationsTab() {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (open) return;
      if (e.key === "ArrowRight") setI((v) => Math.min(projects.length - 1, v + 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const active = projects[i];

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-4 py-6">
      <p className="caps mb-2 text-sm font-semibold tracking-[0.2em] text-ink">
        Creations
      </p>

      <div className="relative flex w-full flex-1 items-center justify-center [perspective:1200px]">
        <button
          type="button"
          aria-label="Previous project"
          disabled={i === 0}
          onClick={() => setI((v) => Math.max(0, v - 1))}
          className="absolute left-0 z-10 px-3 py-6 text-3xl text-muted hover:text-mint disabled:opacity-20 sm:left-6"
        >
          ‹
        </button>

        <div className="relative h-[25rem] w-full max-w-4xl">
          {projects.map((p, idx) => {
            const off = idx - i;
            if (Math.abs(off) > 1) return null;
            const isActive = off === 0;
            return (
              <div
                key={p.id}
                role={isActive ? undefined : "button"}
                tabIndex={isActive ? undefined : 0}
                aria-label={isActive ? undefined : `Show ${p.title}`}
                onClick={isActive ? undefined : () => setI(idx)}
                onKeyDown={
                  isActive
                    ? undefined
                    : (e) => {
                        if (e.key === "Enter") setI(idx);
                      }
                }
                style={{
                  transform: `translate(-50%, -50%) translateX(${off * 108}%) rotateY(${-off * 36}deg) scale(${isActive ? 1 : 0.82})`,
                  opacity: isActive ? 1 : 0.4,
                }}
                className={`absolute left-1/2 top-1/2 h-[24rem] w-[17rem] transition-all duration-500 sm:w-80 ${
                  isActive ? "z-10" : "hidden cursor-pointer sm:block"
                }`}
              >
                <Frame className="h-full bg-surface/90" tone={isActive ? "mint" : "amber"}>
                  <div className="flex h-full flex-col p-5">
                    <p className="tag flex justify-between">
                      <span>{p.period}</span>
                      <span className={statusTone[p.status]}>{p.status}</span>
                    </p>
                    <div className="my-3 h-24 border border-line bg-bg/60">
                      <Glyph id={p.id} />
                    </div>
                    <h3 className="caps text-2xl font-bold leading-none text-mint">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-ink/80">{p.kicker}</p>
                    {p.metrics[0] && (
                      <p className="mt-3 font-mono text-xs text-muted">
                        <span className="text-lg font-bold text-ink">
                          {p.metrics[0].value}
                        </span>{" "}
                        {p.metrics[0].label}
                      </p>
                    )}
                    <ul className="mt-auto flex flex-wrap gap-1">
                      {p.stack.slice(0, 4).map((s) => (
                        <li
                          key={s}
                          className="bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                    {isActive && (
                      <button
                        type="button"
                        onClick={() => setOpen(p)}
                        className="caps mt-3 border border-mint px-3 py-1.5 text-sm font-semibold text-mint transition hover:bg-mint hover:text-bg"
                      >
                        view details
                      </button>
                    )}
                  </div>
                </Frame>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Next project"
          disabled={i === projects.length - 1}
          onClick={() => setI((v) => Math.min(projects.length - 1, v + 1))}
          className="absolute right-0 z-10 px-3 py-6 text-3xl text-muted hover:text-mint disabled:opacity-20 sm:right-6"
        >
          ›
        </button>
      </div>

      <div className="mt-2 text-center">
        <p className="mx-auto max-w-xl text-sm text-ink/80">{active.summary}</p>
        <p className="tag mt-3">
          {i + 1}/{projects.length} · use ← → keys
        </p>
      </div>

      {open && (
        <div
          className="hud-scroll absolute inset-0 z-20 overflow-y-auto bg-bg/95 p-5 backdrop-blur-sm sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="creation-title"
        >
          <div className="mx-auto max-w-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  id="creation-title"
                  className="caps text-3xl font-bold text-mint"
                >
                  {open.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-amber">
                  {open.kicker} · {open.period}
                </p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(null)}
                className="caps border border-line px-3 py-1.5 text-sm text-muted hover:border-mint hover:text-mint"
              >
                close · esc
              </button>
            </div>

            <p className="mt-5 text-ink/90">{open.summary}</p>

            {open.metrics.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {open.metrics.map((m) => (
                  <div key={m.label} className="border border-line bg-surface-2 p-3">
                    <dd className="font-mono text-xl font-bold text-mint">
                      {m.value}
                    </dd>
                    <dt className="tag">{m.label}</dt>
                  </div>
                ))}
              </dl>
            )}

            <ul className="mt-6 space-y-3">
              {open.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm text-ink/85">
                  <span className="font-mono text-mint" aria-hidden>
                    &gt;
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-6 flex flex-wrap gap-2">
              {open.stack.map((s) => (
                <li
                  key={s}
                  className="bg-surface-2 px-2 py-1 font-mono text-xs text-muted"
                >
                  {s}
                </li>
              ))}
            </ul>

            {open.links.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-3 font-mono text-sm">
                {open.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-mint px-4 py-2 text-mint hover:bg-mint hover:text-bg"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-6 font-mono text-xs text-muted">
                {"> code is private. Happy to walk through it on a call."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
