import { useState } from "react";
import {
  createFileRoute,
  Link,
  notFound,
  redirect,
} from "@tanstack/react-router";
import { ChevronRight, ArrowLeft } from "lucide-react";

import { PageShell } from "@/components/sport/PageShell";
import { ProductCard } from "@/components/sport/ProductCard";
import { TeamClubBanner } from "@/components/sport/TeamClubBanner";
import { ProductDesignWorkspace } from "@/components/sport/customizer/ProductDesignWorkspace";
import { QuoteRequestForm } from "@/components/sport/QuoteRequestForm";
import { getProductCustomizerConfig } from "@/lib/customizer/configs";
import { products as coreProducts, type Product } from "@/lib/sport-data";
import { supporterProducts } from "@/lib/supporter-products";
import { useCart } from "@/lib/cart/store";
import type { CartItem } from "@/lib/cart/types";
import { productPresentationImage } from "@/lib/sport-presentation";

const products = [...coreProducts, ...supporterProducts];

export const Route = createFileRoute("/produto/$slug")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { cartItem?: string | undefined; modo?: "design" | "ajuda" | undefined } => ({
    cartItem: typeof search["cartItem"] === "string" ? search["cartItem"] : undefined,
    modo: search["modo"] === "design" || search["modo"] === "ajuda" ? search["modo"] : undefined,
  }),
  loader: ({ params }) => {
    const product = products.find((item) => item.slug === params.slug);

    if (!product) {
      throw notFound();
    }

    if (product.customizationMode === "catalog") {
      throw redirect({
        to: "/adeptos",
        search: { artigo: undefined, cartItem: undefined },
      });
    }

    return { product };
  },

  component: Produto,

  head: ({ loaderData }) => {
    const name = loaderData?.product.name ?? "Produto";
    const description = loaderData?.product.description ?? "";

    return {
      meta: [
        { title: `${name} — VinilArt Sport` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} — VinilArt Sport` },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
});

function Produto() {
  const { product } = Route.useLoaderData();
  const { cartItem, modo } = Route.useSearch();
  const { items } = useCart();
  const item = items.find((i) => i.id === cartItem && i.productId === product.slug);

  return (
    <ProductPage
      key={`${product.slug}-${item?.id ?? "new"}`}
      product={product}
      item={item}
      initialMode={modo}
    />
  );
}

function ProductPage({
  product,
  item,
  initialMode,
}: {
  product: Product;
  item?: CartItem | undefined;
  initialMode?: "design" | "ajuda" | undefined;
}) {
  const config = getProductCustomizerConfig(product.slug);
  const isCustomizableProduct = Boolean(config);

  const related = products
    .filter((p) => p.slug !== product.slug && p.customizationMode === "product")
    .concat(products.filter((p) => p.customizationMode === "catalog"))
    .slice(0, 3);

  // Gallery for non-configurator products
  const gallery = [
    product.catalogImage ?? product.image,
    ...(product.catalogGallery ?? []),
  ];
  const [selectedImg, setSelectedImg] = useState(gallery[0]!);

  return (
    <PageShell className="bg-[#0B0E14] text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8 sm:py-12 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center gap-2 text-xs text-zinc-500 font-mono uppercase tracking-wider"
          aria-label="Percurso"
        >
          <Link to="/loja" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <ArrowLeft size={12} />
            <span>Loja</span>
          </Link>
          <ChevronRight size={12} className="text-zinc-600" />
          <span className="text-zinc-400">{product.category}</span>
          <ChevronRight size={12} className="text-zinc-600" />
          <span className="text-white font-semibold">{product.name}</span>
        </nav>

        {/* Main Product Experience */}
        {isCustomizableProduct && config ? (
          <ProductDesignWorkspace
            config={config}
            product={product}
            item={item}
            initialMethod={initialMode}
          />
        ) : (
          /* Fallback for Service Products (e.g. Estampagem, Braçadeira sob consulta) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Gallery Left */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl border border-white/10 bg-[#0e131f] p-8 flex items-center justify-center overflow-hidden">
                <img
                  src={
                    product.catalogImage
                      ? selectedImg
                      : productPresentationImage(selectedImg)
                  }
                  alt={product.name}
                  className="max-h-[85%] max-w-[85%] object-contain"
                />
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-3">
                  {gallery.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setSelectedImg(img)}
                      className={`h-20 w-20 rounded-xl border p-2 bg-zinc-950 transition-all ${
                        selectedImg === img
                          ? "border-cyan-400 scale-105"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Service Quote Form Right */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2 border-b border-white/10 pb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                  {product.category}
                </span>
                <h1 className="font-display text-3xl uppercase tracking-wider text-white">
                  {product.name}
                </h1>
                <p className="font-mono text-xs text-zinc-400">
                  Serviço Especializado sob Consulta
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed pt-2">
                  {product.description}
                </p>
              </div>

              <QuoteRequestForm
                productId={product.slug}
                productName={product.name}
                item={item}
                mode="servico"
              />
            </div>
          </div>
        )}

        {/* Banner Pedido para Toda a Equipa */}
        <section className="pt-8">
          <TeamClubBanner />
        </section>

        {/* Secção Também na Loja */}
        {related.length > 0 && (
          <section className="space-y-6 border-t border-white/10 pt-14">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                  Sugestões
                </span>
                <h2 className="mt-1 font-display text-2xl uppercase tracking-wider text-white">
                  Também na Loja
                </h2>
              </div>
              <Link
                to="/loja"
                className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-cyan-400 transition-colors"
              >
                Ver Todo o Catálogo →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
