"use client";

import { setSetting, useSetting } from "@/lib/settings";

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
    <aside className={`flex-col justify-end ${className}`}>
      <div>
        <p className="tag mb-1">Visual settings</p>
        <Toggle
          label="Motion & 3D"
          on={motion}
          onChange={(v) => setSetting("motion", v)}
        />
        <Toggle
          label="Scanlines"
          on={crt}
          onChange={(v) => setSetting("crt", v)}
        />
      </div>
    </aside>
  );
}
