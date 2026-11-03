import { skillIcons } from "@/data/skillIcons";

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
  return (
    <span
      aria-hidden
      className={`inline-grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      {d && (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
          <path d={d} />
        </svg>
      )}
    </span>
  );
}
