import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Cpu, Layers, Sparkles, Wand2 } from "lucide-react";
import { PageShell } from "@/components/sport/PageShell";
import { SectionHeading } from "@/components/sport/SectionHeading";
import { SportButton, SportLink } from "@/components/sport/SportButton";
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
      { title: "Estúdio de Personalização — VinilArt Sport" },
      {
        name: "description",
        content:
          "Desenha as tuas caneleiras personalizadas em tempo real. Carrega fotos, logos, adiciona nome, número e vê o resultado hiper-realista.",
      },
      { property: "og:title", content: "Estúdio de Personalização — VinilArt Sport" },
      {
        property: "og:description",
        content:
          "O personalizador 2D oficial VinilArt Sport: imagens, remoção de fundo, ajuste inteligente e pré-visualização.",
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
      {/* Studio Header Bar */}
      <section className="grain relative border-b border-border/80 bg-surface bg-tech-grid py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav aria-label="Localização" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            <Link to="/" className="hover:text-cyan">Início</Link> /{" "}
            <Link to="/loja" className="hover:text-cyan">Loja</Link> /{" "}
            <span className="text-foreground">Estúdio 2D</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="skew-tag bg-cyan px-2.5 py-0.5 text-[0.6rem] font-black text-black">
                  ESTÚDIO 2D
                </span>
                <span className="font-mono text-[0.65rem] text-magenta uppercase tracking-wider">
                  // WORKBENCH INTERATIVO
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-4xl font-black leading-tight text-foreground">
                {editingCartItem ? `A Editar: ${editingCartItem.productName}` : "Caneleiras Personalizadas"}
              </h1>
            </div>

            {/* Quick feature indicators */}
            <div className="flex flex-wrap gap-2 text-[0.65rem] font-mono">
              <span className="border border-border/80 bg-background/80 px-2.5 py-1 text-muted-foreground">
                🛡️ LADO ESQUERDO & DIREITO
              </span>
              <span className="border border-border/80 bg-background/80 px-2.5 py-1 text-cyan">
                ⚡ REMOÇÃO DE FUNDO LOCAL
              </span>
              <span className="border border-border/80 bg-background/80 px-2.5 py-1 text-magenta">
                ✨ AJUSTE INTELIGENTE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Studio Workbench Area */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <ProductCustomizer
          config={caneleirasConfig}
          initialDesignJson={initialDesign}
          cartItemId={cartItemId}
        />

        {/* Action navigation links */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
          <div className="flex flex-wrap gap-3">
            <SportLink to="/carrinho" size="md" variant="primary" shape="slant">
              Ver Carrinho de Compras
            </SportLink>
            <SportLink to="/loja" variant="outline" shape="square" size="md">
              Ver Mais Artigos da Loja
            </SportLink>
          </div>
          <SportLink to="/contactos" variant="outline" shape="square" size="sm">
            Dúvidas ou Encomendas de Clube? Contacta-nos
          </SportLink>
        </div>
      </section>

      {/* Production Guide Ribbon */}
      <section className="border-y border-border/80 bg-surface/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Processo"
            title="Como a tua encomenda é produzida"
            text="Garantimos controlo individual de cada arte enviada antes da impressão final."
          />

          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s) => (
              <li key={s.n} className="border border-border bg-surface p-4 transition-colors hover:border-cyan">
                <span className="font-display text-2xl text-magenta">{s.n}</span>
                <p className="mt-2 font-display text-sm leading-tight text-foreground">{s.title}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* AI Teaser Laboratory */}
      <section className="border-t border-border bg-surface py-16 bg-carbon">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow/50 bg-yellow/10 px-3 py-1 text-yellow">
            <Cpu className="h-3.5 w-3.5" />
            <span className="font-display text-[0.65rem] uppercase tracking-widest">
              Conceitos Digitais // Brevemente
            </span>
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl font-black">
            Precisas de inspiração gráfica?{" "}
            <span className="text-sport-gradient block sm:inline">Gera ideias com IA.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Em breve poderás ditar um estilo ou tema e a nossa IA gerará opções exclusivas para colocares diretamente na tua caneleira.
          </p>

          <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-3">
            <input
              placeholder="Ex.: Padrão geométrico agressivo em amarelo neon e preto…"
              disabled
              className="h-11 w-full border border-border bg-background px-4 font-mono text-xs text-muted-foreground/50 outline-none cursor-not-allowed opacity-60"
            />
            <p className="font-mono text-[0.65rem] text-muted-foreground/70">
              💡 Dica: No estúdio acima podes usar fotos e logos da tua galeria com remoção de fundo automática.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

