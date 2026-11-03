import { paper } from "@/data/research";
import { TabHeader } from "../TabHeader";

export function ResearchTab() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <TabHeader id="research" cmd="less paper.pdf" title="One paper, under review." />

      <span className="caps inline-flex items-center gap-2 border border-amber/60 bg-amber/10 px-3 py-1 text-sm font-bold text-amber">
        <span className="size-2 rounded-full bg-amber" aria-hidden />
        {paper.status}
      </span>

      <h3 className="mt-5 font-display text-2xl font-bold leading-tight text-ink sm:text-4xl">
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
      <p className="mt-2 text-xs leading-relaxed text-muted">{paper.venue}</p>

      <section className="mt-10">
        <h4 className="tag hash text-mint">In plain words</h4>
        <div className="mt-3 grid gap-px border border-line bg-line xl:grid-cols-3">
          {paper.plain.map((p) => (
            <div key={p.label} className="bg-surface p-5">
              <p className="caps text-lg font-bold text-amber">{p.label}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/85">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h4 className="tag hash text-mint">How a drive becomes a report</h4>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {paper.pipeline.map((s, i) => (
            <li
              key={s.step}
              className="relative border border-line border-t-2 border-t-mint bg-surface p-4"
            >
              <span className="font-mono text-xs text-mint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="caps mt-1 text-lg font-semibold leading-tight text-ink">
                {s.step}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/75">
                {s.text}
              </p>
              {i % 3 !== 2 && i < paper.pipeline.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 bg-bg font-mono text-xs text-mint lg:block"
                >
                  ─▶
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      <details className="group mt-10 border border-line bg-surface">
        <summary className="caps flex cursor-pointer list-none items-center justify-between px-5 py-3 text-sm font-semibold text-ink hover:text-mint">
          Read the full abstract
          <span aria-hidden className="text-mint group-open:rotate-45">
            +
          </span>
        </summary>
        <p className="border-t border-line px-5 py-4 text-[14px] leading-relaxed text-ink/85">
          {paper.abstract}
        </p>
      </details>

      <ul className="mt-8 flex flex-wrap gap-2">
        {paper.keywords.map((k) => (
          <li
            key={k}
            className="bg-surface-2 px-2 py-1 font-mono text-[11px] text-muted"
          >
            {k}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3 font-mono text-sm">
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
        <span className="self-center text-xs text-muted">
          Preprint once published.
        </span>
      </div>
    </div>
  );
}
