"use client";

import { useState } from "react";
import { achievements, timeline, type TimelineEntry } from "@/data/timeline";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

type Lane = {
  kind: TimelineEntry["kind"];
  branch: string;
  x: number;
  color: string;
  chip: string;
};

const lanes: Lane[] = [
  {
    kind: "education",
    branch: "school",
    x: 14,
    color: "#6b7a75",
    chip: "border-muted/50 text-muted",
  },
  {
    kind: "role",
    branch: "lead",
    x: 40,
    color: "#ffb547",
    chip: "border-amber/50 text-amber",
  },
  {
    kind: "work",
    branch: "work",
    x: 66,
    color: "#3dffb0",
    chip: "border-mint/50 text-mint",
  },
];

const laneOf = (kind: TimelineEntry["kind"]) =>
  lanes.find((l) => l.kind === kind) as Lane;

function shortHash(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, "0").slice(0, 7);
}

const DOT_TOP = 11;

export function Timeline() {
  const [open, setOpen] = useState<Record<string, boolean>>({ "0": true });

  const range = (kind: TimelineEntry["kind"]) => {
    const idx = timeline
      .map((e, i) => (e.kind === kind ? i : -1))
      .filter((i) => i >= 0);
    return [Math.min(...idx), Math.max(...idx)] as const;
  };

  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="05"
        command="git log --graph --all"
        title="Experience & Education"
      />

      <Reveal>
        <div className="rounded-lg border border-line bg-surface/80 p-4 font-mono text-sm sm:p-6">
          <p className="mb-5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
            {lanes
              .slice()
              .reverse()
              .map((l) => (
                <span key={l.kind} className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: l.color }}
                    aria-hidden
                  />
                  {l.branch}
                </span>
              ))}
            <span className="sm:ml-auto">click a commit to see the diff</span>
          </p>

          <ol>
            {timeline.map((e, i) => {
              const lane = laneOf(e.kind);
              const isOpen = Boolean(open[i]);
              const lines = e.points ?? (e.detail ? [e.detail] : []);
              return (
                <li key={`${e.org}-${e.title}`} className="flex">
                  <div className="relative w-24 shrink-0 self-stretch" aria-hidden>
                    {lanes.map((l) => {
                      const [first, last] = range(l.kind);
                      if (i < first || i > last) return null;
                      return (
                        <span
                          key={l.kind}
                          className="absolute w-px"
                          style={{
                            left: l.x,
                            background: l.color,
                            opacity: 0.55,
                            top: i === first ? DOT_TOP : 0,
                            bottom: i === last ? `calc(100% - ${DOT_TOP}px)` : 0,
                          }}
                        />
                      );
                    })}
                    <span
                      className="absolute size-2.5 rounded-full ring-4 ring-surface"
                      style={{
                        left: lane.x - 5,
                        top: DOT_TOP - 5,
                        background: lane.color,
                        boxShadow: `0 0 12px ${lane.color}`,
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1 pb-7">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpen((o) => ({ ...o, [i]: !o[i] }))
                      }
                      className="group block w-full text-left"
                    >
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="text-amber">{shortHash(e.org + e.title)}</span>
                        {i === 0 && (
                          <span className="rounded border border-mint/50 px-1.5 py-px text-[11px] text-mint">
                            HEAD
                          </span>
                        )}
                        <span
                          className={`rounded border px-1.5 py-px text-[11px] ${lane.chip}`}
                        >
                          {lane.branch}
                        </span>
                        <span className="text-muted">{e.period}</span>
                      </span>
                      <span className="mt-1 block text-base font-bold text-ink group-hover:text-mint sm:text-lg">
                        {e.title} <span className="text-mint">@ {e.org}</span>
                      </span>
                    </button>

                    {isOpen && lines.length > 0 && (
                      <div className="mt-3 space-y-1.5 border-l border-line pl-4 text-xs leading-relaxed">
                        <p className="text-muted">
                          @@ {lines.length} {lines.length === 1 ? "change" : "changes"} @@
                        </p>
                        {lines.map((p) => (
                          <p key={p} className="text-mint/90">
                            <span className="mr-2 text-mint">+</span>
                            <span className="font-sans text-[13px] text-ink/85">
                              {p}
                            </span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-2 border-t border-line pt-5">
            <p className="text-xs text-muted">
              <span className="text-mint">$</span> git tag --list
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {achievements.map((a) => (
                <li
                  key={a}
                  className="flex gap-3 rounded border border-line bg-surface-2 px-3 py-2 text-[13px] text-ink/85"
                >
                  <span className="text-amber" aria-hidden>
                    ◆
                  </span>
                  <span className="font-sans">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
