type SectionHeadingProps = {
  index: string;
  command: string;
  title: string;
};

export function SectionHeading({ index, command, title }: SectionHeadingProps) {
  return (
    <header className="mb-10">
      <p className="font-mono text-sm text-muted">
        <span className="text-mint">$</span> {command}
      </p>
      <h2 className="mt-2 font-mono text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        <span className="text-mint">{index}</span>
        <span className="mx-3 text-line">/</span>
        {title}
      </h2>
    </header>
  );
}
