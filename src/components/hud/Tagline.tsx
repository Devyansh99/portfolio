"use client";

import { useState } from "react";
import { profile } from "@/data/profile";

export function Tagline() {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-pressed={open}
      className="group mx-auto mt-3 block max-w-2xl text-center"
    >
      <span className="relative grid">
        <code
          className={`col-start-1 row-start-1 font-mono text-base leading-relaxed transition-all duration-300 sm:text-xl ${
            open
              ? "scale-95 opacity-0"
              : "opacity-100 group-hover:scale-95 group-hover:opacity-0 group-focus-visible:opacity-0"
          }`}
        >
          <span className="text-mint">git commit</span>
          <span className="text-muted"> -m </span>
          <span className="text-amber">&quot;make ai useful&quot;</span>
        </code>
        <span
          className={`caps col-start-1 row-start-1 text-sm font-medium leading-relaxed text-ink transition-all duration-300 sm:text-base ${
            open
              ? "opacity-100"
              : "scale-105 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:opacity-100"
          }`}
        >
          {profile.tagline}
        </span>
      </span>
      <span className="tag mt-3 block">
        {open ? "// translation" : "// hover or tap to run it"}
      </span>
    </button>
  );
}
