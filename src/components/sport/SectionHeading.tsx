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
      {eyebrow && <span className="label-eyebrow">{eyebrow}</span>}
      <h2 className="mt-4 text-[2rem] leading-[0.95] sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {text && (
        <p className="mt-5 text-base text-muted-foreground sm:text-lg">{text}</p>
      )}
    </div>
  );
}
