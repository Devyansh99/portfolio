"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import { skillGroups, skillUsage } from "@/data/skills";
import { achievements } from "@/data/timeline";

const codes: Record<string, string> = {
  sadakvision: "SV",
  cognalytix: "CX",
  acadika: "AC",
  higan: "HG",
  adaptivebandit: "AB",
  glioblastoma: "GB",
  "digital-dorm-war": "DD",
};

const titleOf = (id: string) => projects.find((p) => p.id === id)?.title ?? id;

const alsoUse = skillGroups.flatMap((g) =>
  g.items.filter((s) => !skillUsage[s]),
);

export function SkillsTab() {
  const [skill, setSkill] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);

  const focused = skill !== null || project !== null;
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
    <div className="mx-auto max-w-3xl px-4 py-8 font-mono text-sm sm:px-8">
      <p className="caps text-center text-sm font-semibold tracking-[0.2em] text-ink">
        Skill matrix loaded.
      </p>
      <p className="mb-5 mt-4 min-h-5 text-mint" aria-live="polite">
        {"> "}
        {readout}
      </p>

      <div
        className="hud-scroll overflow-x-auto"
        onPointerLeave={() => {
          setSkill(null);
          setProject(null);
        }}
      >
        <div className="min-w-[22rem]">
          <div className="flex items-end border-b border-line pb-2">
            <div className="w-40 shrink-0 text-muted sm:w-52">skill</div>
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
                  project === p.id ? "text-mint" : "text-muted"
                }`}
              >
                {codes[p.id]}
              </button>
            ))}
          </div>

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
                    className={`flex items-center transition-opacity ${
                      focused &&
                      skill !== s &&
                      !(project && skillUsage[s].includes(project))
                        ? "opacity-40"
                        : ""
                    }`}
                  >
                    <button
                      type="button"
                      onFocus={() => {
                        setSkill(s);
                        setProject(null);
                      }}
                      className={`w-40 shrink-0 py-1.5 text-left sm:w-52 ${
                        skill === s ? "text-mint" : "text-ink"
                      }`}
                    >
                      {s}
                    </button>
                    {projects.map((p) => {
                      const used = skillUsage[s].includes(p.id);
                      const hot = used && related(s, p.id);
                      return (
                        <span
                          key={p.id}
                          className="flex w-9 shrink-0 justify-center sm:w-11"
                          aria-hidden
                        >
                          <span
                            className={`size-3.5 rounded-[3px] border transition ${
                              used
                                ? hot
                                  ? "border-mint bg-mint shadow-[0_0_10px_rgba(61,255,176,0.6)]"
                                  : "border-mint/30 bg-mint/20"
                                : "border-line bg-surface-2"
                            }`}
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

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1 border-t border-line pt-4 text-xs text-muted sm:grid-cols-4">
        {projects.map((p) => (
          <div key={p.id} className="flex gap-2">
            <dt className="text-mint">{codes[p.id]}</dt>
            <dd>{p.title}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 border-t border-line pt-4 text-muted">
        <span className="text-mint">$</span> also --comfortable-with
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-2">
        {alsoUse.map((s) => (
          <li
            key={s}
            className="border border-line bg-surface-2 px-2.5 py-1 text-ink"
          >
            {s}
          </li>
        ))}
      </ul>

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
