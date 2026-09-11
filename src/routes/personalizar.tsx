import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";

import {
  Sparkles,
  Upload,
  ArrowRight,
  Shield,
  Shirt,
  Flag,
  HelpCircle,
} from "lucide-react";

import { PageShell } from "@/components/sport/PageShell";
import { ProductCustomizer } from "@/components/sport/customizer/ProductCustomizer";
import { ProductAssistanceForm } from "@/components/sport/ProductAssistanceForm";

import {
  caneleirasConfig,
  getProductCustomizerConfig,
} from "@/lib/customizer/configs";

import {
  products,
} from "@/lib/sport-data";

import { useCart } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

export interface PersonalizarSearch {
  produto?: string | undefined;
  cartItem?: string | undefined;
  modo?: "design" | "ajuda" | undefined;
}

export const Route = createFileRoute(
  "/personalizar",
)({
  validateSearch: (
    search: Record<string, unknown>,
  ): PersonalizarSearch => ({
    produto:
      typeof search["produto"] === "string" ? search["produto"] : undefined,
    cartItem:
      typeof search["cartItem"] === "string" ? search["cartItem"] : undefined,
    modo:
      search["modo"] === "design" || search["modo"] === "ajuda"
        ? (search["modo"] as "design" | "ajuda")
        : undefined,
  }),

  component: Personalizar,

  head: () => ({
    meta: [
      {
        title: "Personalização — VinilArt Sport",
      },
      {
        name: "description",
        content:
          "Personaliza caneleiras, equipamentos e artigos desportivos online na VinilArt Sport.",
      },
    ],
  }),
});

function Personalizar() {
  const {
    produto,
    cartItem: cartItemId,
    modo,
  } = Route.useSearch();

  const { items } = useCart();

  const editingCartItem = cartItemId
    ? items.find((item) => item.id === cartItemId)
    : undefined;

  const activeProductId = editingCartItem?.productId ?? produto;
  const config = activeProductId
    ? getProductCustomizerConfig(activeProductId)
    : undefined;

  const currentProduct = products.find((p) => p.slug === activeProductId);
  const initialDesign = editingCartItem?.customizerDesign;

  const effectiveMode = editingCartItem ? (modo ?? "design") : modo;

  return (
    <PageShell>
      {/* 1. SE NENHUM PRODUTO FOI ESCOLHIDO: ESCOLHA DE ARTIGO */}
      {!activeProductId ? (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="text-center">
            <span className="bg-magenta px-3 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-widest text-white">
              Personalização Online
            </span>
            <h1 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
              O que queres personalizar?
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Escolhe o produto para aplicares o teu design pronto ou pedires apoio à equipa da VinilArt Sport.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {/* CANELEIRAS */}
            <Link
              to="/personalizar"
              search={{ produto: "caneleiras-personalizadas" }}
              className="card-sport group flex flex-col justify-between border-2 border-border bg-surface p-6 transition-all hover:border-cyan hover:shadow-lg hover:shadow-cyan/5"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center border border-cyan/40 bg-cyan/10 text-cyan group-hover:bg-cyan group-hover:text-black transition-colors">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold uppercase">
                  Caneleiras
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Par completo personalizável (perna esquerda e direita). Aplica a tua fotografia, logo ou grafismo.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 font-display text-xs uppercase text-cyan font-bold">
                <span>Personalizar</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* EQUIPAMENTO */}
            <Link
              to="/personalizar"
              search={{ produto: "equipamento-personalizado" }}
              className="card-sport group flex flex-col justify-between border-2 border-border bg-surface p-6 transition-all hover:border-magenta hover:shadow-lg hover:shadow-magenta/5"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center border border-magenta/40 bg-magenta/10 text-magenta group-hover:bg-magenta group-hover:text-white transition-colors">
                  <Shirt className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold uppercase">
                  Equipamento
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Camisola técnica para atletas e equipas. Personalização de frente e costas com logos, dorsais e nomes.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 font-display text-xs uppercase text-magenta font-bold">
                <span>Personalizar</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* BANDEIRA */}
            <Link
              to="/personalizar"
              search={{ produto: "bandeira-personalizada" }}
              className="card-sport group flex flex-col justify-between border-2 border-border bg-surface p-6 transition-all hover:border-yellow hover:shadow-lg hover:shadow-yellow/5"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center border border-yellow/40 bg-yellow/10 text-yellow group-hover:bg-yellow group-hover:text-black transition-colors">
                  <Flag className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold uppercase">
                  Bandeira
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Bandeira de apoio desportivo de grande impacto para claques, clubes e adeptos.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 font-display text-xs uppercase text-yellow font-bold">
                <span>Personalizar</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </section>
      ) : !effectiveMode ? (
        /* 2. PRODUTO ESCOLHIDO: ESCOLHER FLUXO (TENHO DESIGN vs QUERO AJUDA) */
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="text-center">
            <span className="bg-cyan px-3 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-widest text-black">
              {currentProduct?.name ?? "Produto Selecionado"}
            </span>
            <h1 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
              Já tens o design pronto?
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Se já tens o teu ficheiro pronto, podes carregá-lo e posicioná-lo diretamente no artigo. Se precisas de ajuda, a VinilArt trata da criação gráfica.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* OPÇÃO A: SIM, TENHO O DESIGN */}
            <div className="card-sport flex flex-col justify-between border-2 border-cyan bg-surface p-6 sm:p-8 hover:!translate-y-0">
              <div>
                <div className="inline-flex items-center gap-2 bg-cyan/15 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-cyan">
                  <Upload className="h-3.5 w-3.5" />
                  Fluxo Direto
                </div>
                <h3 className="mt-4 font-display text-2xl font-black uppercase text-foreground">
                  Sim, tenho o design
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Carrega o teu ficheiro (PNG, JPG, WEBP ou PDF), posiciona-o sobre o produto e confirma o preview final.
                </p>

                <ul className="mt-5 space-y-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                    Carregamento direto da imagem ou ficheiro
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                    Ajustar, preencher, rodar e dimensionar
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                    Pré-visualização limpa no produto
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to="/personalizar"
                  search={{ produto: activeProductId, modo: "design" }}
                  className="flex h-12 w-full items-center justify-center gap-2 border border-cyan bg-cyan font-display text-xs uppercase tracking-wider text-black font-bold hover:bg-cyan/90 transition-colors shadow-glow-cyan"
                >
                  <span>Tenho o Design — Começar</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* OPÇÃO B: NÃO, QUERO AJUDA */}
            <div className="card-sport flex flex-col justify-between border-2 border-magenta bg-surface p-6 sm:p-8 hover:!translate-y-0">
              <div>
                <div className="inline-flex items-center gap-2 bg-magenta/15 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-magenta">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Apoio VinilArt
                </div>
                <h3 className="mt-4 font-display text-2xl font-black uppercase text-foreground">
                  Não, quero ajuda da VinilArt
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Envia a tua ideia, imagem ou referência. A VinilArt trata do resto. Criamos a proposta gráfica para ti.
                </p>

                <ul className="mt-5 space-y-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-magenta" />
                    Sem necessidade de ficheiros técnicos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-magenta" />
                    Apoio especializado da nossa equipa
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-magenta" />
                    Orçamento rápido e proposta personalizada
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to="/personalizar"
                  search={{ produto: activeProductId, modo: "ajuda" }}
                  className="flex h-12 w-full items-center justify-center gap-2 border border-magenta bg-magenta font-display text-xs uppercase tracking-wider text-white font-bold hover:bg-magenta/90 transition-colors shadow-glow-magenta"
                >
                  <span>Pedir Ajuda de Design</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : effectiveMode === "ajuda" ? (
        /* 3. FLUXO B: FORMULÁRIO DE AJUDA */
        <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/personalizar"
              search={{ produto: activeProductId }}
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-cyan"
            >
              ← Voltar à escolha do modo
            </Link>
            <span className="font-mono text-xs text-muted-foreground">
              {currentProduct?.name}
            </span>
          </div>

          <ProductAssistanceForm
            productId={activeProductId}
            productName={currentProduct?.name ?? "Artigo Personalizado"}
          />
        </section>
      ) : (
        /* 4. FLUXO A: APLICAÇÃO DIRETA NO PRODUTO GRANDE */
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
            <Link
              to="/personalizar"
              search={{ produto: activeProductId }}
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-cyan"
            >
              ← Alterar modo / Ver opções
            </Link>
            <Link
              to="/loja"
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-cyan"
            >
              Ver outros produtos na Loja →
            </Link>
          </div>

          {config ? (
            <ProductCustomizer
              key={config.id}
              config={config}
              initialDesignJson={initialDesign}
              cartItemId={cartItemId}
            />
          ) : (
            <ProductCustomizer
              key={caneleirasConfig.id}
              config={caneleirasConfig}
              initialDesignJson={initialDesign}
              cartItemId={cartItemId}
            />
          )}
        </section>
      )}
    </PageShell>
  );
}