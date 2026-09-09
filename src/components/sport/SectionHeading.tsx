import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      {eyebrow && (
        <span className="skew-tag bg-magenta px-3 py-1 font-display text-[0.6rem] text-primary-foreground">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl leading-[0.95] sm:text-4xl md:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base text-muted-foreground">{text}</p>}
    </div>
  );
}
