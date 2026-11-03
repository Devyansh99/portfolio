"use client";

import { useState, useSyncExternalStore } from "react";
import { navItems } from "@/data/sections";
import { profile } from "@/data/profile";
import { getSection, subscribeScene } from "@/lib/scene-store";
import { LocalTime } from "./LocalTime";

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const active = useSyncExternalStore(subscribeScene, getSection, () => "hero");
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur" : ""
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1360px] items-center justify-between px-5 py-4 md:px-10"
      >
        <a href="#top" className="font-display text-[15px] font-semibold">
          {profile.name}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7 text-sm">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`border-b pb-0.5 transition-colors hover:text-mint ${
                    active === item.scene
                      ? "border-mint text-ink"
                      : "border-transparent text-ink-2"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <LocalTime />
        </div>

        <button
          type="button"
          className="text-sm text-ink-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-14 z-50 bg-raised px-5 pt-10 md:hidden"
        >
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="font-display font-condensed text-display-l block"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
