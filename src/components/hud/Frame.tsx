import type { ReactNode } from "react";

type FrameProps = {
  children: ReactNode;
  className?: string;
  tone?: "mint" | "amber";
};

export function Frame({ children, className = "", tone = "mint" }: FrameProps) {
  const c = tone === "mint" ? "border-mint" : "border-amber";
  return (
    <div className={`relative ${className}`}>
      <span aria-hidden className={`absolute left-0 top-0 size-3 border-l-2 border-t-2 ${c}`} />
      <span aria-hidden className={`absolute right-0 top-0 size-3 border-r-2 border-t-2 ${c}`} />
      <span aria-hidden className={`absolute bottom-0 left-0 size-3 border-b-2 border-l-2 ${c}`} />
      <span aria-hidden className={`absolute bottom-0 right-0 size-3 border-b-2 border-r-2 ${c}`} />
      {children}
    </div>
  );
}
