import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Edit3 } from "lucide-react";
import { PageHero, PageShell } from "@/components/sport/PageShell";
import { SportLink } from "@/components/sport/SportButton";
import { useCart } from "@/lib/cart/store";

export const Route = createFileRoute("/carrinho")({
  component: Carrinho,
  head: () => ({
    meta: [
      { title: "Carrinho — VinilArt Sport" },
      {
        name: "description",
        content:
          "O teu carrinho VinilArt Sport. Revê os produtos selecionados e pede o teu orçamento personalizado.",
      },
      { property: "og:title", content: "Carrinho — VinilArt Sport" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/carrinho" }],
  }),
});

function Carrinho() {
  const { items, totalItems, removeItem, updateQty } = useCart();

  if (items.length === 0) {
    return (
      <PageShell>
        <PageHero
          eyebrow="Carrinho"
          title="O teu carrinho está vazio."
          text="Explora a loja e adiciona produtos para pedir um orçamento."
        />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap gap-3">
            <SportLink to="/loja" size="lg">
              Explorar loja
            </SportLink>
            <SportLink to="/personalizar" variant="outline" shape="square" size="lg">
              Personalizar produto
            </SportLink>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Resumo do pedido"
        title={`${totalItems} ${totalItems === 1 ? "artigo selecionado" : "artigos selecionados"}`}
        text="Revê a tua seleção antes de pedir o orçamento."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* Items list */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="card-sport hover:!translate-y-0 flex items-start gap-4 p-4 sm:p-5"
              >
                {/* Preview thumbnail */}
                {item.previewDataUrl ? (
                  <img
                    src={item.previewDataUrl}
                    alt={`Preview de ${item.productName}`}
                    width={80}
                    height={80}
                    className="h-20 w-20 shrink-0 border border-border object-cover"
                  />
                ) : (
                  <div className="grid h-20 w-20 shrink-0 place-items-center border border-dashed border-border bg-background">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground/40" aria-hidden="true" />
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Link
                    to="/produto/$slug"
                    params={{ slug: item.productId }}
                    className="font-display text-sm hover:text-cyan"
                  >
                    {item.productName}
                  </Link>
                  {item.variant && (
                    <p className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                      Tamanho: {item.variant}
                    </p>
                  )}
                  {item.customizerDesign && (
                    <div className="mt-0.5 flex flex-wrap items-center gap-3">
                      <span className="text-[0.65rem] uppercase tracking-[0.12em] text-cyan">
                        Design personalizado incluído
                      </span>
                      <Link
                        to="/personalizar"
                        search={{ cartItem: item.id }}
                        className="inline-flex items-center gap-1 font-display text-[0.65rem] uppercase tracking-[0.12em] text-magenta hover:underline"
                      >
                        <Edit3 className="h-3 w-3" aria-hidden="true" />
                        Editar personalização
                      </Link>
                    </div>
                  )}
                  {item.serviceDetails && (
                    <div className="mt-2 rounded border border-border/80 bg-background/50 p-2.5 text-xs text-muted-foreground space-y-1">
                      <p className="font-semibold text-foreground">
                        Peça/Suporte: <span className="font-normal text-muted-foreground">{item.serviceDetails.itemOrServiceType}</span>
                      </p>
                      {item.serviceDetails.approxDimensions && (
                        <p className="text-[0.7rem]">
                          Medidas / Localização: <span className="text-foreground">{item.serviceDetails.approxDimensions}</span>
                        </p>
                      )}
                      {item.serviceDetails.notes && (
                        <p className="text-[0.7rem] italic">
                          "{item.serviceDetails.notes}"
                        </p>
                      )}
                      {item.serviceDetails.fileName && (
                        <p className="text-[0.7rem] text-cyan">
                          ✓ Ficheiro anexado: {item.serviceDetails.fileName}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">Preço sob consulta</p>
                </div>

                {/* Quantity + remove */}
                <div className="flex shrink-0 flex-col items-end gap-3">
                  <button
                    aria-label={`Remover ${item.productName} do carrinho`}
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <div className="inline-flex items-center border border-border">
                    <button
                      aria-label="Diminuir quantidade"
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="grid h-8 w-8 place-items-center text-muted-foreground transition-colors hover:text-cyan disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                    >
                      <Minus className="h-3 w-3" aria-hidden="true" />
                    </button>
                    <span className="w-10 text-center font-display text-sm" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      aria-label="Aumentar quantidade"
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="grid h-8 w-8 place-items-center text-muted-foreground transition-colors hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                    >
                      <Plus className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <aside>
            <div className="card-sport hover:!translate-y-0 p-6">
              <p className="font-display text-sm">Resumo do pedido</p>
              <div className="brush-rule my-4" />

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Artigos</dt>
                  <dd>{totalItems}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Preço</dt>
                  <dd className="text-muted-foreground">Sob consulta</dd>
                </div>
              </dl>

              <p className="mt-4 text-xs text-muted-foreground">
                O valor final é calculado após análise do teu pedido e design.
                Receberás uma proposta detalhada.
              </p>

              <SportLink
                to="/contactos"
                size="lg"
                className="mt-6 w-full justify-center"
              >
                Pedir orçamento <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </SportLink>

              <SportLink
                to="/loja"
                variant="outline"
                shape="square"
                size="sm"
                className="mt-3 w-full justify-center"
              >
                Continuar a comprar
              </SportLink>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
