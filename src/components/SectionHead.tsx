import { withEm } from "./Em";

type SectionHeadProps = {
  index: string;
  label: string;
  title: string;
  intro?: string;
};

export function SectionHead({ index, label, title, intro }: SectionHeadProps) {
  return (
    <header className="mb-14 grid grid-cols-12 gap-x-6 gap-y-4 md:mb-20">
      <p className="label col-span-12 md:col-span-3">
        {index} / {label}
      </p>
      <div className="col-span-12 md:col-span-9">
        <h2 className="font-display font-condensed text-display-l">
          {withEm(title)}
        </h2>
        {intro && (
          <p className="text-lead mt-6 max-w-2xl text-ink-2">{withEm(intro)}</p>
        )}
      </div>
    </header>
  );
}
