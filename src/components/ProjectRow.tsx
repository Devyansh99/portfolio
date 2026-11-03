"use client";

import type { Project } from "@/data/projects";

type ProjectRowProps = {
  project: Project;
  index: number;
  featured: boolean;
  onOpen: () => void;
  onHover: (p: Project) => void;
};

export function ProjectRow({
  project,
  index,
  featured,
  onOpen,
  onHover,
}: ProjectRowProps) {
  const first = project.metrics[0];

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        onPointerEnter={() => onHover(project)}
        onFocus={() => onHover(project)}
        className={`group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 border-t border-line text-left transition-colors hover:border-line-strong md:grid-cols-[3.5rem_1fr_8rem_6rem] ${
          featured ? "py-9" : "py-6"
        }`}
      >
        <span className="label transition-colors group-hover:text-mint group-focus-visible:text-mint">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="block transition-transform duration-300 group-hover:translate-x-2">
          <span className="font-display font-condensed text-display-m block">
            {project.title}
          </span>
          <span className="mt-1 block text-[15px] text-ink-2">
            {project.kicker}
            {!featured && first && (
              <span className="label ml-3">
                {first.value} {first.label}
              </span>
            )}
          </span>
          {featured && project.metrics.length > 0 && (
            <span className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {project.metrics.map((m) => (
                <span key={m.label} className="font-mono text-[13px]">
                  <span className="text-ink">{m.value}</span>{" "}
                  <span className="text-muted">{m.label}</span>
                </span>
              ))}
            </span>
          )}
        </span>

        <span className="label hidden md:block">{project.period}</span>
        <span
          className={`label text-right ${
            project.status === "in progress" || project.status === "live"
              ? "text-amber"
              : ""
          }`}
        >
          {project.status}
        </span>
      </button>
    </li>
  );
}
