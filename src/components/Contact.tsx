import { sectionIntros } from "@/data/copy";
import { profile } from "@/data/profile";
import { CopyEmailButton } from "./CopyEmailButton";
import { MagneticLink } from "./MagneticLink";
import { withEm } from "./Em";

export function Contact() {
  return (
    <section
      id="contact"
      data-scene="contact"
      className="mx-auto flex min-h-svh max-w-[1360px] flex-col justify-end px-5 py-24 md:px-10 md:py-40"
    >
      <p className="label">06 / contact</p>
      <h2 className="font-display font-condensed text-display-l mt-4">
        {withEm("Write to *me*.")}
      </h2>
      <p className="text-lead mt-6 max-w-xl text-ink-2">
        {sectionIntros.contact}
      </p>

      <div className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <MagneticLink
          href={`mailto:${profile.email}`}
          className="font-display font-condensed text-[clamp(2rem,6vw,5.5rem)] leading-none tracking-tight hover:text-mint"
        >
          {profile.email}
        </MagneticLink>
        <CopyEmailButton email={profile.email} />
      </div>

      <div className="mt-8 flex gap-8 text-[17px]">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-line-strong pb-0.5 hover:border-mint hover:text-mint"
        >
          GitHub
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-line-strong pb-0.5 hover:border-mint hover:text-mint"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
