"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";
import { focusContact } from "@/lib/contact";
import { pushHistory, useShellHistory } from "@/lib/history";
import {
  commandGroups,
  complete,
  pathLabel,
  run,
  suggestions,
  type ShellAction,
  type ShellLine,
} from "@/lib/shell";
import type { TabId } from "./TabBar";

type Entry = { id: number; cmd: string; lines: ShellLine[] };

const tone = {
  mint: "text-mint",
  amber: "text-amber",
  muted: "text-muted",
} as const;

type ShellProps = {
  tab: TabId;
  sub?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onGo: (id: TabId, sub?: string) => void;
  onPalette: () => void;
  onMatrix: () => void;
  className?: string;
};

export function Shell({
  tab,
  sub,
  inputRef,
  onGo,
  onPalette,
  onMatrix,
  className = "",
}: ShellProps) {
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);
  const [ref, setRef] = useState(false);
  const past = useShellHistory();
  const cursor = useRef(-1);
  const nextId = useRef(1);
  const log = useRef<HTMLDivElement>(null);

  const cwd = tab === "start" ? [] : sub ? [tab, sub] : [tab];

  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, open]);

  const act = (a: ShellAction | undefined) => {
    if (!a) return;
    if (a.type === "go") onGo(a.tab, a.sub);
    if (a.type === "open") window.open(a.url, "_blank", "noopener,noreferrer");
    if (a.type === "connect") {
      onGo("about");
      focusContact();
    }
    if (a.type === "clear") setEntries([]);
    if (a.type === "palette") onPalette();
    if (a.type === "close") setOpen(false);
    if (a.type === "matrix") onMatrix();
    if (a.type === "theme") {
      document.documentElement.setAttribute("data-theme", a.name);
      try {
        window.localStorage.setItem("theme", a.name);
      } catch {
        // storage unavailable: theme lasts for this visit
      }
    }
  };

  const exec = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const res = run(cmd, { history: past, cwd });
    pushHistory(cmd);
    cursor.current = -1;
    if (res.action?.type !== "clear" && res.action?.type !== "close") {
      setEntries((e) => [
        ...e.slice(-30),
        { id: nextId.current++, cmd, lines: res.lines },
      ]);
      setOpen(true);
      setRef(false);
    }
    act(res.action);
    setValue("");
  };

  const insert = (text: string) => {
    setValue(text);
    inputRef.current?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && value.trim()) {
      e.preventDefault();
      setValue(complete(value, cwd));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (past.length === 0) return;
      cursor.current =
        cursor.current === -1 ? past.length - 1 : Math.max(0, cursor.current - 1);
      setValue(past[cursor.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor.current === -1) return;
      cursor.current += 1;
      if (cursor.current >= past.length) {
        cursor.current = -1;
        setValue("");
      } else {
        setValue(past[cursor.current]);
      }
    } else if (e.key === "Escape") {
      if (ref) setRef(false);
      else if (open) setOpen(false);
      else e.currentTarget.blur();
    }
  };

  const showDrawer = open && entries.length > 0 && !ref;
  const lastId = entries[entries.length - 1]?.id;
  const chips = suggestions(cwd);

  return (
    <div className={`relative ${className}`}>
      {ref && (
        <div
          role="region"
          aria-label="Command reference"
          className="absolute inset-x-0 bottom-full z-40 mb-2 border border-mint/40 bg-bg/95"
        >
          <div className="flex items-center justify-between border-b border-line px-3 py-1 font-mono text-xs text-muted">
            <span>commands: tap one to type it, [run] to run it</span>
            <button
              type="button"
              onClick={() => setRef(false)}
              aria-label="Close command reference"
              className="px-1 py-1 hover:text-mint"
            >
              [x]
            </button>
          </div>
          <div className="hud-scroll max-h-[min(52svh,20rem)] overflow-y-auto px-3 py-2 font-mono text-[13px]">
            {commandGroups.map((g) => (
              <div key={g.title} className="mb-3">
                <p className="text-amber"># {g.title}</p>
                <ul>
                  {g.items.map((c) => (
                    <li
                      key={c.cmd}
                      className="flex items-start gap-2 border-b border-line/40 py-1"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          insert(c.run);
                          setRef(false);
                        }}
                        className="grid min-w-0 flex-1 gap-x-3 text-left sm:grid-cols-[15rem_1fr]"
                      >
                        <span className="text-mint">{c.cmd}</span>
                        <span className="text-ink/80">{c.desc}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => exec(c.run)}
                        aria-label={`Run ${c.run}`}
                        className="shrink-0 px-1 py-1 text-xs text-muted hover:text-mint"
                      >
                        [run]
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {showDrawer && (
        <div className="absolute inset-x-0 bottom-full z-30 mb-2 border border-mint/40 bg-bg/95">
          <div className="flex items-center justify-between border-b border-line px-3 py-1 font-mono text-xs text-muted">
            <span>shell output</span>
            <span className="flex gap-3">
              <button
                type="button"
                onClick={() => setEntries([])}
                className="px-1 py-1 hover:text-mint"
              >
                [clear]
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close shell output"
                className="px-1 py-1 hover:text-mint"
              >
                [x]
              </button>
            </span>
          </div>
          <div
            ref={log}
            role="log"
            aria-live="polite"
            className="hud-scroll max-h-[min(38svh,16rem)] overflow-y-auto px-3 py-2 font-mono text-[13px] leading-relaxed"
          >
            {entries.map((en) => (
              <div key={en.id} className="mb-3">
                <p className="text-ink">
                  <span className="text-mint">$</span> {en.cmd}
                </p>
                {en.lines.map((l, i) => {
                  const cls = `whitespace-pre-wrap break-words ${l.tone ? tone[l.tone] : "text-ink/85"} ${
                    en.id === lastId ? "diff-line" : ""
                  }`;
                  const style =
                    en.id === lastId
                      ? { animationDelay: `${Math.min(i * 25, 500)}ms` }
                      : undefined;
                  return l.href ? (
                    <p key={i} className={cls} style={style}>
                      <a
                        href={l.href}
                        target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 hover:text-amber"
                      >
                        {l.text}
                      </a>
                    </p>
                  ) : (
                    <p key={i} className={cls} style={style}>
                      {l.text || " "}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={`hud-scroll mb-1.5 flex items-center gap-1.5 overflow-x-auto ${
          "lg:hidden"
        }`}
      >
        <button
          type="button"
          aria-expanded={ref}
          onClick={() => setRef((v) => !v)}
          className={`min-h-9 shrink-0 border px-2.5 py-1.5 font-mono text-xs ${
            ref
              ? "border-mint bg-mint text-bg"
              : "border-mint/60 text-mint hover:bg-mint hover:text-bg"
          }`}
        >
          [commands]
        </button>
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => exec(c)}
            className="min-h-9 shrink-0 border border-line bg-surface px-2.5 py-1.5 font-mono text-xs text-muted hover:border-mint/60 hover:text-mint"
          >
            {c}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          exec(value);
        }}
        className="flex items-center gap-2 border border-line bg-surface px-3 focus-within:border-mint"
      >
        <label
          htmlFor="shell-input"
          className="hidden shrink-0 whitespace-nowrap font-mono text-sm sm:block"
        >
          <span className="text-mint">visitor@portfolio</span>
          <span className="text-muted">:{pathLabel(cwd)}$</span>
        </label>
        <span aria-hidden className="font-mono text-sm text-mint sm:hidden">
          $
        </span>
        <input
          id="shell-input"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          aria-label="Shell command"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          placeholder="type help, or press [commands]"
          className="min-h-11 min-w-0 flex-1 bg-transparent font-mono text-base text-ink outline-none placeholder:text-muted/70 focus-visible:outline-none sm:text-sm"
        />
        <button
          type="button"
          aria-expanded={ref}
          onClick={() => setRef((v) => !v)}
          className="hidden shrink-0 px-1 py-2 font-mono text-xs text-mint hover:text-amber lg:block"
        >
          [commands]
        </button>
        <button
          type="submit"
          className="hidden shrink-0 px-1 py-2 font-mono text-xs text-muted hover:text-mint sm:block"
        >
          [enter]
        </button>
      </form>
    </div>
  );
}
