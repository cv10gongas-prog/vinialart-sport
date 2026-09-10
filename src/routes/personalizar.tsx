import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";

import {
  Layers,
  Paintbrush,
} from "lucide-react";

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
  produto?: string;
  cartItem?: string;
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

  const selectedProductId =
    editingCartItem?.productId ??
    produto ??
    "caneleiras-personalizadas";

  const config =
    getProductCustomizerConfig(
      selectedProductId,
    ) ?? caneleirasConfig;

  const selectedProduct =
    products.find(
      (product) =>
        product.slug === config.id,
    );

  const initialDesign =
    editingCartItem?.customizerDesign;

  return (
    <PageShell>
      <section className="grain border-b border-border bg-surface bg-tech-grid">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <nav className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
            <Link
              to="/"
              className="hover:text-cyan"
            >
              Início
            </Link>{" "}
            /{" "}
            <Link
              to="/loja"
              className="hover:text-cyan"
            >
              Loja
            </Link>{" "}
            /{" "}
            <span className="text-foreground">
              Personalizar
            </span>
          </nav>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-cyan px-3 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-black">
                <Paintbrush className="h-3.5 w-3.5" />
                Personalizador online
              </div>

              <h1 className="mt-3 text-3xl font-black sm:text-5xl">
                {editingCartItem
                  ? `Editar ${editingCartItem.productName}`
                  : config.name}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Carrega as tuas imagens,
                posiciona os elementos e
                alterna para a
                pré-visualização sempre
                que quiseres.
              </p>
            </div>

            <div className="flex items-center gap-2 border border-border bg-background/70 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-cyan">
              <Layers className="h-3.5 w-3.5" />
              Preview no próprio site
            </div>
          </div>
        </div>
      </section>

      {!editingCartItem && (
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
            Escolhe o que queres
            personalizar
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {products
              .filter(
                (product) =>
                  product.isCustomizable,
              )
              .map((product) => {
                const active =
                  product.slug ===
                  config.id;

                return (
                  <Link
                    key={product.slug}
                    to="/personalizar"
                    search={{
                      produto:
                        product.slug,
                    }}
                    className={cn(
                      "border px-4 py-2 font-display text-[0.65rem] uppercase tracking-wider transition-colors",
                      active
                        ? "border-magenta bg-magenta text-white"
                        : "border-border bg-surface text-muted-foreground hover:border-cyan hover:text-cyan",
                    )}
                  >
                    {product.name}
                  </Link>
                );
              })}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {selectedProduct && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border border-border bg-surface px-4 py-3">
            <div>
              <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted-foreground">
                Produto atual
              </p>

              <p className="font-display text-sm">
                {selectedProduct.name}
              </p>
            </div>

            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan">
              {selectedProduct.priceLabel}
            </span>
          </div>
        )}

        <ProductCustomizer
          key={config.id}
          config={config}
          initialDesignJson={
            initialDesign
          }
          cartItemId={cartItemId}
        />
      </section>

      <section className="border-y border-border bg-surface/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Como funciona"
            title="Do design ao pedido"
            text="Cria a proposta visual, confirma o resultado e guarda-a no carrinho."
          />

          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step) => (
              <li
                key={step.n}
                className="border border-border bg-background p-4"
              >
                <span className="font-display text-2xl text-magenta">
                  {step.n}
                </span>

                <p className="mt-2 font-display text-sm">
                  {step.title}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
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
