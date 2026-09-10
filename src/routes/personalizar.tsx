import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PageShell } from "@/components/sport/PageShell";
import { SectionHeading } from "@/components/sport/SectionHeading";
import { SportLink } from "@/components/sport/SportButton";
import { ProductCustomizer } from "@/components/sport/customizer/ProductCustomizer";
import { caneleirasConfig } from "@/lib/customizer/configs/caneleiras";
import { steps } from "@/lib/sport-data";
import { useCart } from "@/lib/cart/store";

export interface PersonalizarSearch {
  cartItem?: string | undefined;
}

export const Route = createFileRoute("/personalizar")({
  validateSearch: (search: Record<string, unknown>): PersonalizarSearch => {
    return {
      cartItem: typeof search["cartItem"] === "string" ? search["cartItem"] : undefined,
    };
  },
  component: Personalizar,
  head: () => ({
    meta: [
      { title: "Personalizar — VinilArt Sport" },
      {
        name: "description",
        content:
          "Escolhe o produto, envia as tuas imagens e personaliza cores, nome e número. Pré-visualização antes de produzir.",
      },
      { property: "og:title", content: "Personalizar — VinilArt Sport" },
      {
        property: "og:description",
        content:
          "O personalizador VinilArt Sport: imagens, cores, nome, número e pré-visualização.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/personalizar" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/personalizar" }],
  }),
});

function Personalizar() {
  const { cartItem: cartItemId } = Route.useSearch();
  const { items } = useCart();

  const editingCartItem = cartItemId ? items.find((i) => i.id === cartItemId) : undefined;
  const initialDesign = editingCartItem?.customizerDesign;

  return (
    <PageShell>
      <PageHero
        eyebrow="Personalizar"
        title={editingCartItem ? `A editar: ${editingCartItem.productName}` : "Tu imaginas. Nós personalizamos."}
        text="Personaliza a tua caneleira: carrega a tua imagem, adiciona nome e número, ajusta à área e exporta o preview."
      />

      {/* Process steps */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => (
            <li key={s.n} className="border border-border bg-surface p-4">
              <span className="font-display text-2xl text-magenta">{s.n}</span>
              <p className="mt-2 font-display text-sm leading-tight">
                {s.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Real customizer */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <SectionHeading
          eyebrow="Caneleiras"
          title="Produto piloto — Caneleiras Personalizadas"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Seleciona o lado, carrega a tua imagem ou logo, adiciona texto e
          exporta o preview.
        </p>

        <div className="mt-8">
          <ProductCustomizer
            config={caneleirasConfig}
            initialDesignJson={initialDesign}
            cartItemId={cartItemId}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <SportLink to="/carrinho" size="lg">
            Ver carrinho
          </SportLink>
          <SportLink
            to="/contactos"
            variant="outline"
            shape="square"
            size="lg"
          >
            Finalizar pedido por contacto
          </SportLink>
        </div>
      </section>

      {/* AI teaser — clearly marked as future */}
      <section className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <SectionHeading
            align="center"
            eyebrow="Em breve"
            title={
              <>
                Não tens um design?{" "}
                <span className="text-sport-gradient">Cria um com IA.</span>
              </>
            }
          />
          <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3">
            <input
              placeholder="Descreve o design que imaginas…"
              disabled
              className="h-12 w-full border border-input bg-background px-4 text-sm outline-none placeholder:text-muted-foreground/40 cursor-not-allowed opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              Funcionalidade em desenvolvimento. Exemplo: "Preto e verde, número
              10, estilo agressivo e moderno."
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
