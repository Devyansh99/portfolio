import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section
      id="about"
      data-scene="about"
      className="mx-auto max-w-[1360px] px-5 py-24 md:px-10 md:py-40"
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <p className="label col-span-12 md:col-span-3">01 / about</p>

        <Reveal className="col-span-12 space-y-6 md:col-span-7">
          {profile.bio.map((p, i) => (
            <p
              key={p}
              className={i === 0 ? "text-lead text-ink" : "text-[19px] text-ink-2"}
            >
              {p}
            </p>
          ))}
        </Reveal>

        <dl className="col-span-12 md:col-span-2">
          {profile.facts.map(([k, v]) => (
            <div key={k} className="border-t border-line py-3">
              <dt className="label">{k}</dt>
              <dd className="font-mono text-[13px] text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
