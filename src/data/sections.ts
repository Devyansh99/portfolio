export type SceneId =
  | "hero"
  | "about"
  | "projects"
  | "research"
  | "skills"
  | "experience"
  | "contact";

export const sections: { scene: SceneId; label: string }[] = [
  { scene: "hero", label: "top" },
  { scene: "about", label: "about" },
  { scene: "projects", label: "work" },
  { scene: "research", label: "research" },
  { scene: "skills", label: "tools" },
  { scene: "experience", label: "experience" },
  { scene: "contact", label: "contact" },
];

export const navItems: { id: string; scene: SceneId; label: string }[] = [
  { id: "work", scene: "projects", label: "Work" },
  { id: "research", scene: "research", label: "Research" },
  { id: "about", scene: "about", label: "About" },
  { id: "experience", scene: "experience", label: "Experience" },
  { id: "contact", scene: "contact", label: "Contact" },
];
