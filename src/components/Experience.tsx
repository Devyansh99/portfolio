import { sectionIntros } from "@/data/copy";
import { achievements, timeline, type TimelineEntry } from "@/data/timeline";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

function Row({ e, small = false }: { e: TimelineEntry; small?: boolean }) {
  return (
    <Reveal className="grid grid-cols-12 gap-x-6 gap-y-2 border-t border-line py-8">
      <p className="label col-span-12 md:col-span-3">{e.period}</p>
      <div className="col-span-12 md:col-span-9">
        <h3
          className={`font-display font-condensed ${small ? "text-xl" : "text-[26px] leading-tight"} font-semibold`}
        >
          {e.title}
        </h3>
        <p className="text-ink-2">{e.org}</p>
        {e.detail && <p className="mt-3 text-[15px] text-ink-2">{e.detail}</p>}
        {e.points && (
          <div className="mt-4 space-y-2 text-[15px] text-ink-2">
            {e.points.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export function Experience() {
  const main = timeline.filter((e) => e.kind !== "education");
  const school = timeline.filter((e) => e.kind === "education");

  return (
    <section
      id="experience"
      data-scene="experience"
      className="mx-auto max-w-[1360px] px-5 py-24 md:px-10 md:py-40"
    >
      <SectionHead
        index="05"
        label="experience"
        title="Experience"
        intro={sectionIntros.experience}
      />

      {main.map((e) => (
        <Row key={`${e.org}-${e.title}`} e={e} />
      ))}

      <p className="label mt-16 pb-2">education</p>
      {school.map((e) => (
        <Row key={`${e.org}-${e.title}`} e={e} small />
      ))}

      <Reveal className="grid grid-cols-12 gap-x-6 border-t border-line py-8">
        <p className="label col-span-12 md:col-span-3">awards and certificates</p>
        <ul className="col-span-12 space-y-2 text-[15px] text-ink-2 md:col-span-9">
          {achievements.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
