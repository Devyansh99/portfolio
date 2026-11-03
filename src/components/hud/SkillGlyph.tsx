import type { ReactNode } from "react";
import { skillIcons } from "@/data/skillIcons";

const db = (
  <>
    <ellipse cx="12" cy="6" rx="7" ry="3" />
    <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
  </>
);

const vectorDb = (
  <>
    <ellipse cx="11" cy="6" rx="6" ry="2.5" />
    <path d="M5 6v11c0 1.4 2.7 2.5 6 2.5M17 6v3M10 16l9-9m-5 0h5v5" />
  </>
);

const cloud = (
  <path d="M7 18.5a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 8.7a4.9 4.9 0 0 1 .5 9.8H7z" />
);

const api = (
  <path d="M8 4C6 4 5 5 5 7v2c0 1.5-.8 3-2 3 1.2 0 2 1.5 2 3v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1.5.8 3 2 3-1.2 0-2 1.5-2 3v2c0 2-1 3-3 3" />
);

// Generic category symbols, drawn here as outlines. They are not brand logos.
const drawn: Record<string, ReactNode> = {
  SQL: db,
  pgvector: vectorDb,
  Weaviate: vectorDb,
  AWS: cloud,
  Azure: cloud,
  "REST APIs": api,
};

export function SkillGlyph({
  skill,
  size = 14,
  className = "",
}: {
  skill: string;
  size?: number;
  className?: string;
}) {
  const d = skillIcons[skill];
  const shape = drawn[skill];
  return (
    <span
      aria-hidden
      className={`inline-grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      {d ? (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
          <path d={d} />
        </svg>
      ) : shape ? (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {shape}
        </svg>
      ) : null}
    </span>
  );
}
