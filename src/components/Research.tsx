import { sectionIntros } from "@/data/copy";
import { paper } from "@/data/research";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { SmartClipFigure } from "./research/SmartClipFigure";

export function Research() {
  return (
    <section
      id="research"
      data-scene="research"
      className="mx-auto max-w-[1360px] px-5 py-24 md:px-10 md:py-40"
    >
      <SectionHead
        index="03"
        label="research"
        title="Research"
        intro={sectionIntros.research}
      />

      <Reveal>
        <article className="bg-paper p-6 text-paper-ink md:-mr-10 md:ml-[8.333%] md:p-12">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="font-mono text-xs text-paper-muted md:max-w-[34rem]">
              {paper.venue}
            </p>
            <span className="-rotate-[4deg] border-2 border-stamp px-3 py-1 font-mono text-[13px] font-bold uppercase tracking-wider text-stamp">
              {paper.status}
            </span>
          </div>

          <h3 className="mt-8 max-w-4xl font-serif text-4xl leading-[1.1] md:text-[44px]">
            {paper.title}
          </h3>
          <p className="mt-5 max-w-3xl text-[15px]">
            {paper.authors.map((a, i) => (
              <span key={a}>
                {a === "Devyansh Agarwal" ? (
                  <strong className="underline underline-offset-4">{a}</strong>
                ) : (
                  a
                )}
                {i < paper.authors.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
          <p className="mt-1 font-mono text-xs text-paper-muted">
            {paper.affiliation}
          </p>

          <div className="mt-10 grid gap-10 md:grid-cols-10">
            <p className="text-[17px] leading-[1.65] md:col-span-5">
              {paper.abstract}
            </p>
            <div className="md:col-span-5">
              <SmartClipFigure />
            </div>
          </div>

          <ol className="mt-10 grid gap-x-10 gap-y-3 text-[15px] md:grid-cols-2">
            {paper.contributions.map((c, i) => (
              <li key={c} className="grid grid-cols-[2rem_1fr]">
                <span className="font-mono text-paper-muted">({i + 1})</span>
                <span>{c}</span>
              </li>
            ))}
          </ol>

          <p className="mt-10 font-mono text-xs text-paper-muted">
            {paper.keywords.join(", ")}
          </p>
          <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            {paper.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-stamp pb-0.5 text-stamp"
              >
                {l.label} ↗
              </a>
            ))}
            <span className="text-paper-muted">Preprint once published.</span>
          </p>
        </article>
      </Reveal>
    </section>
  );
}
