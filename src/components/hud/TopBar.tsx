"use client";

import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { LocalTime } from "./LocalTime";

const pad = (n: number) => String(n).padStart(2, "0");

type TopBarProps = {
  className?: string;
  onOpenPalette: () => void;
};

export function TopBar({ className = "", onOpenPalette }: TopBarProps) {
  return (
    <header className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex items-baseline gap-5">
        <p className="caps text-2xl font-bold leading-none text-mint">
          {pad(projects.length)}
          <span className="ml-2 text-xs font-medium text-muted">projects</span>
        </p>
        <p className="caps text-2xl font-bold leading-none text-mint">
          {pad(1)}
          <span className="ml-2 text-xs font-medium text-muted">paper</span>
        </p>
      </div>
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
