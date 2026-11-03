import { paper } from "@/data/research";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Research() {
  return (
    <section id="research" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="03" command="cat ./research/paper.md" title="Research" />

      <Reveal>
        <article className="relative overflow-hidden rounded-lg border border-amber/40 bg-surface p-6 shadow-[0_0_48px_-16px_rgba(255,181,71,0.35)] sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded border border-amber/60 bg-amber/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-amber">
              <span className="size-2 rounded-full bg-amber" aria-hidden />
              {paper.status}
            </span>
            <span className="font-mono text-xs text-muted">{paper.venue}</span>
          </div>

          <h3 className="mt-5 font-mono text-2xl font-bold leading-snug text-ink sm:text-3xl">
            {paper.title}
          </h3>
          <p className="mt-3 text-sm text-ink/80">
            {paper.authors.map((a, i) => (
              <span key={a}>
                {a === "Devyansh Agarwal" ? (
                  <strong className="text-mint">{a}</strong>
                ) : (
                  a
                )}
                {i < paper.authors.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
          <p className="mt-1 font-mono text-xs text-muted">{paper.affiliation}</p>

          <h4 className="mt-8 font-mono text-xs uppercase tracking-widest text-mint">
            abstract
          </h4>
          <p className="mt-2 leading-relaxed text-ink/90">{paper.abstract}</p>

          <h4 className="mt-8 font-mono text-xs uppercase tracking-widest text-mint">
            contributions
          </h4>
          <ul className="mt-2 space-y-2">
            {paper.contributions.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-ink/85">
                <span className="font-mono text-mint" aria-hidden>
                  &gt;
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-8 flex flex-wrap gap-2">
            {paper.keywords.map((k) => (
              <li
                key={k}
                className="rounded bg-surface-2 px-2 py-1 font-mono text-[11px] text-muted"
              >
                {k}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
            {paper.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-mint px-4 py-2 text-mint hover:bg-mint hover:text-bg"
              >
                {l.label} ↗
              </a>
            ))}
            <span className="rounded border border-dashed border-line px-4 py-2 text-muted">
              preprint: available once published
            </span>
          </div>
        </article>
      </Reveal>
    </section>
  );
}
