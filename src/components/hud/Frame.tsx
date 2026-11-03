import type { ReactNode } from "react";

type FrameProps = {
  children: ReactNode;
  className?: string;
  tone?: "mint" | "amber";
  title?: string;
};

export function Frame({
  children,
  className = "",
  tone = "mint",
  title,
}: FrameProps) {
  const c = tone === "mint" ? "border-mint/50" : "border-amber/50";
  const t = tone === "mint" ? "text-mint" : "text-amber";
  return (
    <div className={`relative border ${c} ${className}`}>
      {title && (
        <span
          aria-hidden
          className={`absolute -top-2.5 left-3 z-20 bg-bg px-2 font-mono text-xs ${t}`}
        >
          {title}
        </span>
      )}
      {children}
    </div>
  );
}
