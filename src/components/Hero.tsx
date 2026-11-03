"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { useCanRender3D, usePrefersReducedMotion } from "@/lib/capabilities";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const bootLines = [
  "$ ./boot portfolio --mode=interactive",
  "> loading modules: vision, rl, rag, agents ... ok",
  "> user: devyansh_agarwal",
  "> status: building",
];

const totalChars = bootLines.reduce((n, l) => n + l.length, 0);

function useTypedChars(total: number) {
  const reduce = usePrefersReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduce || count >= total) return;
    const t = setTimeout(() => setCount((c) => c + 1), count === 0 ? 400 : 22);
    return () => clearTimeout(t);
  }, [count, total, reduce]);

  return reduce ? total : count;
}

function renderTyped(lines: string[], typed: number) {
  let left = typed;
  return lines.map((line) => {
    const shown = line.slice(0, Math.max(0, left));
    left -= line.length;
    return shown;
  });
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const can3D = useCanRender3D();
  const typed = useTypedChars(totalChars);
  const lines = renderTyped(bootLines, typed);
  const done = typed >= totalChars;

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-svh items-center overflow-hidden px-4 pt-20 sm:px-6"
    >
      <div className="bg-grid absolute inset-0" aria-hidden />
      {can3D && (
        <div className="absolute inset-0 opacity-90" aria-hidden>
          <HeroScene eventSource={ref} />
        </div>
      )}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <p
          className="mb-8 min-h-[7.5rem] max-w-xl font-mono text-xs leading-6 text-muted sm:text-sm"
          aria-hidden
        >
          {lines.map((line, i) => (
            <span key={bootLines[i]} className="block">
              {line}
            </span>
          ))}
        </p>

        <h1 className="glow-mint font-mono text-4xl font-bold leading-tight tracking-tight text-mint sm:text-6xl lg:text-7xl">
          {profile.name}
          {done && <span className="caret" aria-hidden />}
        </h1>
        <p className="mt-4 font-mono text-sm text-amber sm:text-base">
          {profile.role}
        </p>
        <p className="mt-6 max-w-xl text-lg text-ink/90 sm:text-xl">
          {profile.tagline}
        </p>

        <div className="mt-10 flex flex-wrap gap-4 font-mono text-sm">
          <a
            href="#projects"
            className="rounded border border-mint bg-mint px-5 py-2.5 font-bold text-bg transition hover:bg-transparent hover:text-mint"
          >
            view projects
          </a>
          <a
            href="#research"
            className="rounded border border-line px-5 py-2.5 text-ink transition hover:border-mint hover:text-mint"
          >
            read the paper
          </a>
          <a
            href="#contact"
            className="rounded border border-line px-5 py-2.5 text-ink transition hover:border-mint hover:text-mint"
          >
            contact
          </a>
        </div>
      </div>
    </section>
  );
}
