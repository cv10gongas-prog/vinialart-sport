import { useEffect, useState } from "react";

import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Check, ShoppingBag, Upload, HelpCircle, ArrowUpRight } from "lucide-react";

import { PageShell } from "@/components/sport/PageShell";
import { ProductCard } from "@/components/sport/ProductCard";
import { SportLink } from "@/components/sport/SportButton";

import type { Product } from "@/lib/sport-data";
import type { CartItem } from "@/lib/cart/types";
import { ProductDesignWorkspace } from "@/components/sport/customizer/ProductDesignWorkspace";
import { QuoteRequestForm } from "@/components/sport/QuoteRequestForm";
import { getProductCustomizerConfig } from "@/lib/customizer/configs";
import { products as coreProducts } from "@/lib/sport-data";
import { supporterProducts } from "@/lib/supporter-products";
const products = [...coreProducts, ...supporterProducts];
import { useCart } from "@/lib/cart/store";
import { cn } from "@/lib/utils";
import { productPresentationImage } from "@/lib/sport-presentation";

import { ServiceQuoteForm } from "@/components/sport/ServiceQuoteForm";

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

    if (product.customizationMode === "catalog")
      throw redirect({ to: "/adeptos", search: { artigo: undefined, cartItem: undefined } });
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
  const [mode, setMode] = useState<"design" | "ajuda" | undefined>(
    item ? (item.mode === "design" || item.customizerDesign ? "design" : "ajuda") : initialMode,
  );
  const gallery = [product.catalogImage ?? product.image, ...(product.catalogGallery ?? [])];
  const [selected, setSelected] = useState(gallery[0]!);
  const config = getProductCustomizerConfig(product.slug);
  const isProduct = product.customizationMode === "product";
  const related = products
    .filter((p) => p.slug !== product.slug && p.customizationMode === "product")
    .concat(products.filter((p) => p.customizationMode === "catalog"))
    .slice(0, 3);
  const info = (
    <>
      <span className="label-eyebrow">{product.category}</span>
      <h1>{product.name}</h1>
      <p className="brand-price">Sob consulta</p>
      <p className="product-description">{product.description}</p>
      {isProduct && (
        <div className="product-path-choice">
          <h2>Como queres avançar?</h2>
          <button
            aria-pressed={mode === "design"}
            className={mode === "design" ? "selected-design" : ""}
            onClick={() => setMode("design")}
          >
            <Upload size={18} />
            Já tenho o design
          </button>
          <button
            aria-pressed={mode === "ajuda"}
            className={mode === "ajuda" ? "selected-help" : ""}
            onClick={() => setMode("ajuda")}
          >
            <HelpCircle size={18} />
            Quero ajuda da VinilArt
          </button>
        </div>
      )}
    </>
  );
  return (
    <PageShell className="brand-detail integrated-product">
      <div className="product-container">
        <nav className="product-breadcrumb" aria-label="Percurso">
          <Link to="/loja">Loja</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>
        {mode === "design" && config ? (
          <ProductDesignWorkspace config={config} info={info} item={item} />
        ) : (
          <div className={`integrated-layout ${!isProduct ? "service-product" : ""}`}>
            <div className="integrated-media">
              <div className={`product-gallery ${product.catalogImage ? "has-photo" : ""}`}>
                <img
                  src={product.catalogImage ? selected : productPresentationImage(selected)}
                  alt={`${product.name} — ${product.imageKind ?? "base neutra"}`}
                />
              </div>
              {product.catalogImage && <p className="image-caption">{product.imageKind}</p>}
              {gallery.length > 1 && (
                <div className="gallery-thumbs">
                  {gallery.map((img, i) => (
                    <button
                      key={img}
                      aria-label={`Ver imagem ${i + 1}`}
                      aria-pressed={selected === img}
                      onClick={() => setSelected(img)}
                    >
                      <img src={img} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="integrated-info">{info}</div>
            {(mode === "ajuda" || !isProduct) && (
              <div className="integrated-controls">
                <QuoteRequestForm
                  productId={product.slug}
                  productName={product.name}
                  item={item}
                  mode={isProduct ? "ajuda" : "servico"}
                />
              </div>
            )}
          </div>
        )}
        <section className="product-related">
          <h2>Também na loja</h2>
          <div className="catalog-grid">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
