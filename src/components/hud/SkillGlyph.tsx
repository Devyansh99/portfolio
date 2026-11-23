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

const network = (
  <>
    <circle cx="5" cy="6" r="2" />
    <circle cx="5" cy="18" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="6" r="2" />
    <circle cx="19" cy="18" r="2" />
    <path d="M7 7l3.3 3.6M7 17l3.3-3.6M13.7 10.4L17 7M13.7 13.6L17 17" />
  </>
);

const layers = (
  <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5" />
);

const chip = (
  <>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <path d="M10 10h4v4h-4zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
  </>
);

const spark = (
  <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />
);

const chat = (
  <path d="M4 5h16v11H9l-5 4V5zM8 9h8M8 12h5" />
);

const docSearch = (
  <>
    <path d="M14 3H6v18h6M14 3l4 4v3M14 3v4h4" />
    <circle cx="16" cy="15" r="3" />
    <path d="M18.2 17.2L21 20" />
  </>
);

const agent = (
  <>
    <rect x="5" y="8" width="14" height="11" rx="2" />
    <path d="M12 4v4M9 13h.01M15 13h.01M9 16h6M2 12v3M22 12v3" />
    <circle cx="12" cy="3" r="1" />
  </>
);

const loop = (
  <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4M12 8v4l3 2" />
);

const bars = <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />;

const tree = (
  <>
    <rect x="9" y="2" width="6" height="5" rx="1" />
    <rect x="2" y="17" width="6" height="5" rx="1" />
    <rect x="16" y="17" width="6" height="5" rx="1" />
    <path d="M12 7v5M5 17v-5h14v5" />
  </>
);

const trend = (
  <path d="M3 20h18M3 16l5-5 4 3 6-7M14 7h4v4M17 14l1.5 1.5M20 11l1 1" />
);

// Generic category symbols, drawn here as outlines. They are not brand logos.
const drawn: Record<string, ReactNode> = {
  "Machine Learning": network,
  "Deep Learning": layers,
  Transformers: chip,
  RAG: docSearch,
  LLMs: chat,
  GenAI: spark,
  NLP: <path d="M4 7V4h10v3M9 4v16M7 20h4M15 13h6M15 17h6M15 9h6" />,
  "AI Agents": agent,
  "Reinforcement Learning": loop,
  "Data Analysis": bars,
  XGBoost: tree,
  Prophet: trend,
  "Routing (OSPF, EIGRP)": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v6M9 6l3-3 3 3M12 21v-6M9 18l3 3 3-3M3 12h6M6 9l-3 3 3 3M21 12h-6M18 9l3 3-3 3" />
    </>
  ),
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
