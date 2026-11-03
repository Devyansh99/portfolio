import { paper } from "@/data/research";

export function ResearchTab() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <p className="caps text-center text-sm font-semibold tracking-[0.2em] text-ink">
        Research
      </p>

      <article className="mt-6 border border-amber/40 bg-surface p-5 shadow-[0_0_48px_-16px_rgba(255,181,71,0.35)] sm:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <span className="caps inline-flex items-center gap-2 border border-amber/60 bg-amber/10 px-3 py-1 text-sm font-bold text-amber">
            <span className="size-2 rounded-full bg-amber" aria-hidden />
            {paper.status}
          </span>
          <span className="font-mono text-xs text-muted">{paper.venue}</span>
        </div>

        <h3 className="caps mt-5 text-2xl font-bold leading-snug text-ink">
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

        <h4 className="tag mt-7 text-mint">abstract</h4>
        <p className="mt-2 text-sm leading-relaxed text-ink/90">{paper.abstract}</p>

        <h4 className="tag mt-7 text-mint">contributions</h4>
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

        <ul className="mt-7 flex flex-wrap gap-2">
          {paper.keywords.map((k) => (
            <li
              key={k}
              className="bg-surface-2 px-2 py-1 font-mono text-[11px] text-muted"
            >
              {k}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap gap-3 font-mono text-sm">
          {paper.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-mint px-4 py-2 text-mint hover:bg-mint hover:text-bg"
            >
              {l.label} ↗
            </a>
          ))}
          <span className="border border-dashed border-line px-4 py-2 text-muted">
            preprint: available once published
          </span>
        </div>
      </article>
    </div>
  );
}
