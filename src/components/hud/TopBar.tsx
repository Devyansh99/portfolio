"use client";

import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { LocalTime } from "./LocalTime";

type TopBarProps = {
  tab: string;
  className?: string;
  onOpenPalette: () => void;
};

export function TopBar({ tab, className = "", onOpenPalette }: TopBarProps) {
  return (
    <header className={`flex items-center justify-between gap-4 ${className}`}>
      <p className="min-w-0 truncate font-mono text-sm">
        <span className="text-mint">devyansh@plaksha</span>
        <span className="text-muted">:~/{tab}$</span>
        <span className="cursor" />
        <span className="ml-4 hidden text-xs text-muted md:inline">
          {projects.length} projects · 1 paper
        </span>
      </p>
      <div className="tag flex items-center gap-3 text-right sm:gap-4">
        <button
          type="button"
          onClick={onOpenPalette}
          aria-label="Open command palette"
          className="whitespace-nowrap border border-line px-2.5 py-1.5 text-ink hover:border-mint hover:text-mint"
        >
          <span className="text-mint">/</span>
          <span className="hidden sm:inline"> command</span>
        </button>
        <span className="hidden sm:inline">{profile.location}</span>
        <span>
          <span className="hidden sm:inline">local time: </span>
          <span className="text-ink">
            <LocalTime />
          </span>
        </span>
      </div>
    </header>
  );
}
