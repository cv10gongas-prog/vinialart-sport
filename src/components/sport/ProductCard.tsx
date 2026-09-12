import { Link } from "@tanstack/react-router";
import { ArrowRight, Printer } from "lucide-react";
import type { Product } from "@/lib/sport-data";
import { productPresentationImage } from "@/lib/sport-presentation";

export function ProductCard({
  product,
}: {
  product: Product;
  size?: "default" | "feature";
  personalize?: boolean;
  mode?: "design" | "ajuda" | undefined;
}) {
  const isCustomizable = product.customizationMode === "product";
  const isCatalog = product.customizationMode === "catalog";

  // Transparent starting price or badge
  const priceDisplay =
    product.slug === "caneleiras-personalizadas"
      ? "Desde 19,90€"
      : "Sob Orçamento";

  const imageSrc = product.catalogImage
    ? product.catalogImage
    : isCustomizable
      ? productPresentationImage(product.image)
      : null;

  const cardContent = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e131f] transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,200,255,0.08)]">
      {/* Uniform mockup framing with top lighting radial gradient */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent p-6 flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-60" />

        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${product.name} — ${product.imageKind ?? "mockup"}`}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-zinc-500 group-hover:text-cyan-400 transition-colors">
            <Printer size={56} strokeWidth={1.5} />
            <span className="font-mono text-xs uppercase tracking-widest">Serviço Gráfico</span>
          </div>
        )}

        {/* Elegant price badge */}
        <span className="absolute top-3.5 right-3.5 rounded-full border border-white/10 bg-zinc-950/80 px-2.5 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-zinc-300 backdrop-blur-md">
          {priceDisplay}
        </span>
      </div>

      {/* Card Info */}
      <div className="flex flex-1 flex-col justify-between p-5 border-t border-white/5 bg-zinc-950/40">
        <div>
          <span className="text-[0.68rem] font-mono uppercase tracking-widest text-zinc-500">
            {product.category}
          </span>
          <h3 className="mt-1 font-display text-base uppercase tracking-wide text-white transition-colors group-hover:text-cyan-300">
            {product.name}
          </h3>
        </div>

        {/* Minimalist action button */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-cyan-400 group-hover:text-cyan-300">
          <span>{isCustomizable ? "Personalizar" : "Pedir Orçamento"}</span>
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </div>
  );

  if (isCatalog) {
    return (
      <Link
        to="/adeptos"
        search={{ artigo: undefined, cartItem: undefined }}
        className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-2xl"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      search={{ cartItem: undefined, modo: undefined }}
      className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-2xl"
    >
      {cardContent}
    </Link>
  );
}
