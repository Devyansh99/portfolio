import { achievements, timeline, type TimelineEntry } from "@/data/timeline";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const kindLabel: Record<TimelineEntry["kind"], string> = {
  work: "experience",
  role: "leadership",
  education: "education",
};

export function Timeline() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="05"
        command="git log --experience --education"
        title="Experience & Education"
      />

      <ol className="relative ml-2 border-l border-line pl-8">
        {timeline.map((e, i) => (
          <li key={`${e.org}-${e.title}`} className="relative pb-10 last:pb-0">
            <span
              className="absolute -left-[2.45rem] top-1.5 size-3 rounded-full border-2 border-mint bg-bg"
              aria-hidden
            />
            <Reveal delay={Math.min(i, 3) * 0.05}>
              <p className="font-mono text-xs uppercase tracking-wider text-amber">
                {kindLabel[e.kind]} · {e.period}
              </p>
              <h3 className="mt-1 font-mono text-lg font-bold text-ink">
                {e.title} <span className="text-mint">@ {e.org}</span>
              </h3>
              {e.detail && (
                <p className="mt-2 text-sm text-ink/80">{e.detail}</p>
              )}
              {e.points && (
                <ul className="mt-3 space-y-2">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm text-ink/80">
                      <span className="font-mono text-mint" aria-hidden>
                        &gt;
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="mt-14">
        <h3 className="font-mono text-xs uppercase tracking-widest text-mint">
          achievements &amp; certifications
        </h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {achievements.map((a) => (
            <li
              key={a}
              className="rounded border border-line bg-surface px-4 py-3 text-sm text-ink/85"
            >
              {a}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
