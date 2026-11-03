"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { profile } from "@/data/profile";
import { tabs, type TabId } from "./TabBar";

type Command = {
  id: string;
  label: string;
  keywords: string;
  run: () => string | void;
};

type CommandPaletteProps = {
  onClose: () => void;
  onGo: (id: TabId) => void;
};

export function CommandPalette({ onClose, onGo }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commands = useMemo<Command[]>(
    () => [
      ...tabs.map<Command>((t) => ({
        id: `go-${t.id}`,
        label: `go ${t.label.toLowerCase()}`,
        keywords: `${t.sub} ${t.id}`,
        run: () => {
          onGo(t.id);
          onClose();
        },
      })),
      {
        id: "copy-email",
        label: "copy email",
        keywords: "gmail address mail",
        run: () => {
          navigator.clipboard.writeText(profile.email).catch(() => {});
          return `copied ${profile.email}`;
        },
      },
      {
        id: "send-email",
        label: "send email",
        keywords: "contact hire mailto",
        run: () => {
          window.location.href = `mailto:${profile.email}`;
        },
      },
      {
        id: "github",
        label: "open github",
        keywords: "code repos",
        run: () => {
          window.open(profile.github, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "linkedin",
        label: "open linkedin",
        keywords: "profile",
        run: () => {
          window.open(profile.linkedin, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "whoami",
        label: "whoami",
        keywords: "me who",
        run: () => "devyansh_agarwal, uid=2027, groups=plaksha,sadakvision",
      },
      {
        id: "commit",
        label: 'git commit -m "make ai useful"',
        keywords: "tagline git",
        run: () => "[main] I build AI and software that people can actually use.",
      },
      {
        id: "npm",
        label: "npm run ai && npm run ship",
        keywords: "tagline npm build ship",
        run: () => "I build AI and ship software.",
      },
      {
        id: "sudo",
        label: "sudo hire devyansh",
        keywords: "hire sudo",
        run: () => {
          window.location.href = `mailto:${profile.email}?subject=sudo%20hire`;
          return "permission granted. opening your mail client...";
        },
      },
      {
        id: "rm",
        label: "rm -rf /",
        keywords: "delete danger",
        run: () => "nice try. read-only filesystem.",
      },
    ],
    [onGo, onClose],
  );

  const shown = commands.filter((c) =>
    `${c.label} ${c.keywords}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const selected = Math.min(index, Math.max(shown.length - 1, 0));

  const execute = (c: Command | undefined) => {
    if (!c) return;
    const out = c.run();
    setMessage(out ?? null);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex(Math.min(selected + 1, shown.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex(Math.max(selected - 1, 0));
    }
    if (e.key === "Enter") execute(shown[selected]);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center bg-black/70 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-lg border border-mint/50 bg-surface font-mono text-sm shadow-[0_0_60px_-12px_rgba(61,255,176,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span className="text-mint" aria-hidden>
            $
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
              setMessage(null);
            }}
            onKeyDown={onKey}
            placeholder="type a command, try: whoami"
            aria-label="Command"
            className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
          />
          <span className="tag shrink-0">esc</span>
        </div>

        {message && (
          <p className="border-b border-line px-4 py-2 text-xs text-amber">
            {"> "}
            {message}
          </p>
        )}

        <ul className="hud-scroll max-h-72 overflow-y-auto py-1">
          {shown.length === 0 && (
            <li className="px-4 py-3 text-muted">command not found: {query}</li>
          )}
          {shown.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                onPointerEnter={() => setIndex(i)}
                onClick={() => execute(c)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left ${
                  i === selected ? "bg-mint/10 text-mint" : "text-ink"
                }`}
              >
                <span aria-hidden className="text-mint/60">
                  {i === selected ? ">" : " "}
                </span>
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
