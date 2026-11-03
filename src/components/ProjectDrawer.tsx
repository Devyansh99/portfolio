"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { privateNote } from "@/data/copy";
import type { Project } from "@/data/projects";

type ProjectDrawerProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectDrawer({ project, onClose }: ProjectDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key={project.id}
          className="fixed inset-0 z-[70] flex items-end bg-black/60 backdrop-blur-sm md:items-stretch md:justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            className="max-h-[88svh] w-full overflow-y-auto border-l border-line bg-raised p-6 md:max-h-none md:w-[560px] md:p-10"
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 48, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="label">
                  {project.period} · {project.status}
                </p>
                <h3
                  id="drawer-title"
                  className="font-display font-condensed text-display-m mt-3"
                >
                  {project.title}
                </h3>
                <p className="mt-1 text-ink-2">{project.kicker}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="label hover:text-mint"
              >
                close (esc)
              </button>
            </div>

            <p className="mt-8 text-ink">{project.summary}</p>

            {project.metrics.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 border-t border-line sm:grid-cols-4">
                {project.metrics.map((m) => (
                  <div key={m.label} className="border-b border-line py-4 pr-4">
                    <dd className="font-mono text-lg text-mint">{m.value}</dd>
                    <dt className="label">{m.label}</dt>
                  </div>
                ))}
              </dl>
            )}

            <ol className="mt-8 space-y-4">
              {project.highlights.map((h, i) => (
                <li key={h} className="grid grid-cols-[2rem_1fr] text-[15px] text-ink-2">
                  <span className="label">{i + 1}.</span>
                  <span>{h}</span>
                </li>
              ))}
            </ol>

            <p className="label mt-8">{project.stack.join(", ")}</p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
              {project.links.length > 0 ? (
                project.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-mint pb-0.5 text-mint"
                  >
                    {l.label} ↗
                  </a>
                ))
              ) : (
                <p className="text-ink-2">{privateNote}</p>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
