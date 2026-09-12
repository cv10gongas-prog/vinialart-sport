import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageShell({
  children,
  className = "",
  footer,
}: {
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <div className={`flex min-h-screen flex-col bg-background sport-site ${className}`}>
      <Header />
      <main className="flex-1">{children}</main>
      {footer ?? <Footer />}
    </div>
  );
}

/** Editorial page opener: quiet label, oversized title, lots of air. */
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
    <section className="brand-page-hero relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-magenta/5 blur-[160px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 pb-14 pt-16 sm:px-8 md:pb-20 md:pt-24">
        <span className="label-eyebrow">{eyebrow}</span>
        <h1 className="mt-5 max-w-4xl break-words text-[2.4rem] leading-[0.9] sm:text-6xl md:text-7xl">
          {title}
        </h1>
        {text && <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">{text}</p>}
      </div>
    </section>
  );
}
