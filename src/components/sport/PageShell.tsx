import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <section className="grain relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-full w-[60%] opacity-25"
        style={{ background: "var(--gradient-sport)", clipPath: "polygon(30% 0,100% 0,100% 100%,0 100%)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
        <span className="skew-tag bg-cyan px-3 py-1 font-display text-[0.6rem] text-accent-foreground">
          {eyebrow}
        </span>
        <h1 className="mt-4 max-w-3xl text-[1.9rem] leading-[0.92] break-words sm:text-5xl md:text-6xl">
          {title}
        </h1>

        {text && <p className="mt-4 max-w-xl text-muted-foreground">{text}</p>}
      </div>
    </section>
  );
}
