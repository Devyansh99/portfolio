"use client";

import { useState } from "react";
import { projects, type Project } from "@/data/projects";
import { ProjectModal } from "./ProjectModal";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const statusStyle: Record<Project["status"], string> = {
  live: "border-mint/50 text-mint",
  "in progress": "border-amber/50 text-amber",
  private: "border-line text-muted",
  academic: "border-line text-muted",
};

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="02" command="ls ./projects" title="Projects" />

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={(i % 2) * 0.08}>
            <button
              type="button"
              onClick={() => setActive(p)}
              className="group flex h-full w-full flex-col rounded-lg border border-line bg-surface p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-mint/60 hover:shadow-[0_0_32px_-8px_rgba(61,255,176,0.35)]"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-mono text-xl font-bold text-ink group-hover:text-mint">
                  {p.title}
                </h3>
                <span
                  className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider ${statusStyle[p.status]}`}
                >
                  {p.status}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-amber">{p.kicker}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/80">
                {p.summary}
              </p>

              {p.metrics.length > 0 && (
                <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                  {p.metrics.slice(0, 3).map((m) => (
                    <div key={m.label}>
                      <dt className="font-mono text-[11px] uppercase text-muted">
                        {m.label}
                      </dt>
                      <dd className="font-mono text-lg font-bold text-mint">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              <ul className="mt-5 flex flex-wrap gap-2">
                {p.stack.slice(0, 5).map((s) => (
                  <li
                    key={s}
                    className="rounded bg-surface-2 px-2 py-1 font-mono text-[11px] text-muted"
                  >
                    {s}
                  </li>
                ))}
              </ul>
              <span className="mt-5 font-mono text-xs text-mint opacity-70 transition group-hover:opacity-100">
                open --details →
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
