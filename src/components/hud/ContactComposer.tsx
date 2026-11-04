"use client";

import { useState } from "react";
import { profile } from "@/data/profile";
import { ContactIcon } from "./ContactIcons";

const links = [
  { name: "gmail", label: "email", href: `mailto:${profile.email}`, ext: false },
  { name: "github", label: "github", href: profile.github, ext: true },
  { name: "linkedin", label: "linkedin", href: profile.linkedin, ext: true },
] as const;

const field =
  "w-full border border-line bg-surface-2 px-3 py-2 font-sans text-base text-ink placeholder:text-muted focus-visible:border-mint";

export function ContactComposer() {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const subject = `Hello from ${name.trim() || "your portfolio"}`;
  const text = `${message.trim()}

- ${name.trim()}${from.trim() ? ` (${from.trim()})` : ""}`;

  const openMailApp = () => {
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    setState("sent");
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!key) {
      openMailApp();
      return;
    }
    const data = new FormData(e.currentTarget);
    if (data.get("botcheck")) return;
    setState("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: key,
          subject,
          name: name.trim(),
          email: from.trim() || undefined,
          message: message.trim(),
        }),
      });
      const json = (await res.json()) as { success?: boolean };
      if (!json.success) throw new Error("rejected");
      setState("sent");
      setName("");
      setFrom("");
      setMessage("");
    } catch {
      setState("error");
    }
  };

  return (
    <section aria-labelledby="connect-title" className="mt-12 border-t border-line pt-8">
      <h3 id="connect-title" className="caps text-sm font-semibold tracking-[0.2em] text-mint">
        $ sudo connect devyansh
      </h3>
      <p className="mt-2 text-[15px] text-ink/85">
        Internship, project or just a hello.{" "}
        {process.env.NEXT_PUBLIC_WEB3FORMS_KEY
          ? "Your message goes straight to my inbox. Add your email if you want a reply."
          : "This opens a drafted email in your mail app."}
      </p>

      <ul className="mt-4 flex flex-wrap gap-3 font-mono text-sm">
        {links.map((l) => (
          <li key={l.name}>
            <a
              href={l.href}
              {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex min-h-11 items-center gap-2 border border-line bg-surface-2 px-4 text-ink transition-colors hover:border-mint hover:text-mint"
            >
              <ContactIcon name={l.name} />
              {l.label}
              {l.ext && <span aria-hidden>↗</span>}
            </a>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="mt-6 grid gap-3">
        <input
          type="text"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="tag">Your name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className={field}
              placeholder="Ada Lovelace"
            />
          </label>
          <label className="grid gap-1">
            <span className="tag">Your email (optional)</span>
            <input
              type="email"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              autoComplete="email"
              className={field}
              placeholder="ada@example.com"
            />
          </label>
        </div>
        <label className="grid gap-1">
          <span className="tag">Message</span>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={field}
            placeholder="What are you building?"
          />
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={state === "sending"}
            className="caps min-h-11 border border-mint px-5 disabled:opacity-50 text-sm font-semibold text-mint transition hover:bg-mint hover:text-bg"
          >
            {state === "sending" ? "sending..." : "send message"}
          </button>
          <p aria-live="polite" className="font-mono text-xs text-amber">
            {state === "sent" && "> sent. i will get back to you."}
            {state === "error" && (
              <>
                {"> failed. "}
                <button type="button" onClick={openMailApp} className="underline">
                  open in mail app
                </button>
                {" or write to " + profile.email}
              </>
            )}
          </p>
        </div>
      </form>
    </section>
  );
}
