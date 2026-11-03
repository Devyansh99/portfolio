"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { CommandPalette } from "./CommandPalette";
import { Frame } from "./Frame";
import { LeftPanel } from "./LeftPanel";
import { MatrixRain } from "./MatrixRain";
import { Shell } from "./Shell";
import { TabBar, tabs, type TabId } from "./TabBar";
import { TopBar } from "./TopBar";
import { validSub } from "@/lib/shell";
import { useSmoothScroll } from "@/lib/smoothScroll";
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

const konami = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

const views: Record<TabId, (active: boolean, sub?: string) => ReactNode> = {
  start: (active) => <StartTab active={active} />,
  logs: () => <LogsTab />,
  skills: () => <SkillsTab />,
  creations: (active, sub) => (
    <CreationsTab key={sub ?? "none"} active={active} initialId={sub} />
  ),
  research: () => <ResearchTab />,
  about: () => <AboutTab />,
};

export function Hud() {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.slice(1),
    () => "",
  );
  const [hashTab, hashSub] = hash.split("/");
  const current = tabs.find((t) => t.id === hashTab) ?? tabs[0];
  const tab = current.id;
  const sub = tab === "creations" ? validSub(hashSub) : undefined;
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [rain, setRain] = useState(false);
  const keys = useRef<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLInputElement>(null);
  const firstRun = useRef(true);

  const frame = useRef(0);
  useSmoothScroll(scrollRef);

  const updateBar = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = scrollRef.current;
      const bar = barRef.current;
      if (!el || !bar) return;
      const max = el.scrollHeight - el.clientHeight;
      bar.style.transform = `scaleX(${max > 8 ? el.scrollTop / max : 0})`;
    });
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
    if (document.activeElement === shellRef.current) return;
    document
      .querySelector<HTMLElement>(`[data-panel="${tab}"] h1, [data-panel="${tab}"] h2`)
      ?.focus({ preventScroll: true });
  }, [tab, current.label]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as Element;
      if (el.closest?.("input,textarea,[contenteditable]")) return;
      const k = e.key.toLowerCase();
      keys.current = [...keys.current, k].slice(-konami.length);
      if (keys.current.join() === konami.join()) {
        keys.current = [];
        setRain(true);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && k === "k") {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }
      if (k === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        shellRef.current?.focus();
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

  const select = (id: TabId, subId?: string) => {
    window.location.hash = subId ? `${id}/${subId}` : id;
  };

  return (
    <div className="scanlines relative h-svh overflow-hidden bg-bg">
      <div className="hud-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid h-full max-w-[1920px] grid-rows-[auto_minmax(0,1fr)_auto_auto] gap-2 p-2 sm:p-3 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-x-4 lg:gap-y-3 lg:p-4 xl:grid-cols-[13rem_minmax(0,1fr)]">
        <TopBar
          tab={tab}
          className="lg:col-span-2"
          onOpenShell={() => shellRef.current?.focus()}
        />
        <LeftPanel className="hud-scroll hidden min-h-0 overflow-y-auto pr-1 pt-3 lg:flex" />

        <main className="min-h-0">
          <Frame title={`~/${tab}`} className="h-full bg-bg/60">
            <div
              ref={barRef}
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 z-20 h-0.5 w-full origin-left bg-mint will-change-transform"
              style={{ transform: "scaleX(0)" }}
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
                    {views[t.id](active, sub)}
                  </section>
                );
              })}
            </div>
          </Frame>
        </main>

        <Shell
          tab={tab}
          sub={sub}
          inputRef={shellRef}
          onGo={select}
          onPalette={() => setPaletteOpen(true)}
          onMatrix={() => setRain(true)}
          className="lg:col-start-2"
        />

        <TabBar tab={tab} onSelect={select} className="lg:col-start-2" />
      </div>

      {rain && <MatrixRain onDone={() => setRain(false)} />}

      {paletteOpen && (
        <CommandPalette onClose={() => setPaletteOpen(false)} onGo={select} />
      )}
    </div>
  );
}
