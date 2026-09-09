import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/sport-data";
import { cn } from "@/lib/utils";

const badgeStyle: Record<string, string> = {
  "Personalizável": "bg-cyan text-accent-foreground",
  Novo: "bg-yellow text-background",
  "Mais popular": "bg-magenta text-primary-foreground",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="card-sport group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-background">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-0 top-3 flex flex-col items-start gap-1">
          {product.badges.map((b) => (
            <span
              key={b}
              className={cn(
                "px-2 py-1 font-display text-[0.6rem] uppercase tracking-[0.12em]",
                badgeStyle[b],
              )}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
          {product.category}
        </p>
        <h3 className="text-sm leading-tight">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-sm text-yellow">{product.priceLabel}</span>
          <span className="text-[0.65rem] uppercase tracking-[0.14em] text-cyan opacity-0 transition-opacity group-hover:opacity-100">
            Ver produto
          </span>
        </div>
      </div>
    </Link>
  );
}
