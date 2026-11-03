import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { LocalTime } from "./LocalTime";

const pad = (n: number) => String(n).padStart(2, "0");

export function TopBar({ className = "" }: { className?: string }) {
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
      <p className="tag flex items-center gap-4 text-right">
        <span className="hidden sm:inline">{profile.location}</span>
        <span>
          local time: <span className="text-ink"><LocalTime /></span>
        </span>
      </p>
    </header>
  );
}
