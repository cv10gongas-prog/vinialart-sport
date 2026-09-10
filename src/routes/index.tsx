
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Palette,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import heroBrush from "@/assets/hero-brush.jpg";
import caneleirasImg from "@/assets/prod-caneleiras.jpg";
import equipamentoImg from "@/assets/prod-equipamento.jpg";
import bandeiraImg from "@/assets/prod-bandeira.jpg";
import { PageShell } from "@/components/sport/PageShell";
import { SectionHeading } from "@/components/sport/SectionHeading";
import { SportButton, SportLink } from "@/components/sport/SportButton";
import { ProductCard } from "@/components/sport/ProductCard";
import { EditorMock } from "@/components/sport/EditorMock";
import { categories, products, steps } from "@/lib/sport-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "VinilArt Sport — Personalizamos a tua paixão" },
      {
        name: "description",
        content:
          "Produtos desportivos e artigos personalizados à tua medida: caneleiras, equipamentos, bandeiras e artigos para adeptos.",
      },
      { property: "og:title", content: "VinilArt Sport — Personalizamos a tua paixão" },
      {
        property: "og:description",
        content: "Personalização desportiva premium: equipamentos, caneleiras, bandeiras e adeptos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const customizationExamples = [
  {
    title: "Caneleiras com Nome & Número",
    category: "Caneleiras",
    tag: "LADOS L / R",
    accent: "border-magenta text-magenta",
    image: caneleirasImg,
  },
  {
    title: "Equipamento Desportivo Personalizado",
    category: "Equipamentos",
    tag: "CORES DA EQUIPA",
    accent: "border-cyan text-cyan",
    image: equipamentoImg,
  },
  {
    title: "Bandeira Personalizada de Apoio",
    category: "Bandeiras",
    tag: "DESIGN À MEDIDA",
    accent: "border-yellow text-yellow",
    image: bandeiraImg,
  },
  {
    title: "Caneleiras com Foto & Logótipo",
    category: "Caneleiras",
    tag: "FOTO & LOGO",
    accent: "border-magenta text-magenta",
    image: caneleirasImg,
  },
  {
    title: "Estampagem de Equipamentos",
    category: "Estampagem",
    tag: "NOME & NÚMERO",
    accent: "border-cyan text-cyan",
    image: equipamentoImg,
  },
  {
    title: "Artigos para Adeptos & Bancada",
    category: "Artigos para Adeptos",
    tag: "BANCADA & APOIO",
    accent: "border-yellow text-yellow",
    image: bandeiraImg,
  },
];

function Home() {
  return (
    <PageShell>
      {/* HERO SECTION */}
      <section className="grain relative overflow-hidden bg-tech-grid">
        <img
          src={heroBrush}
          alt="Atletas com grafismos magenta, cyan e amarelo sobre fundo preto"
          width={1600}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-screen"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--background) 15%, color-mix(in oklab, var(--background) 80%, transparent) 55%, color-mix(in oklab, var(--background) 40%, transparent) 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:py-36">
          <div className="flex flex-wrap items-center gap-2">
            <span className="skew-tag bg-magenta px-3 py-1 font-display text-[0.65rem] text-white shadow-glow-magenta">
              VINILART SPORT // PERSONALIZAÇÃO DESPORTIVA
            </span>
            <span className="hidden font-mono text-[0.65rem] uppercase tracking-wider text-cyan sm:inline-flex bg-black/60 px-2.5 py-1 border border-cyan/30">
              EQUIPAMENTOS · CANELEIRAS · BANDEIRAS · ADEPTOS
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl text-[1.8rem] leading-[0.92] font-black tracking-tight sm:text-5xl md:text-7xl lg:text-8xl break-words">
            PERSONALIZAMOS{" "}
            <span className="text-sport-gradient glow-text-magenta block sm:inline">
              A TUA PAIXÃO.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg md:text-xl font-light leading-relaxed">
            Equipamentos e caneleiras à tua medida, bandeiras e artigos para adeptos, estampagem e impressão gráfica para o teu clube ou projeto individual.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SportLink
              to="/personalizar"
              size="lg"
              variant="primary"
              shape="slant"
              className="shadow-glow-magenta text-sm font-black"
            >
              Criar Caneleiras 2D <ArrowRight className="h-4 w-4" />
            </SportLink>
            <SportLink
              to="/loja"
              variant="outline"
              shape="square"
              size="lg"
              className="hover:border-cyan hover:text-cyan text-sm"
            >
              Explorar Catálogo
            </SportLink>
          </div>

          {/* Features ticker */}
          <div className="mt-12 grid grid-cols-2 gap-2 border-t border-border/60 pt-6 sm:grid-cols-4 sm:gap-4">
            <div className="flex items-center gap-2.5">
              <Zap className="h-4 w-4 text-cyan shrink-0" />
              <span className="font-display text-[0.65rem] uppercase tracking-wider text-foreground">
                Estúdio 2D ao vivo
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Shield className="h-4 w-4 text-magenta shrink-0" />
              <span className="font-display text-[0.65rem] uppercase tracking-wider text-foreground">
                Lados L / R Independentes
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Palette className="h-4 w-4 text-yellow shrink-0" />
              <span className="font-display text-[0.65rem] uppercase tracking-wider text-foreground">
                Estampagem & Impressão
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Trophy className="h-4 w-4 text-green-400 shrink-0" />
              <span className="font-display text-[0.65rem] uppercase tracking-wider text-foreground">
                Equipas & Clubes
              </span>
            </div>
          </div>
        </div>

        <div className="brush-rule" aria-hidden="true" />
      </section>

      {/* CATEGORIAS — ASYMMETRIC BENTO GRID */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Áreas de Personalização"
            title="O que podemos personalizar"
            text="Personalização gráfica à tua medida: caneleiras, equipamentos, bandeiras, artigos para adeptos, estampagem e impressão."
          />
          <SportLink to="/loja" variant="outline" shape="square" size="sm">
            Ver Todos os Artigos
          </SportLink>
        </div>

        {/* Bento Grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Featured Bento Hero Card: Caneleiras */}
          <div className="card-sport group relative sm:col-span-2 flex flex-col justify-between overflow-hidden border-2 border-magenta/60 p-6 sm:p-8 bg-surface">
            <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-magenta/15 blur-3xl" />
            <div className="pointer-events-none absolute right-4 bottom-4 h-48 w-48 opacity-20 sm:opacity-30">
              <img
                src={caneleirasImg}
                alt="Caneleiras personalizadas"
                className="h-full w-full object-contain filter drop-shadow-2xl"
              />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <span className="skew-tag bg-magenta px-2.5 py-0.5 text-[0.6rem] font-bold text-white">
                  PERSONALIZAÇÃO ONLINE
                </span>
                <span className="font-mono text-[0.6rem] text-cyan uppercase tracking-wider">
                  ⚡ ESTÚDIO 2D DISPONÍVEL
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl sm:text-3xl text-foreground">
                Caneleiras Personalizadas
              </h3>
              <p className="mt-2 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Desenha em tempo real com fotos, nome, número e logos de clube. Remoção inteligente de fundo e acabamento com reflexo hiper-realista.
              </p>
            </div>

            <div className="relative z-10 mt-8 flex flex-wrap items-center gap-3">
              <SportLink to="/personalizar" size="md" variant="primary" shape="slant">
                Entrar no Estúdio 2D <ArrowRight className="h-3.5 w-3.5" />
              </SportLink>
              <Link
                to="/produto/$slug"
                params={{ slug: "caneleiras-personalizadas" }}
                className="font-display text-[0.7rem] uppercase tracking-widest text-muted-foreground hover:text-cyan transition-colors"
              >
                Ficha do Produto →
              </Link>
            </div>
          </div>

          {/* Regular category cards */}
          {categories.slice(1).map((c, i) => (
            <Link
              key={c.slug}
              to="/loja"
              search={{ categoria: c.name }}
              className="card-sport group relative flex min-h-[11rem] flex-col justify-between overflow-hidden p-6 border border-border/80 bg-surface transition-all duration-300 hover:border-cyan hover:shadow-glow-cyan"
            >
              <span className="pointer-events-none absolute right-4 top-2 font-display text-5xl font-black text-white/5 group-hover:text-cyan/10 transition-colors">
                {String(i + 2).padStart(2, "0")}
              </span>

              <div>
                <span className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-widest">
                  CAT // 0{i + 2}
                </span>
                <h3 className="mt-2 font-display text-xl leading-tight group-hover:text-cyan transition-colors">
                  {c.name}
                </h3>
              </div>

              <div className="relative mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-[0.65rem] font-display uppercase tracking-[0.14em] text-cyan">
                  Explorar artigos
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-cyan transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PERSONALIZAÇÃO — PROCESS SHOWCASE */}
      <section className="grain relative border-y border-border bg-tech-grid py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Fluxo de Produção"
            title={
              <>
                Como funciona a tua{" "}
                <span className="text-sport-gradient">personalização</span>
              </>
            }
            text="Do ficheiro no teu telemóvel ou computador até à entrega final pronta a jogar."
          />

          {/* Stepper with visual connection */}
          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s) => (
              <li
                key={s.n}
                className="group relative border border-border bg-surface p-4 transition-colors hover:border-magenta"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-3xl text-magenta group-hover:text-cyan transition-colors">
                    {s.n}
                  </span>
                  <span className="font-mono text-[0.55rem] text-muted-foreground/50">
                    ETAPA
                  </span>
                </div>
                <p className="mt-2 font-display text-sm leading-tight text-foreground">
                  {s.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {s.text}
                </p>
              </li>
            ))}
          </ol>

          {/* Interactive Studio Showcase Box */}
          <div className="mt-12">
            <EditorMock />
          </div>
        </div>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Destaques de Coleção"
            title="Produtos prontos para personalização"
            text="Artigos desportivos selecionados para estampar e produzir sob pedido."
          />
          <SportLink to="/loja" variant="outline" shape="square" size="sm">
            Ver Toda a Loja
          </SportLink>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* CONCEITOS COM IA — TEASER */}
      <section className="relative overflow-hidden border-y border-border bg-surface py-16 md:py-24 bg-carbon">
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{ background: "var(--gradient-sport)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow/50 bg-yellow/10 px-3 py-1 text-yellow">
            <Cpu className="h-3.5 w-3.5" />
            <span className="font-display text-[0.65rem] uppercase tracking-widest">
              Conceitos Visuais // Brevemente
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-black leading-[0.95] sm:text-5xl">
            Não tens um design pronto?
            <br />
            <span className="text-sport-gradient">Gera conceitos com IA.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground leading-relaxed">
            Estamos a integrar modelos generativos para transformar prompts de texto em grafismos desportivos exclusivos aplicáveis às tuas caneleiras e camisolas.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                disabled
                placeholder="Ex.: Preto e dourado, padrão geométrico com dragão estilizado…"
                className="h-12 w-full border border-border bg-background px-4 text-xs font-mono text-muted-foreground/60 outline-none cursor-not-allowed"
              />
            </div>
            <SportButton variant="gradient" size="md" disabled className="opacity-60 cursor-not-allowed">
              <Sparkles className="h-4 w-4" /> Brevemente
            </SportButton>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-[0.65rem] font-mono text-muted-foreground/70">
            <span className="border border-border bg-background/50 px-2 py-1">💡 Ideia 1: Camuflado Urbano Neon</span>
            <span className="border border-border bg-background/50 px-2 py-1">💡 Ideia 2: Brasão Moderno Minimalista</span>
            <span className="border border-border bg-background/50 px-2 py-1">💡 Ideia 3: Padrão Raios & Velocidade</span>
          </div>
        </div>
      </section>

      {/* CLUBES & EQUIPAS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Clubes & Coletivos"
              title="Soluções para equipas, torneios e adeptos."
              text="Preparamos soluções completas para clubes desportivos, escolas e grupos organizados."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Caneleiras Personalizadas para Jogadores",
                "Equipamentos Personalizados para Equipas",
                "Bandeiras & Artigos de Apoio para Adeptos",
                "Numeração, Nomes e Logótipos",
                "Serviços de Estampagem & Impressão",
                "Acompanhamento Direto na Encomenda",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 border border-border bg-surface px-4 py-3 text-xs sm:text-sm"
                >
                  <Users className="h-4 w-4 shrink-0 text-cyan" />
                  <span className="min-w-0 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <SportLink to="/contactos" size="lg" variant="primary" shape="slant">
                Pedir Orçamento de Equipa
              </SportLink>
            </div>
          </div>

          <div className="grain relative min-h-[22rem] overflow-hidden border border-border bg-surface">
            <img
              src={heroBrush}
              alt="Atletas e equipamento VinilArt Sport"
              loading="lazy"
              width={1600}
              height={1104}
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-2 border border-border bg-background/90 p-4 backdrop-blur-sm">
              <div>
                <p className="font-display text-sm">Orçamentos para Clubes & Equipas</p>
                <p className="text-xs text-muted-foreground">Propostas rápidas com envio de pré-visualizações digitais.</p>
              </div>
              <SportLink to="/contactos" size="sm" variant="outline" shape="square">
                Falar Connosco
              </SportLink>
            </div>
          </div>
        </div>
      </section>

      {/* POSSIBILIDADES DE PERSONALIZAÇÃO */}
      <section className="border-y border-border bg-surface py-16 md:py-24 bg-tech-grid">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Possibilidades de Personalização"
              title="Exemplos de personalização"
              text="Explora possibilidades de aplicação gráfica, posicionamento de nomes, números e emblemas preparados pela VinilArt Sport."
            />
            <SportLink to="/loja" variant="outline" shape="square" size="sm">
              Ver Catálogo
            </SportLink>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {customizationExamples.map((item, i) => (
              <div
                key={i}
                className="card-sport group relative flex flex-col overflow-hidden border border-border bg-background"
              >
                <div className="relative aspect-video overflow-hidden bg-black/60">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108 opacity-85"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className={cn("skew-tag border bg-black/80 px-2 py-0.5 font-mono text-[0.55rem] font-bold backdrop-blur-sm", item.accent)}>
                      {item.tag}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                    {item.category}
                  </span>
                  <h4 className="mt-1 font-display text-sm text-foreground group-hover:text-cyan transition-colors">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="grain relative overflow-hidden py-24 text-center md:py-32 bg-tech-grid">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-20"
          style={{
            background: "var(--gradient-sport)",
            clipPath: "polygon(0 0, 100% 20%, 100% 80%, 0 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <span className="skew-tag bg-magenta px-3 py-1 font-display text-[0.65rem] text-white">
            ENTRA EM CAMPO
          </span>
          <h2 className="mt-4 text-3xl font-black leading-[0.9] sm:text-5xl md:text-6xl">
            PRONTO PARA CRIAR O TEU EQUIPAMENTO?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
            Começa a desenhar as tuas caneleiras no estúdio online ou consulta o catálogo para equipamentos de clube.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SportLink to="/personalizar" size="lg" variant="primary" shape="slant" className="shadow-glow-magenta">
              Personalizar Caneleiras Agora
            </SportLink>
            <SportLink to="/loja" variant="outline" shape="square" size="lg">
              Explorar Catálogo Completo
            </SportLink>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

