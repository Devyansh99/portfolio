import { footer } from "@/data/copy";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line px-5 py-6 md:px-10">
      <div className="mx-auto flex max-w-[1360px] flex-wrap justify-between gap-2 font-mono text-xs text-muted">
        <p>{footer.left}</p>
        <p>{footer.right}</p>
      </div>
    </footer>
  );
}
