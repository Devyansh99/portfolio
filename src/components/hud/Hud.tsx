"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useSyncExternalStore } from "react";
import { useSetting } from "@/lib/settings";
import { Frame } from "./Frame";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
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

const views: Record<TabId, () => React.ReactNode> = {
  start: () => <StartTab />,
  logs: () => <LogsTab />,
  skills: () => <SkillsTab />,
  creations: () => <CreationsTab />,
  research: () => <ResearchTab />,
  about: () => <AboutTab />,
};

export function Hud() {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.slice(1),
    () => "",
  );
  const tab = tabs.find((t) => t.id === hash)?.id ?? "start";
  const crt = useSetting("crt");
  const motionOn = useSetting("motion");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input,textarea,[contenteditable]")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
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

  const content = views[tab]();

  return (
    <div className={`relative h-svh overflow-hidden bg-bg ${crt ? "scanlines" : ""}`}>
      <div className="hud-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid h-full max-w-[1920px] grid-rows-[auto_minmax(0,1fr)_auto] gap-3 p-3 sm:p-4 lg:grid-cols-[15rem_minmax(0,1fr)_15rem] lg:gap-x-6 lg:gap-y-4 lg:p-6">
        <TopBar className="lg:col-span-3" />
        <LeftPanel className="hidden lg:flex" />

        <main className="min-h-0">
          <Frame className="h-full border border-mint/15 bg-bg/60 backdrop-blur-[2px]">
            <div className="hud-scroll absolute inset-0 overflow-y-auto">
              {motionOn ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    className="h-full min-h-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    {content}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="h-full min-h-full">{content}</div>
              )}
            </div>
          </Frame>
        </main>

        <RightPanel className="hidden lg:flex" />
        <TabBar tab={tab} onSelect={select} className="lg:col-start-2" />
      </div>
    </div>
  );
}
