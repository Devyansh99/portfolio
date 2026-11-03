"use client";

import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/data/projects";
import { privateNote } from "@/data/copy";
import { Frame } from "../Frame";

const statusTone: Record<Project["status"], string> = {
  live: "text-mint",
  "in progress": "text-amber",
  private: "text-muted",
  academic: "text-muted",
};

export function CreationsTab({ active }: { active: boolean }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (open) return;
      if (e.key === "ArrowRight") setI((v) => Math.min(projects.length - 1, v + 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, active]);

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-4 py-6">
      <p className="caps mb-2 text-sm font-semibold tracking-[0.2em] text-ink">
        Creations
      </p>

      <div
        className="relative flex w-full flex-1 items-center justify-center [perspective:1200px]"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (dx < -50) setI((v) => Math.min(projects.length - 1, v + 1));
          if (dx > 50) setI((v) => Math.max(0, v - 1));
        }}
      >
        <button
          type="button"
          aria-label="Previous project"
          disabled={i === 0}
          onClick={() => setI((v) => Math.max(0, v - 1))}
          className="absolute left-0 z-10 px-3 py-6 text-3xl text-muted hover:text-mint disabled:opacity-20 sm:left-6"
        >
          ‹
        </button>

        <div className="relative h-[26rem] w-full max-w-4xl">
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
                className={`absolute left-1/2 top-1/2 h-[25rem] w-[17.5rem] transition-all duration-500 sm:w-[21rem] ${
                  isActive ? "z-10" : "hidden cursor-pointer sm:block"
                }`}
              >
                <Frame className="h-full bg-surface/90" tone={isActive ? "mint" : "amber"}>
                  <div className="flex h-full flex-col p-5">
                    <p className="tag flex justify-between">
                      <span>{p.period}</span>
                      <span className={statusTone[p.status]}>{p.status}</span>
                    </p>
                    <h3 className="caps mt-5 text-3xl font-bold leading-none text-mint">
                      {p.title}
                    </h3>
                    <p className="mt-2 font-mono text-xs text-amber">{p.kicker}</p>
                    <p className="mt-5 text-[14px] leading-relaxed text-ink/90">
                      {p.summary}
                    </p>
                    {isActive && (
                      <button
                        type="button"
                        onClick={() => setOpen(p)}
                        className="caps mt-auto border border-mint px-3 py-2 text-sm font-semibold text-mint transition hover:bg-mint hover:text-bg"
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

      <p className="tag mt-2">
        {i + 1}/{projects.length} · swipe or use ← → keys
      </p>

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
                <p className="tag">
                  {open.period} · {open.status}
                </p>
                <h3
                  id="creation-title"
                  className="caps mt-2 text-4xl font-bold text-mint"
                >
                  {open.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-amber">{open.kicker}</p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(null)}
                className="caps shrink-0 border border-line px-3 py-1.5 text-sm text-muted hover:border-mint hover:text-mint"
              >
                close · esc
              </button>
            </div>

            <p className="mt-6 text-lg leading-snug text-ink">{open.what}</p>

            <h4 className="tag mt-8 text-mint">What it does</h4>
            <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-ink/85">
              {open.does.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <h4 className="tag mt-8 text-mint">How it works</h4>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/85">
              {open.how}
            </p>

            {open.metrics.length > 0 && (
              <>
                <h4 className="tag mt-8 text-mint">By the numbers</h4>
                <dl className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {open.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="border border-line bg-surface-2 p-3"
                    >
                      <dd className="font-mono text-xl font-bold text-mint">
                        {m.value}
                      </dd>
                      <dt className="tag">{m.label}</dt>
                    </div>
                  ))}
                </dl>
              </>
            )}

            <h4 className="tag mt-8 text-mint">Built with</h4>
            <ul className="mt-2 flex flex-wrap gap-2">
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
              <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
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
              <p className="mt-8 font-mono text-xs text-muted">
                {"> "}
                {privateNote}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
