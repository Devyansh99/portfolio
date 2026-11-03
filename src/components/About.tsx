import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TerminalWindow } from "./TerminalWindow";

const facts = [
  ["location", "Mohali, India"],
  ["school", "Plaksha University · CS & AI · 2027"],
  ["focus", "applied ML, RAG, agents, computer vision"],
  ["now", "SadakVision · Cognalytix · research"],
] as const;

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="01" command="cat about.md" title="About" />
      <Reveal>
        <TerminalWindow title="devyansh@portfolio: ~/about">
          <p className="text-muted">
            <span className="text-mint">$</span> whoami
          </p>
          <p className="mb-4 text-ink">{profile.name}</p>

          <p className="text-muted">
            <span className="text-mint">$</span> cat bio.txt
          </p>
          <div className="mb-4 space-y-3 font-sans text-base text-ink/90">
            {profile.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <p className="text-muted">
            <span className="text-mint">$</span> env | grep PROFILE
          </p>
          <dl className="mt-1 grid gap-x-6 gap-y-1 sm:grid-cols-[max-content_1fr]">
            {facts.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-mint">PROFILE_{k.toUpperCase()}</dt>
                <dd className="text-ink/90">{v}</dd>
              </div>
            ))}
          </dl>
        </TerminalWindow>
      </Reveal>
    </section>
  );
}
