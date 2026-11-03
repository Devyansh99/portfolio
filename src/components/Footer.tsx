import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-line px-4 py-8 text-center font-mono text-xs text-muted sm:px-6">
      <p>
        <span className="text-mint">&gt;</span> {profile.name} · built in
        Mohali with Next.js, Tailwind, Framer Motion, and three.js
      </p>
    </footer>
  );
}
