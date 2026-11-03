export const heroCtas = {
  work: "See the work",
  paper: "Read the paper",
  email: "Email me",
  hint: "press anywhere on the road",
} as const;

export const sectionIntros = {
  projects:
    "Seven projects from 2025 and 2026. SadakVision has been running the longest, since January 2025. Hover a row to see it take *shape*.",
  research:
    "One paper so far, from the SadakVision work. It was presented at INDIS 2026 and is under review for the Taylor & Francis proceedings.",
  skills: "What I work with. Hover a tool to see *where* I used it.",
  experience: "Work, roles and school, newest first.",
  contact:
    "Email is the best way to reach me. If you're working on applied ML, agents or computer vision, I'd like to hear about it.",
} as const;

export const stageCaptions: Record<string, string> = {
  default: "hover a project",
  sadakvision: "Potholes, with the boxes a detector would draw.",
  cognalytix: "A table, stood up as columns.",
  acadika: "Textbook pages, fanned open.",
  higan: "One continuous stroke.",
  adaptivebandit: "Five actions, five reward distributions.",
  glioblastoma: "Twelve scan slices.",
  "digital-dorm-war": "Three buildings, one firewall, one DMZ.",
};

export const figureCaption =
  "Fig. 1. A simulation of trigger-based recording. The phone keeps a rolling buffer and writes a 7-second clip only when the sensor model flags an anomaly. Move across the figure to change the speed.";

export const privateNote =
  "The code is private. I'm happy to walk through it on a call.";

export const footer = {
  left: "Devyansh Agarwal, 2026",
  right: "Built in Mohali. Set in Bricolage Grotesque and JetBrains Mono.",
} as const;
