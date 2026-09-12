import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Upload, HelpCircle } from "lucide-react";

import { PageShell } from "@/components/sport/PageShell";
import { ProductCard } from "@/components/sport/ProductCard";
import { SportLink } from "@/components/sport/SportButton";
import { ProductCustomizer } from "@/components/sport/customizer/ProductCustomizer";
import { ProductAssistanceForm } from "@/components/sport/ProductAssistanceForm";

import { caneleirasConfig, getProductCustomizerConfig } from "@/lib/customizer/configs";

import { products } from "@/lib/sport-data";

import { useCart } from "@/lib/cart/store";

export interface PersonalizarSearch {
  produto?: string | undefined;
  cartItem?: string | undefined;
  modo?: "design" | "ajuda" | undefined;
}

export const Route = createFileRoute("/personalizar")({
  validateSearch: (search: Record<string, unknown>): PersonalizarSearch => ({
    produto: typeof search["produto"] === "string" ? search["produto"] : undefined,
    cartItem: typeof search["cartItem"] === "string" ? search["cartItem"] : undefined,
    modo:
      search["modo"] === "design" || search["modo"] === "ajuda"
        ? (search["modo"] as "design" | "ajuda")
        : undefined,
  }),

  component: Personalizar,

  head: () => ({
    meta: [
      { title: "Personalização — VinilArt Sport" },
      {
        name: "description",
        content:
          "Aplica o teu design em caneleiras, equipamentos e bandeiras, ou pede ajuda à equipa da VinilArt Sport.",
      },
      { property: "og:title", content: "Personalização — VinilArt Sport" },
      {
        property: "og:description",
        content: "Aplica o teu design no produto ou pede apoio à VinilArt Sport.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Personalizar() {
  const { produto, cartItem: cartItemId, modo } = Route.useSearch();

  const { items } = useCart();

  const editingCartItem = cartItemId ? items.find((item) => item.id === cartItemId) : undefined;

  const activeProductId = editingCartItem?.productId ?? produto;
  const config = activeProductId ? getProductCustomizerConfig(activeProductId) : undefined;

  const currentProduct = products.find((p) => p.slug === activeProductId);
  const initialDesign = editingCartItem?.customizerDesign;

  const effectiveMode = editingCartItem ? (modo ?? "design") : modo;

  if(activeProductId) return <Navigate to="/produto/$slug" params={{slug:activeProductId}} search={{cartItem:cartItemId,modo:modo}} replace/>;
  return (
    <PageShell className="brand-customize-page">
      {/* ESCOLHA DE PRODUTO */}
      {!activeProductId ? (
        <section className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24">
          <span className="label-eyebrow">Personalização</span>
          <h1 className="mt-4 max-w-2xl text-[2.4rem] leading-[0.9] sm:text-6xl">
            O que queres personalizar?
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground">
            Escolhe o artigo, carrega o teu design e vê o resultado no produto.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((product) => product.customizationMode === "product")
              .map((product) => (
                <ProductCard key={product.slug} product={product} personalize mode={modo} />
              ))}
          </div>
        </section>
      ) : !effectiveMode ? (
        /* ESCOLHA DE FLUXO */
        <section className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 sm:py-24">
          <span className="label-eyebrow">{currentProduct?.name ?? "Produto selecionado"}</span>
          <h1 className="mt-4 max-w-2xl text-[2.2rem] leading-[0.92] sm:text-6xl">
            Já tens o design?
          </h1>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <div className="home-path home-path-ready flex flex-col justify-between p-8">
              <div>
                <Upload className="h-5 w-5 text-cyan" />
                <h2 className="mt-6 text-2xl">Tenho o design</h2>
                <p className="mt-4 text-sm text-muted-foreground">
                  Carrega o teu ficheiro, posiciona-o no produto e vê o resultado antes de fechar o
                  pedido.
                </p>
              </div>
              <SportLink
                to="/personalizar"
                search={{ produto: activeProductId, modo: "design" }}
                size="lg"
                variant="primary"
                className="mt-10 w-full"
              >
                Começar
              </SportLink>
            </div>

            <div className="home-path home-path-help flex flex-col justify-between p-8">
              <div>
                <HelpCircle className="h-5 w-5 text-magenta" />
                <h2 className="mt-6 text-2xl">Quero ajuda</h2>
                <p className="mt-4 text-sm text-muted-foreground">
                  Envia-nos a tua ideia ou referência. A VinilArt trata do resto.
                </p>
              </div>
              <SportLink
                to="/personalizar"
                search={{ produto: activeProductId, modo: "ajuda" }}
                size="lg"
                variant="outline"
                className="mt-10 w-full"
              >
                Pedir personalização
              </SportLink>
            </div>
          </div>
        </section>
      ) : effectiveMode === "ajuda" ? (
        /* FLUXO AJUDA */
        <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
          <Link
            to="/personalizar"
            search={{ produto: activeProductId }}
            className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Voltar
          </Link>

          <h1 className="mt-8 text-[2rem] leading-[0.95] sm:text-5xl">Ainda não tens o design?</h1>
          <p className="mt-5 max-w-lg text-sm text-muted-foreground sm:text-base">
            Envia-nos a tua ideia ou referência. A VinilArt trata do resto.
          </p>

          <div className="mt-10">
            <ProductAssistanceForm
              productId={activeProductId}
              productName={currentProduct?.name ?? "Artigo personalizado"}
            />
          </div>
        </section>
      ) : (
        /* FLUXO DESIGN — PRODUTO EM GRANDE */
        <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/personalizar"
              search={{ produto: activeProductId }}
              className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Voltar
            </Link>
            <Link
              to="/loja"
              className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Ver loja →
            </Link>
          </div>

          <ProductCustomizer
            key={config?.id ?? caneleirasConfig.id}
            config={config ?? caneleirasConfig}
            initialDesignJson={initialDesign}
            cartItemId={cartItemId}
          />
        </section>
      )}
    </PageShell>
  );
}
