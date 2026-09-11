import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/sport-data";
import { cn } from "@/lib/utils";

/**
 * Editorial product card: the image carries the card, text stays minimal.
 * `size="feature"` is used for the three hero categories on the homepage.
 */
export function ProductCard({
  product,
  size = "default",
}: {
  product: Product;
  size?: "default" | "feature";
}) {
  const isCustomizable = product.customizationMode === "product";

  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface/60 transition-colors duration-500 hover:bg-surface"
    >
      <div
        className={cn(
          "relative overflow-hidden bg-studio",
          size === "feature" ? "aspect-[4/5]" : "aspect-[4/3]",
        )}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="media-zoom h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/85 via-background/25 to-transparent" />

        <span className="absolute left-5 top-5 text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-foreground/70">
          {product.category}
        </span>

        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3
              className={cn(
                "leading-[0.95]",
                size === "feature" ? "text-2xl sm:text-3xl" : "text-xl",
              )}
            >
              {product.name}
            </h3>
            <p className="mt-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Sob consulta
            </p>
          </div>

          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-foreground/20 bg-background/60 text-foreground backdrop-blur-sm transition-all duration-300 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-5 py-5">
        <p className="line-clamp-2 max-w-md text-sm text-muted-foreground">
          {product.description}
        </p>
        <span
          className={cn(
            "hidden shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.2em] sm:block",
            isCustomizable ? "text-cyan" : "text-magenta",
          )}
        >
          {isCustomizable ? "Personalizar" : "Pedir orçamento"}
        </span>
      </div>
    </Link>
  );
}
