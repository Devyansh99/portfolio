import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TerminalWindow } from "./TerminalWindow";

const channels = [
  { label: "email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "github", value: "github.com/Devyansh99", href: profile.github },
  {
    label: "linkedin",
    value: "linkedin.com/in/devyansh99",
    href: profile.linkedin,
  },
] as const;

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="06" command="./contact --open" title="Contact" />
      <Reveal>
        <TerminalWindow title="devyansh@portfolio: ~/contact">
          <p className="font-sans text-base text-ink/90">
            Email is the best way to reach me. If you are working on applied
            ML, agents or computer vision, I would like to hear about it.
          </p>
          <ul className="mt-5 space-y-2">
            {channels.map((c) => (
              <li key={c.label} className="flex flex-wrap gap-x-4">
                <span className="w-20 text-muted">{c.label}</span>
                <a
                  href={c.href}
                  target={c.label === "email" ? undefined : "_blank"}
                  rel={c.label === "email" ? undefined : "noopener noreferrer"}
                  className="text-mint underline-offset-4 hover:underline"
                >
                  {c.value}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-muted">
            <span className="text-mint">$</span> echo &quot;thanks for
            visiting&quot;
            <span className="caret" aria-hidden />
          </p>
        </TerminalWindow>
      </Reveal>
    </section>
  );
}
