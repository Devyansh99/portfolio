import { profile } from "@/data/profile";

export function AboutTab() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <p className="caps text-center text-sm font-semibold tracking-[0.2em] text-ink">
        Who is {profile.name}
      </p>

      <div className="mt-8 space-y-8">
        {profile.bio.map((b) => (
          <div key={b.label} className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-6">
            <p className="tag sm:text-right">{b.label}</p>
            <p className="text-[15px] leading-relaxed text-ink/90">{b.text}</p>
          </div>
        ))}
      </div>

      <dl className="mt-10 grid gap-x-6 gap-y-2 border-t border-line pt-6 font-mono text-xs sm:grid-cols-[9rem_1fr]">
        {profile.facts.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted sm:text-right">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-6">
        <p className="tag sm:text-right">Contact</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
          <a className="text-mint underline-offset-4 hover:underline" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a
            className="text-mint underline-offset-4 hover:underline"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            github ↗
          </a>
          <a
            className="text-mint underline-offset-4 hover:underline"
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin ↗
          </a>
        </div>
      </div>
    </div>
  );
}
