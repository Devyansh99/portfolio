"use client";

import { useEffect, useRef } from "react";

export type TabId =
  | "start"
  | "logs"
  | "skills"
  | "creations"
  | "research"
  | "about";

export const tabs: { id: TabId; label: string; sub: string }[] = [
  { id: "start", label: "Beginning", sub: "Intro" },
  { id: "logs", label: "Logs", sub: "Experience and school" },
  { id: "skills", label: "Skills", sub: "Skill matrix and awards" },
  { id: "creations", label: "Creations", sub: "Seven projects" },
  { id: "research", label: "Research", sub: "Paper under review" },
  { id: "about", label: "About", sub: "Bio and contact" },
];

type TabBarProps = {
  tab: TabId;
  onSelect: (id: TabId) => void;
  className?: string;
};

export function TabBar({ tab, onSelect, className = "" }: TabBarProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    ref.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [tab]);

  return (
    <nav
      ref={ref}
      aria-label="Sections"
      className={`hud-scroll flex gap-1 overflow-x-auto border-t border-line pt-2 [mask-image:linear-gradient(to_right,#000_88%,transparent)] lg:grid lg:grid-cols-6 lg:overflow-visible lg:[mask-image:none] ${className}`}
    >
      {tabs.map((t, i) => {
        const active = t.id === tab;
        return (
          <button
            key={t.id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onSelect(t.id)}
            className={`group min-h-11 min-w-[7rem] flex-1 px-3 py-1.5 lg:min-h-9 lg:py-1 text-left font-mono transition-colors lg:min-w-0 ${
              active
                ? "bg-mint text-bg"
                : "bg-surface text-muted hover:bg-surface-2 hover:text-mint"
            }`}
          >
            <span className="block truncate text-xs font-bold leading-tight xl:text-sm">
              [{i + 1}:{t.id}]
            </span>
            <span
              className={`mt-0.5 hidden truncate text-[11px] xl:block ${
                active ? "text-bg/70" : "text-muted"
              }`}
            >
              {t.sub.toLowerCase()}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
