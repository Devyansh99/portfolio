"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/data/projects";

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
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
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-t-xl border border-mint/40 bg-surface p-6 shadow-[0_0_60px_-10px_rgba(61,255,176,0.35)] sm:rounded-xl sm:p-8"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  id="project-modal-title"
                  className="font-mono text-2xl font-bold text-mint"
                >
                  {project.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-amber">
                  {project.kicker} · {project.period}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="rounded border border-line px-3 py-1.5 font-mono text-xs text-muted hover:border-mint hover:text-mint"
              >
                esc
              </button>
            </div>

            <p className="mt-5 text-ink/90">{project.summary}</p>

            {project.metrics.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded border border-line bg-surface-2 p-3"
                  >
                    <dd className="font-mono text-xl font-bold text-mint">
                      {m.value}
                    </dd>
                    <dt className="font-mono text-[11px] uppercase text-muted">
                      {m.label}
                    </dt>
                  </div>
                ))}
              </dl>
            )}

            <ul className="mt-6 space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm text-ink/85">
                  <span className="font-mono text-mint" aria-hidden>
                    &gt;
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li
                  key={s}
                  className="rounded bg-surface-2 px-2 py-1 font-mono text-xs text-muted"
                >
                  {s}
                </li>
              ))}
            </ul>

            {project.links.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-3 font-mono text-sm">
                {project.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-mint px-4 py-2 text-mint hover:bg-mint hover:text-bg"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-6 font-mono text-xs text-muted">
                {"> code is private. Happy to walk through it on a call."}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
