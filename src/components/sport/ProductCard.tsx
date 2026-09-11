import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/sport-data";
import { cn } from "@/lib/utils";

/**
 * Cartão de produto editorial: a imagem manda, o texto é mínimo.
 * `size="feature"` é usado nas categorias grandes da página inicial.
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
      className="group relative block overflow-hidden rounded-[1.75rem] bg-studio"
    >
      <div
        className={cn(
          "relative overflow-hidden",
          size === "feature" ? "aspect-[3/4]" : "aspect-[4/5]",
        )}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <span className="absolute left-6 top-6 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-foreground/60">
          {product.category}
        </span>

        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3
              className={cn(
                "leading-[0.92]",
                size === "feature"
                  ? "text-2xl sm:text-[2rem]"
                  : "text-xl sm:text-2xl",
              )}
            >
              {product.name}
            </h3>
            <p className="mt-2 flex items-center gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <span>Sob consulta</span>
              <span
                className={cn(
                  "hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:inline",
                  isCustomizable ? "text-cyan" : "text-magenta",
                )}
              >
                {isCustomizable ? "Personalizar" : "Pedir orçamento"}
              </span>
            </p>
          </div>

          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-foreground/20 bg-background/50 text-foreground backdrop-blur-sm transition-all duration-500 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
