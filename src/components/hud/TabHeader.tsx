import type { CSSProperties } from "react";
import { banners } from "@/data/banners";

const words: Record<string, string> = {
  logs: "LOGS",
  skills: "SKILLS",
  creations: "CREATIONS",
  research: "RESEARCH",
  about: "ABOUT",
};

type TabHeaderProps = {
  id: keyof typeof words;
  cmd: string;
  title: string;
};

export function TabHeader({ id, cmd, title }: TabHeaderProps) {
  return (
    <header className="@container mb-6">
      <p aria-hidden className="font-mono text-sm text-muted">
        <span className="text-mint">$</span>{" "}
        <span className="cursor">
          <span
            className="type-line text-ink"
            style={{ "--n": cmd.length } as CSSProperties}
          >
            {cmd}
          </span>
        </span>
      </p>
      <pre aria-hidden className="ascii mt-3 hidden overflow-hidden @xl:block">
        {banners[id]}
      </pre>
      <p
        aria-hidden
        className="mt-3 text-3xl font-bold tracking-tight text-mint @xl:hidden"
      >
        {words[id].toLowerCase()}
      </p>
      <h2 tabIndex={-1} className="mt-3 text-sm font-semibold text-amber">
        {"// "}
        {title}
      </h2>
    </header>
  );
}
