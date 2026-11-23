"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { skillGroups, skillUsage } from "@/data/skills";
import { achievements } from "@/data/timeline";
import { projectCodes as codes } from "@/data/codes";
import { SkillGlyph } from "../SkillGlyph";
import { TabHeader } from "../TabHeader";

const titleOf = (id: string) => projects.find((p) => p.id === id)?.title ?? id;

const toolbox = skillGroups
  .map((g) => ({
    name: g.command.split(" ")[0],
    items: g.items.filter((s) => !skillUsage[s]),
  }))
  .filter((g) => g.items.length > 0);

const skillCount = skillGroups.reduce((n, g) => n + g.items.length, 0);

export function SkillsTab() {
  const [skill, setSkill] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const [cell, setCell] = useState<{
    s: string;
    p: string;
    x: number;
    y: number;
  } | null>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clear = () => setCell(null);
    document.addEventListener("scroll", clear, true);
    return () => document.removeEventListener("scroll", clear, true);
  }, []);

  const related = (s: string, p: string) =>
    skill === s || project === p || (skill === null && project === null);

  const readout = skill
    ? `${skill} -> ${(skillUsage[skill] ?? []).map(titleOf).join(", ")}`
    : project
      ? `${titleOf(project)} <- ${skillGroups
          .flatMap((g) => g.items)
          .filter((s) => skillUsage[s]?.includes(project))
          .join(", ")}`
      : "hover a skill or a project code";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 font-mono text-sm sm:px-8">
      <TabHeader id="skills" cmd="cat skills.md" title="Skill matrix loaded." />
      <p className="mb-5 mt-4 min-h-[4.5rem] text-mint" aria-live="polite">
        {"> "}
        {readout}
      </p>

      <dl className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          [String(projects.length), "projects"],
          [String(skillCount), "skills"],
          ["1", "paper under review"],
          [String(achievements.length), "awards and courses"],
        ].map(([n, label]) => (
          <div key={label} className="border border-line bg-surface-2 px-3 py-2">
            <dd className="text-2xl font-bold text-mint">{n}</dd>
            <dt className="tag">{label}</dt>
          </div>
        ))}
      </dl>

      <div
        onPointerLeave={() => {
          setSkill(null);
          setProject(null);
          setCell(null);
        }}
      >
        <div
          ref={headRef}
          className="sticky top-0 z-20 overflow-hidden border-b border-line bg-bg pb-2 pt-2"
        >
          <div className="flex min-w-[22rem] items-end">
            <div className="sticky left-0 z-10 w-40 shrink-0 bg-bg text-muted sm:w-52">skill</div>
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onPointerEnter={() => {
                  setProject(p.id);
                  setSkill(null);
                }}
                onFocus={() => {
                  setProject(p.id);
                  setSkill(null);
                }}
                aria-label={p.title}
                className={`w-9 shrink-0 text-center text-xs transition-colors sm:w-11 ${
                  project === p.id || cell?.p === p.id
                    ? "font-bold text-mint"
                    : "text-muted"
                }`}
              >
                {codes[p.id]}
              </button>
            ))}
          </div>
        </div>

        <div
          className="touch-pan-x touch-pan-y overflow-x-auto overflow-y-hidden overscroll-x-contain py-1 [scrollbar-color:var(--mint-dim)_transparent] [scrollbar-width:thin]"
          onScroll={(e) => {
            if (headRef.current) headRef.current.scrollLeft = e.currentTarget.scrollLeft;
          }}
        >
        <div className="min-w-[22rem]">

          {skillGroups.map((g) => {
            const rows = g.items.filter((s) => skillUsage[s]);
            if (rows.length === 0) return null;
            return (
              <div key={g.command} className="pt-4">
                <p className="pb-1 text-xs text-amber">
                  # {g.command.split(" ")[0]}
                </p>
                {rows.map((s) => (
                  <div
                    key={s}
                    onPointerEnter={() => {
                      setSkill(s);
                      setProject(null);
                    }}
                    className="flex items-center"
                  >
                    <button
                      type="button"
                      aria-label={`${s}: ${(skillUsage[s] ?? []).map(titleOf).join(", ")}`}
                      onFocus={() => {
                        setSkill(s);
                        setProject(null);
                      }}
                      onClick={() => {
                        setSkill(s);
                        setProject(null);
                      }}
                      className={`sticky left-0 z-10 flex w-40 shrink-0 items-center gap-2 bg-bg py-1.5 text-left sm:w-52 ${
                        skill === s ? "text-mint" : "text-ink"
                      }`}
                    >
                      <SkillGlyph
                        skill={s}
                        className={skill === s ? "text-mint" : "text-muted"}
                      />
                      {s}
                    </button>
                    {projects.map((p) => {
                      const used = skillUsage[s].includes(p.id);
                      const hot = used && related(s, p.id);
                      const here = cell?.s === s && cell.p === p.id;
                      const crossed = cell !== null && (cell.s === s || cell.p === p.id);
                      return (
                        <span
                          key={p.id}
                          className={`flex w-9 shrink-0 justify-center self-stretch py-1.5 sm:w-11 ${
                            crossed && !here ? "bg-mint/5" : ""
                          }`}
                          aria-hidden
                          onPointerEnter={(e) =>
                            setCell({ s, p: p.id, x: e.clientX, y: e.clientY })
                          }
                          onPointerMove={(e) =>
                            setCell({ s, p: p.id, x: e.clientX, y: e.clientY })
                          }
                          onPointerLeave={() => setCell(null)}
                        >
                          <span
                            className={`size-3.5 rounded-[3px] border transition-colors duration-100 ${
                              used
                                ? hot
                                  ? "border-mint bg-mint shadow-[0_0_10px_rgba(61,255,176,0.6)]"
                                  : "border-mint/30 bg-mint/20"
                                : "border-line bg-surface-2"
                            } ${here ? "ring-2 ring-amber ring-offset-1 ring-offset-bg" : ""}`}
                          />
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {cell && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50 border border-mint bg-bg px-2.5 py-1.5 text-xs shadow-[0_0_12px_rgba(61,255,176,0.35)]"
          style={{ left: cell.x + 14, top: cell.y - 46 }}
        >
          <p className="font-bold text-mint">
            {codes[cell.p]} · {titleOf(cell.p)}
          </p>
          <p className="text-ink">
            {cell.s}{" "}
            {skillUsage[cell.s]?.includes(cell.p) ? (
              <span className="text-amber">✓ used</span>
            ) : (
              <span className="text-muted">not used</span>
            )}
          </p>
        </div>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1 border-t border-line pt-4 text-xs text-muted sm:grid-cols-4">
        {projects.map((p) => (
          <div key={p.id} className="flex gap-2">
            <dt className="text-mint">{codes[p.id]}</dt>
            <dd>{p.title}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 border-t border-line pt-4 text-muted">
        <span className="text-mint">$</span> ls --toolbox{" "}
        <span className="text-xs">({skillCount} skills)</span>
      </p>
      <div className="mt-3 space-y-4">
        {toolbox.map((g) => (
          <div key={g.name}>
            <p className="pb-1.5 text-xs text-amber"># {g.name}</p>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li
                  key={s}
                  className="group flex items-center gap-2 border border-line bg-surface-2 px-2.5 py-1.5 text-ink transition-colors hover:border-mint/60 hover:text-mint"
                >
                  <SkillGlyph
                    skill={s}
                    size={16}
                    className="text-muted transition-colors group-hover:text-mint"
                  />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 border-t border-line pt-4 text-muted">
        <span className="text-mint">$</span> git tag --list
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {achievements.map((a) => (
          <li
            key={a}
            className="flex gap-3 border border-line bg-surface-2 px-3 py-2 text-[13px] text-ink/85"
          >
            <span className="text-amber" aria-hidden>
              ◆
            </span>
            <span className="font-sans">{a}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
