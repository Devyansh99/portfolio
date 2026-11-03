"use client";

import { useState } from "react";
import { navItems, profile } from "@/data/profile";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"
      >
        <a href="#top" className="font-mono text-sm font-bold text-mint">
          {"> "}
          {profile.handle}
          <span className="caret" aria-hidden />
        </a>

        <ul className="hidden items-center gap-6 font-mono text-sm md:flex">
          {navItems.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-muted transition-colors hover:text-mint"
              >
                <span className="text-mint/60">0{i + 1}.</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="rounded border border-line px-3 py-1.5 font-mono text-xs text-muted md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "close" : "menu"}
        </button>
      </nav>

      {open && (
        <ul
          id="mobile-menu"
          className="border-t border-line bg-bg px-4 py-3 font-mono text-sm md:hidden"
        >
          {navItems.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="block py-2 text-muted hover:text-mint"
              >
                <span className="text-mint/60">0{i + 1}.</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
