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
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="card-sport group relative flex flex-col overflow-hidden border border-border/80 bg-surface transition-all duration-300 hover:border-magenta hover:shadow-glow-magenta"
    >
      {/* Corner technical accents */}
      <span className="pointer-events-none absolute right-2 top-2 z-10 font-mono text-[0.55rem] text-muted-foreground/40 group-hover:text-cyan transition-colors">
        REF//{product.slug.slice(0, 4).toUpperCase()}
      </span>

      <div className="relative aspect-square overflow-hidden bg-black/40">
        <img
          src={product.image}
          alt={product.name}
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
        />
        {/* Subtle dark gradient overlay at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
          {product.badges.map((b) => (
            <span
              key={b}
              className={cn(
                "skew-tag px-2 py-0.5 text-[0.6rem] uppercase tracking-wider",
                badgeStyle[b],
              )}
            >
              {b}
            </span>
          ))}
        </div>

        {product.customizationMode === "product" && (
          <div className="absolute bottom-2 left-2.5 flex items-center gap-1 rounded bg-black/75 px-2 py-0.5 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-cyan" />
            <span className="font-display text-[0.55rem] uppercase tracking-wider text-cyan">
              Personalização Online
            </span>
          </div>
        )}
        {product.customizationMode === "service" && (
          <div className="absolute bottom-2 left-2.5 flex items-center gap-1 rounded bg-black/75 px-2 py-0.5 backdrop-blur-sm">
            <span className="font-display text-[0.55rem] uppercase tracking-wider text-yellow">
              Serviço Sob Medida
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground/80">
            {product.category}
          </p>
        </div>
        <h3 className="font-display text-sm leading-snug group-hover:text-cyan transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3">
          <span className="font-display text-xs text-muted-foreground">
            {product.priceLabel}
          </span>
          <span className="flex items-center gap-1 font-display text-[0.65rem] uppercase tracking-[0.14em] text-magenta transition-transform duration-200 group-hover:translate-x-1">
            {product.customizationMode === "product" ? "Personalizar" : "Configurar Pedido"} <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

