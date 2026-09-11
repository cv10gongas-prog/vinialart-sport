import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";


import { PageShell } from "@/components/sport/PageShell";
import { ProductCustomizer } from "@/components/sport/customizer/ProductCustomizer";
import { SectionHeading } from "@/components/sport/SectionHeading";

import {
  caneleirasConfig,
  getProductCustomizerConfig,
} from "@/lib/customizer/configs";

import {
  products,
  steps,
} from "@/lib/sport-data";

import { useCart } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

export interface PersonalizarSearch {
  produto?: string | undefined;
  cartItem?: string | undefined;
}

export const Route = createFileRoute(
  "/personalizar",
)({
  validateSearch: (
    search: Record<string, unknown>,
  ): PersonalizarSearch => ({
    produto:
      typeof search["produto"] ===
      "string"
        ? search["produto"]
        : undefined,

    cartItem:
      typeof search["cartItem"] ===
      "string"
        ? search["cartItem"]
        : undefined,
  }),

  component: Personalizar,

  head: () => ({
    meta: [
      {
        title:
          "Personalizador Online — VinilArt Sport",
      },
      {
        name: "description",
        content:
          "Personaliza artigos VinilArt Sport com imagens, logótipos e texto e vê a pré-visualização diretamente no site.",
      },
    ],
  }),
});

function Personalizar() {
  const {
    produto,
    cartItem: cartItemId,
  } = Route.useSearch();

  const { items } = useCart();

  const editingCartItem =
    cartItemId
      ? items.find(
          (item) =>
            item.id === cartItemId,
        )
      : undefined;

  // Default to caneleiras if product is not explicitly specified, or if valid product param
  const activeProductId =
    editingCartItem?.productId ??
    produto ??
    "caneleiras-personalizadas";

  const config =
    getProductCustomizerConfig(
      activeProductId,
    ) ?? caneleirasConfig;

  const initialDesign =
    editingCartItem?.customizerDesign;

  const customizableProducts = products.filter(
    (p) => p.isCustomizable && p.customizationMode === "product",
  );

  return (
    <PageShell>
      {/* Top compact Studio Bar: Switcher + State */}
      <div className="border-b border-border/80 bg-surface/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="bg-magenta px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-white">
              STUDIO
            </span>
            <span className="hidden font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground sm:inline">
              Personalização em Tempo Real
            </span>
          </div>

          {/* Product Switcher Chips: CANELEIRAS | EQUIPAMENTO | BANDEIRA */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {customizableProducts.map((p) => {
              const active = p.slug === config.id;
              const shortLabel =
                p.slug === "caneleiras-personalizadas"
                  ? "Caneleiras"
                  : p.slug === "equipamento-personalizado"
                    ? "Equipamento"
                    : p.slug === "bandeira-personalizada"
                      ? "Bandeira"
                      : p.name;

              return (
                <Link
                  key={p.slug}
                  to="/personalizar"
                  search={{
                    produto: p.slug,
                  }}
                  className={cn(
                    "whitespace-nowrap px-3 py-1 font-display text-[0.68rem] uppercase tracking-wider transition-all",
                    active
                      ? "bg-cyan font-bold text-black shadow-sm"
                      : "border border-border/70 bg-background/60 text-muted-foreground hover:border-cyan hover:text-foreground",
                  )}
                >
                  {shortLabel}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <section className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-5">
        <ProductCustomizer
          key={config.id}
          config={config}
          initialDesignJson={initialDesign}
          cartItemId={cartItemId}
        />
      </section>

      {/* Steps reference footer */}
      <section className="border-t border-border bg-surface/40 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Como funciona"
            title="Do design ao pedido"
            text="Cria a proposta visual, confirma o resultado no preview e guarda-a no teu pedido."
          />

          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step) => (
              <li
                key={step.n}
                className="border border-border bg-background p-3.5"
              >
                <span className="font-display text-xl text-magenta">
                  {step.n}
                </span>

                <p className="mt-1.5 font-display text-xs uppercase">
                  {step.title}
                </p>

                <p className="mt-1 text-[0.7rem] leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
