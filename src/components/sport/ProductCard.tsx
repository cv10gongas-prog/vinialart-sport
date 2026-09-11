import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/sport-data";
import { cn } from "@/lib/utils";

/**
 * Cartão de produto editorial. As imagens são mockups neutros (produto branco),
 * apresentados em estúdio — o design do cliente é que transforma o produto.
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
      className="group relative block overflow-hidden rounded-[1.5rem] border border-border/70 bg-studio transition-colors duration-500 hover:border-foreground/25"
    >
      <div
        className={cn(
          "relative overflow-hidden",
          size === "feature" ? "aspect-[3/4]" : "aspect-[4/5]",
        )}
      >
        <img
          src={product.image}
          alt={`Mockup neutro — ${product.name}`}
          loading="lazy"
          className="h-full w-full object-contain p-10 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />

        <span className="absolute left-6 top-6 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-muted-foreground">
          {product.category}
        </span>

        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3
              className={cn(
                "uppercase leading-none",
                size === "feature" ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
              )}
            >
              {product.name}
            </h3>
            <span
              className={cn(
                "mt-3 block h-px w-8 transition-all duration-500 group-hover:w-16",
                isCustomizable ? "bg-cyan" : "bg-magenta",
              )}
            />
            <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground">
              {isCustomizable ? "Personalizar · sob consulta" : "Sob consulta"}
            </p>
          </div>

          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border text-foreground transition-all duration-500 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
