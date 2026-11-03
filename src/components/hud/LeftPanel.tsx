"use client";

import Image from "next/image";
import { useState } from "react";
import { profile } from "@/data/profile";
import { ContactIcon } from "./ContactIcons";
import { Frame } from "./Frame";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="tag">{label}</p>
      <p className="caps mt-0.5 text-base font-semibold leading-tight text-mint">
        {value}
      </p>
    </div>
  );
}

export function LeftPanel({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <aside className={`flex-col gap-4 xl:gap-5 ${className}`}>
      <Frame title="devyansh.jpg" className="aspect-square w-full max-w-[30vh] shrink-0 bg-surface">
        <div className="absolute inset-2 overflow-hidden">
          <Image
            src="/devyansh.jpg"
            alt="Portrait of Devyansh Agarwal"
            fill
            priority
            sizes="240px"
            className="object-cover object-[50%_20%]"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-mint/10"
          />
        </div>
      </Frame>

      <Field label="name" value={profile.name} />
      <Field label="role" value={profile.occupation} />
      <Field label="org" value={profile.corporation} />

      <div>
        <p className="tag">status</p>
        <p className="caps mt-1 flex items-center gap-2 border border-mint/40 bg-mint/10 px-2 py-1.5 text-sm font-semibold text-mint">
          <span aria-hidden className="size-2 shrink-0 animate-pulse rounded-full bg-mint" />
          {profile.status}
        </p>
      </div>

      <div>
        <p className="tag">email</p>
        <p className="mt-1 select-all break-all font-mono text-[13px] text-ink">
          {profile.email}
        </p>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard
              .writeText(profile.email)
              .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              })
              .catch(() => {});
          }}
          className={`mt-1 py-1 font-mono text-xs hover:text-mint ${
            copied ? "animate-pulse text-mint" : "text-muted"
          }`}
        >
          {copied ? "> copied to clipboard" : "copy address"}
        </button>
      </div>

      <div>
        <p className="tag">links</p>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="caps mt-1 flex w-full items-center justify-between border border-mint px-2 py-1.5 text-sm font-semibold text-mint transition hover:bg-mint hover:text-bg"
        >
          open connection
          <span aria-hidden>{open ? "−" : "+"}</span>
        </button>
        {open && (
          <ul className="mt-2 space-y-1 border-l border-mint/40 pl-3 font-mono text-xs">
            <li>
              <a
                className="text-ink hover:text-mint"
                href={`mailto:${profile.email}`}
              >
                <span className="inline-flex items-center gap-2">
                  <ContactIcon name="gmail" size={14} />
                  email
                </span>
              </a>
            </li>
            <li>
              <a
                className="text-ink hover:text-mint"
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="inline-flex items-center gap-2">
                  <ContactIcon name="github" size={14} />
                  github ↗
                </span>
              </a>
            </li>
            <li>
              <a
                className="text-ink hover:text-mint"
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="inline-flex items-center gap-2">
                  <ContactIcon name="linkedin" size={14} />
                  linkedin ↗
                </span>
              </a>
            </li>
          </ul>
        )}
      </div>
    </aside>
  );
}
