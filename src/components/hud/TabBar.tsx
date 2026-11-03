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
      className={`hud-scroll flex gap-1.5 overflow-x-auto pb-1 [mask-image:linear-gradient(to_right,#000_88%,transparent)] lg:grid lg:grid-cols-6 lg:overflow-visible lg:[mask-image:none] ${className}`}
    >
      {tabs.map((t, i) => {
        const active = t.id === tab;
        return (
          <button
            key={t.id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onSelect(t.id)}
            className={`group min-h-11 min-w-[6.75rem] flex-1 border-b-2 px-3 py-2 text-left transition-colors lg:min-w-0 ${
              active
                ? "tab-sliver border-mint bg-mint text-bg"
                : "border-line bg-surface hover:border-mint/60"
            }`}
          >
            <span
              className={`caps block truncate text-sm font-bold leading-tight xl:text-base ${
                active ? "text-bg" : "text-ink group-hover:text-mint"
              }`}
            >
              <span className={`mr-1.5 text-xs ${active ? "text-bg/60" : "text-mint/70"}`}>
                {i + 1}
              </span>
              {t.label}
            </span>
            <span
              className={`mt-0.5 hidden truncate text-[11px] uppercase tracking-wider xl:block ${
                active ? "text-bg/70" : "text-muted"
              }`}
            >
              {t.sub}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
