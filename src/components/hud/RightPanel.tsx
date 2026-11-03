"use client";

import { projects } from "@/data/projects";
import { setSetting, useSetting } from "@/lib/settings";

const quest = projects.find((p) => p.status === "in progress") ?? projects[0];

function Toggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between py-1.5 text-left"
    >
      <span className={`caps text-sm ${on ? "text-mint" : "text-muted"}`}>
        {label}
      </span>
      <span
        aria-hidden
        className={`flex size-7 items-center justify-center border text-sm ${
          on ? "border-mint text-mint" : "border-line text-muted"
        }`}
      >
        {on ? "✓" : "×"}
      </span>
    </button>
  );
}

export function RightPanel({ className = "" }: { className?: string }) {
  const motion = useSetting("motion");
  const crt = useSetting("crt");

  return (
    <aside className={`flex-col justify-between ${className}`}>
      <div className="border-l-2 border-mint/70 pl-3">
        <p className="caps -ml-3 -mr-0 bg-mint/15 px-3 py-1 text-lg font-bold text-mint">
          Active quest
        </p>
        <p className="tag mt-1">the current build</p>

        <p className="tag mt-5">Quest name</p>
        <p className="caps mt-1 text-lg font-semibold text-mint">
          {quest.title}
        </p>

        <p className="tag mt-5">Goal</p>
        <p className="mt-1 text-xs leading-relaxed text-ink/80">
          {quest.summary}
        </p>

        <p className="tag mt-5">Built with</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {quest.stack.slice(0, 4).map((s) => (
            <li
              key={s}
              className="border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-muted"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="tag mb-1">Visual settings</p>
        <Toggle label="Motion & 3D" on={motion} onChange={(v) => setSetting("motion", v)} />
        <Toggle label="Scanlines" on={crt} onChange={(v) => setSetting("crt", v)} />
      </div>
    </aside>
  );
}
