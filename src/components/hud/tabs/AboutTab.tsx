import Image from "next/image";
import { profile } from "@/data/profile";
import { Frame } from "../Frame";
import { TabHeader } from "../TabHeader";
import { ContactComposer } from "../ContactComposer";

export function AboutTab() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <Frame className="mx-auto mb-5 h-44 w-36 shrink-0 bg-surface lg:hidden">
        <div className="absolute inset-1.5 overflow-hidden">
          <Image
            src="/devyansh.jpg"
            alt="Portrait of Devyansh Agarwal"
            fill
            sizes="144px"
            className="object-cover object-[50%_20%]"
          />
        </div>
      </Frame>
      <TabHeader id="about" cmd="cat about.md" title={`Who is ${profile.name}`} />

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

      <ContactComposer />
    </div>
  );
}
