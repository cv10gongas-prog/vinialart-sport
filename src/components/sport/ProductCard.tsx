import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "@/lib/sport-data";
import { cn } from "@/lib/utils";

const badgeStyle: Record<string, string> = {
  "Personalizável": "bg-cyan text-black font-black",
  Novo: "bg-yellow text-black font-black",
  "Mais popular": "bg-magenta text-white font-black shadow-glow-magenta",
};

export function ProductCard({ product }: { product: Product }) {
  const isCustomizable = product.customizationMode === "product";

  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="card-sport group relative flex flex-col overflow-hidden border border-border bg-surface transition-all duration-300 hover:border-cyan hover:shadow-lg hover:shadow-cyan/5"
    >
      <div className="relative aspect-square overflow-hidden bg-black/40">
        <img
          src={product.image}
          alt={product.name}
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
          {product.badges.map((b) => (
            <span
              key={b}
              className={cn(
                "px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-wider",
                badgeStyle[b],
              )}
            >
              {b}
            </span>
          ))}
        </div>

        {isCustomizable && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-black/80 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-cyan backdrop-blur-sm border border-cyan/30">
            <Sparkles className="h-3 w-3" />
            <span>Personalizável</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
          {product.category}
        </span>
        <h3 className="mt-1 font-display text-base font-bold text-foreground group-hover:text-cyan transition-colors">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
          <span className="font-mono text-xs uppercase tracking-wider text-foreground">
            {product.priceLabel}
          </span>
          <span
            className={cn(
              "flex items-center gap-1.5 font-display text-xs uppercase tracking-wider font-bold transition-transform duration-200 group-hover:translate-x-1",
              isCustomizable ? "text-cyan" : "text-magenta",
            )}
          >
            {isCustomizable ? "Personalizar" : "Pedir Orçamento"}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}