"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { CommandPalette } from "./CommandPalette";
import { Frame } from "./Frame";
import { LeftPanel } from "./LeftPanel";
import { TabBar, tabs, type TabId } from "./TabBar";
import { TopBar } from "./TopBar";
import { AboutTab } from "./tabs/AboutTab";
import { CreationsTab } from "./tabs/CreationsTab";
import { LogsTab } from "./tabs/LogsTab";
import { ResearchTab } from "./tabs/ResearchTab";
import { SkillsTab } from "./tabs/SkillsTab";
import { StartTab } from "./tabs/StartTab";

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

const views: Record<TabId, (active: boolean) => ReactNode> = {
  start: (active) => <StartTab active={active} />,
  logs: () => <LogsTab />,
  skills: () => <SkillsTab />,
  creations: (active) => <CreationsTab active={active} />,
  research: () => <ResearchTab />,
  about: () => <AboutTab />,
};

export function Hud() {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.slice(1),
    () => "",
  );
  const current = tabs.find((t) => t.id === hash) ?? tabs[0];
  const tab = current.id;
  const [paletteOpen, setPaletteOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  const updateBar = () => {
    const el = scrollRef.current;
    const bar = barRef.current;
    if (!el || !bar) return;
    const max = el.scrollHeight - el.clientHeight;
    bar.style.width = max > 8 ? `${(el.scrollTop / max) * 100}%` : "0%";
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-tab", tab);
    document.title =
      tab === "start"
        ? "Devyansh Agarwal, AI engineer"
        : `${current.label} · Devyansh Agarwal`;
    scrollRef.current?.scrollTo({ top: 0, left: 0 });
    updateBar();
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    document
      .querySelector<HTMLElement>(`[data-panel="${tab}"] h1, [data-panel="${tab}"] h2`)
      ?.focus({ preventScroll: true });
  }, [tab, current.label]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as Element;
      if (el.closest?.("input,textarea,[contenteditable]")) return;
      const k = e.key.toLowerCase();
      if (k === "/" || ((e.metaKey || e.ctrlKey) && k === "k")) {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      const n = Number(e.key);
      if (n >= 1 && n <= tabs.length) {
        window.location.hash = tabs[n - 1].id;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const select = (id: TabId) => {
    window.location.hash = id;
  };

  return (
    <div className="scanlines relative h-svh overflow-hidden bg-bg">
      <div className="hud-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid h-full max-w-[1920px] grid-rows-[auto_minmax(0,1fr)_auto] gap-3 p-3 sm:p-4 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-6 lg:gap-y-4 lg:p-6 xl:grid-cols-[15rem_minmax(0,1fr)]">
        <TopBar
          tab={tab}
          className="lg:col-span-2"
          onOpenPalette={() => setPaletteOpen(true)}
        />
        <LeftPanel className="hud-scroll hidden min-h-0 overflow-y-auto pr-1 pt-3 lg:flex" />

        <main className="min-h-0">
          <Frame title={`~/${tab}`} className="h-full bg-bg/60 backdrop-blur-[2px]">
            <div
              ref={barRef}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-20 h-0.5 bg-mint shadow-[0_0_8px_var(--mint)]"
              style={{ width: 0 }}
            />
            <div
              ref={scrollRef}
              onScroll={updateBar}
              className="hud-scroll absolute inset-0 overflow-y-auto"
            >
              {tabs.map((t) => {
                const active = t.id === tab;
                return (
                  <section
                    key={t.id}
                    data-panel={t.id}
                    aria-label={t.label}
                    className={`hud-panel h-full min-h-full ${active ? "tab-in" : ""}`}
                  >
                    {views[t.id](active)}
                  </section>
                );
              })}
            </div>
          </Frame>
        </main>

        <TabBar tab={tab} onSelect={select} className="lg:col-start-2" />
      </div>

      {paletteOpen && (
        <CommandPalette onClose={() => setPaletteOpen(false)} onGo={select} />
      )}
    </div>
  );
}
