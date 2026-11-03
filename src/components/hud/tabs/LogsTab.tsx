"use client";

import { useState } from "react";
import { TabHeader } from "../TabHeader";
import { timeline, type TimelineEntry } from "@/data/timeline";

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
    color: "#6f807a",
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

const ranges = Object.fromEntries(
  lanes.map((l) => {
    const idx = timeline
      .map((e, i) => (e.kind === l.kind ? i : -1))
      .filter((i) => i >= 0);
    return [l.kind, [Math.min(...idx), Math.max(...idx)] as const];
  }),
);

export function LogsTab() {
  const [open, setOpen] = useState<Record<string, boolean>>({ "0": true, "1": true });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 font-mono text-sm sm:px-8">
      <TabHeader id="logs" cmd="git log --graph --all" title="Data log dump initialized." />

      <p className="mb-6 mt-6 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
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
                  const [first, last] = ranges[l.kind];
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
                  className="absolute size-2.5 rounded-full ring-4 ring-bg"
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
                  onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
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

                {isOpen && (e.parts || lines.length > 0) && (
                  <div className="mt-3 space-y-1.5 border-l border-line pl-4 text-xs leading-relaxed">
                    <p className="text-muted">
                      @@ {e.parts?.length ?? lines.length}{" "}
                      {(e.parts?.length ?? lines.length) === 1 ? "change" : "changes"} @@
                    </p>
                    {e.summary && (
                      <p className="diff-line pb-2 font-sans text-[14px] leading-relaxed text-ink">
                        {e.summary}
                      </p>
                    )}
                    {e.parts?.map((part, n) => (
                      <div
                        key={part.label}
                        className="diff-line pb-2"
                        style={{ animationDelay: `${(n + 1) * 60}ms` }}
                      >
                        <p className="text-mint">+ {part.label}</p>
                        <p className="mt-0.5 pl-4 font-sans text-[13px] leading-relaxed text-ink/85">
                          {part.text}
                        </p>
                      </div>
                    ))}
                    {lines.map((p, n) => (
                      <p
                        key={p}
                        className="diff-line"
                        style={{ animationDelay: `${n * 60}ms` }}
                      >
                        <span className="mr-2 text-mint">+</span>
                        <span className="font-sans text-[13px] text-ink/85">{p}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
