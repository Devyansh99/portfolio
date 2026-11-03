import { skillGroups } from "@/data/skills";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TerminalWindow } from "./TerminalWindow";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="04" command="ls ./skills" title="Skills" />
      <Reveal>
        <TerminalWindow title="devyansh@portfolio: ~/skills">
          <div className="space-y-6">
            {skillGroups.map((g) => (
              <div key={g.command}>
                <p className="text-muted">
                  <span className="text-mint">$</span> ls --{g.command}
                </p>
                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-2">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="rounded border border-line bg-surface-2 px-2.5 py-1 text-ink transition hover:border-mint hover:text-mint"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TerminalWindow>
      </Reveal>
    </section>
  );
}
