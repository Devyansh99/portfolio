import type { ReactNode } from "react";

type TerminalWindowProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function TerminalWindow({
  title,
  children,
  className = "",
}: TerminalWindowProps) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-line bg-surface/80 shadow-[0_0_40px_-12px_rgba(61,255,176,0.25)] backdrop-blur ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f56]" aria-hidden />
        <span className="size-2.5 rounded-full bg-amber" aria-hidden />
        <span className="size-2.5 rounded-full bg-mint" aria-hidden />
        <span className="ml-3 truncate font-mono text-xs text-muted">
          {title}
        </span>
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed sm:p-6">
        {children}
      </div>
    </div>
  );
}
