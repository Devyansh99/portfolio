"use client";

import { useState } from "react";
import { sectionIntros } from "@/data/copy";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { SectionHead } from "./SectionHead";

const normalize = (s: string) => s.toLowerCase().replace(/\s+\d[\d.]*$/, "");

const usage = (() => {
  const map = new Map<string, string[]>();
  for (const p of projects) {
    for (const s of p.stack) {
      const key = normalize(s);
      const list = map.get(key) ?? [];
      if (!list.includes(p.title)) list.push(p.title);
      map.set(key, list);
    }
  }
  return map;
})();

export function Skills() {
  const [hovered, setHovered] = useState<{ group: string; item: string } | null>(
    null,
  );

  return (
    <section
      id="tools"
      data-scene="skills"
      className="mx-auto max-w-[1360px] px-5 py-24 md:px-10 md:py-40"
    >
      <SectionHead
        index="04"
        label="tools"
        title="Tools"
        intro={sectionIntros.skills}
      />

      <div onPointerLeave={() => setHovered(null)}>
        {skillGroups.map((g) => {
          const used =
            hovered?.group === g.label
              ? usage.get(normalize(hovered.item))
              : undefined;
          return (
            <div
              key={g.label}
              className="grid grid-cols-12 gap-x-6 border-t border-line py-6"
            >
              <p className="label col-span-12 md:col-span-3">{g.label}</p>
              <div className="col-span-12 md:col-span-9">
                <ul className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {g.items.map((item, i) => (
                    <li key={item} className="flex items-baseline gap-3">
                      <button
                        type="button"
                        onPointerEnter={() => setHovered({ group: g.label, item })}
                        onFocus={() => setHovered({ group: g.label, item })}
                        className={`text-xl transition-colors md:text-[28px] md:leading-tight ${
                          hovered?.item === item ? "text-ink" : "text-ink-2"
                        }`}
                      >
                        {item}
                      </button>
                      {i < g.items.length - 1 && (
                        <span className="text-line-strong" aria-hidden>
                          /
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="label mt-3 min-h-5">
                  {used ? `used in ${used.join(", ")}` : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
