import { contactIcons } from "@/data/skillIcons";

type IconName = "github" | "gmail" | "linkedin";

export function ContactIcon({
  name,
  size = 16,
}: {
  name: IconName;
  size?: number;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className="shrink-0"
    >
      {name === "linkedin" ? (
        <path d="M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2.3 9h3.4v12H2.3V9zm6.1 0h3.2v1.7c.5-.9 1.7-2 3.6-2 3.7 0 4.4 2.4 4.4 5.6V21h-3.4v-6c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H8.4V9z" />
      ) : (
        <path d={contactIcons[name]} />
      )}
    </svg>
  );
}
