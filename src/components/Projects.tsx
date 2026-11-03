"use client";

import { useState } from "react";
import { sectionIntros, stageCaptions } from "@/data/copy";
import { projects, type Project } from "@/data/projects";
import { useCanRender3D } from "@/lib/capabilities";
import { setHoveredProject } from "@/lib/scene-store";
import { ProjectDrawer } from "./ProjectDrawer";
import { ProjectRow } from "./ProjectRow";
import { SectionHead } from "./SectionHead";

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [caption, setCaption] = useState(stageCaptions.default);
  const can3D = useCanRender3D();

  const hover = (p: Project | null) => {
    setHoveredProject(p ? p.id : null);
    setCaption(p ? (stageCaptions[p.id] ?? stageCaptions.default) : stageCaptions.default);
  };

  return (
    <section
      id="work"
      data-scene="projects"
      className="mx-auto max-w-[1360px] px-5 py-24 md:px-10 md:py-40"
    >
      <SectionHead
        index="02"
        label="work"
        title="Work"
        intro={sectionIntros.projects}
      />

      <div className="grid grid-cols-12 gap-x-6">
        <ul
          className={`col-span-12 ${can3D ? "lg:col-span-7" : "lg:col-span-10"}`}
          onPointerLeave={() => hover(null)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) hover(null);
          }}
        >
          {projects.map((p, i) => (
            <ProjectRow
              key={p.id}
              project={p}
              index={i}
              featured={i === 0}
              onOpen={() => setActive(p)}
              onHover={hover}
            />
          ))}
          <li className="border-t border-line" aria-hidden />
        </ul>

        {can3D && (
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-24 h-[70vh]">
              <p className="label absolute bottom-0 left-0 max-w-xs">
                fig. {caption === stageCaptions.default ? "00" : "·"} {caption}
              </p>
            </div>
          </div>
        )}
      </div>

      <ProjectDrawer project={active} onClose={() => setActive(null)} />
    </section>
  );
}
