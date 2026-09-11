import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";

import {
  ArrowRight,
  Shield,
  Shirt,
  Flag,
  Sparkles,
  FileText,
} from "lucide-react";

import heroBrush from "@/assets/hero-brush.jpg";
import prodCaneleiras from "@/assets/prod-caneleiras.jpg";
import prodCaneleiraDetail from "@/assets/prod-caneleira-detail.jpg";
import prodEquipamento from "@/assets/prod-equipamento.jpg";

import { PageShell } from "@/components/sport/PageShell";
import { ProductCard } from "@/components/sport/ProductCard";
import { products } from "@/lib/sport-data";
import { shinGuardPairWhite } from "@/lib/customizer/mockups";

export const Route =
  createFileRoute("/")({
    component: Home,

    head: () => ({
      meta: [
        {
          title:
            "VinilArt Sport — Equipamentos & Caneleiras à tua medida",
        },
        {
          name: "description",
          content:
            "Loja oficial VinilArt Sport. Caneleiras personalizadas, equipamentos desportivos, bandeiras para adeptos, estampagem e impressão gráfica.",
        },
      ],
    }),
  });

function Home() {
  const customizableProducts = products.filter(
    (p) => p.isCustomizable && p.customizationMode === "product",
  );

  const services = products.filter(
    (p) => !p.isCustomizable || p.customizationMode !== "product",
  );

  return (
    <PageShell>
      {/* 1. HERO SECTION */}
      <section className="grain relative overflow-hidden bg-tech-grid">
        <img
          src={heroBrush}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-screen"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/35" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:py-36">
          <span className="inline-block bg-magenta px-3 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-widest text-white">
            VinilArt Sport
          </span>

          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[0.94] sm:text-6xl md:text-8xl">
            PERSONALIZAMOS{" "}
            <span className="text-sport-gradient">
              O TEU JOGO.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Caneleiras, equipamentos, bandeiras e soluções gráficas para atletas, clubes e adeptos.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/loja"
              className="inline-flex items-center gap-2 border border-cyan bg-cyan px-7 py-3.5 font-display text-sm uppercase tracking-wider text-black font-bold hover:bg-cyan/90 transition-all shadow-glow-cyan"
            >
              <span>Ver Loja</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 border border-border bg-surface px-7 py-3.5 font-display text-sm uppercase tracking-wider text-foreground hover:border-magenta hover:text-magenta transition-all"
            >
              <span>Ver Portfólio</span>
            </Link>
          </div>
        </div>

        <div className="brush-rule" />
      </section>

      {/* 2. PRODUTOS EM DESTAQUE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-cyan font-bold">
              Artigos Personalizados
            </span>
            <h2 className="mt-2 text-2xl font-black uppercase sm:text-4xl">
              Produtos em Destaque
            </h2>
          </div>
          <Link
            to="/loja"
            className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-cyan"
          >
            <span>Ver todos na loja</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {customizableProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* 3. TRABALHOS REALIZADOS (PREVIEW PORTFÓLIO) */}
      <section className="grain border-y border-border bg-tech-grid py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-magenta font-bold">
                Produções Reais
              </span>
              <h2 className="mt-2 text-2xl font-black uppercase sm:text-4xl">
                Trabalhos Realizados
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-cyan hover:text-white"
            >
              <span>Explorar Portfólio Completo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="card-sport overflow-hidden border border-border bg-surface">
              <div className="aspect-square overflow-hidden bg-black/60">
                <img
                  src={prodCaneleiras}
                  alt="Caneleiras personalizadas"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="font-mono text-[0.6rem] uppercase tracking-wider text-cyan">
                  Caneleiras
                </span>
                <h3 className="mt-1 font-display text-base font-bold">
                  Caneleiras personalizadas
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Personalização com foto, nome e grafismo desportivo.
                </p>
              </div>
            </div>

            <div className="card-sport overflow-hidden border border-border bg-surface">
              <div className="aspect-square overflow-hidden bg-black/60">
                <img
                  src={prodCaneleiraDetail}
                  alt="Detalhe gráfico da caneleira"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="font-mono text-[0.6rem] uppercase tracking-wider text-magenta">
                  Aplicação
                </span>
                <h3 className="mt-1 font-display text-base font-bold">
                  Caneleiras personalizadas
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ajuste gráfico à curvatura e formato da caneleira.
                </p>
              </div>
            </div>

            <div className="card-sport overflow-hidden border border-border bg-surface">
              <div className="aspect-square overflow-hidden bg-black/60">
                <img
                  src={prodEquipamento}
                  alt="Equipamento personalizado"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="font-mono text-[0.6rem] uppercase tracking-wider text-yellow">
                  Equipamento
                </span>
                <h3 className="mt-1 font-display text-base font-bold">
                  Equipamento personalizado
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Camisola com estampagem de emblemas e patrocinadores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVIÇOS SOB MEDIDA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-yellow font-bold">
              Soluções Gráficas
            </span>
            <h2 className="mt-2 text-2xl font-black uppercase sm:text-4xl">
              Serviços Desportivos
            </h2>
          </div>
          <Link
            to="/loja"
            className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-cyan"
          >
            <span>Ver na loja</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {services.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* 5. CTA FINAL */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="bg-magenta px-3 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-widest text-white">
            Projeto sob medida
          </span>
          <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
            Tens uma ideia?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            A equipa da VinilArt Sport trata de transformar o teu conceito ou ficheiro na personalização ideal.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contactos"
              className="inline-flex items-center gap-2 border border-cyan bg-cyan px-8 py-3.5 font-display text-xs uppercase tracking-wider text-black font-bold hover:bg-cyan/90 transition-colors shadow-glow-cyan"
            >
              <span>Pedir Orçamento</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/loja"
              className="inline-flex items-center gap-2 border border-border bg-background px-7 py-3 font-display text-xs uppercase tracking-wider text-foreground hover:border-cyan hover:text-cyan transition-colors"
            >
              <span>Explorar Loja</span>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}