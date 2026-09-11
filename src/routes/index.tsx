import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import heroBrush from "@/assets/hero-brush.jpg";
import prodCaneleiras from "@/assets/prod-caneleiras.jpg";
import prodCaneleiraDetail from "@/assets/prod-caneleira-detail.jpg";
import prodEquipamento from "@/assets/prod-equipamento.jpg";
import prodBandeira from "@/assets/prod-bandeira.jpg";

import { PageShell } from "@/components/sport/PageShell";
import { ProductCard } from "@/components/sport/ProductCard";
import { SportLink } from "@/components/sport/SportButton";
import { products } from "@/lib/sport-data";

export const Route = createFileRoute("/")({
  component: Home,

  head: () => ({
    meta: [
      { title: "VinilArt Sport — Personaliza o teu jogo" },
      {
        name: "description",
        content:
          "Personalização desportiva para atletas, clubes e adeptos: caneleiras, equipamentos, bandeiras, estampagem e impressão.",
      },
      { property: "og:title", content: "VinilArt Sport — Personaliza o teu jogo" },
      {
        property: "og:description",
        content:
          "Personalização desportiva para atletas, clubes e adeptos: caneleiras, equipamentos e bandeiras.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const services = [
  {
    slug: "adeptos",
    name: "Artigos para adeptos",
    text: "Bandeiras e artigos de apoio preparados com as cores e símbolos do teu clube.",
    to: "/adeptos" as const,
  },
  {
    slug: "estampagem",
    name: "Estampagem",
    text: "Nomes, números, emblemas e grafismos aplicados em equipamentos e peças desportivas.",
    to: "/produto/$slug" as const,
    params: { slug: "estampagem" },
  },
  {
    slug: "impressao",
    name: "Impressão",
    text: "Impressão gráfica personalizada a partir do teu ficheiro, em suportes à medida.",
    to: "/produto/$slug" as const,
    params: { slug: "impressao" },
  },
];

function Home() {
  const featured = products.filter(
    (p) => p.isCustomizable && p.customizationMode === "product",
  );

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative -mt-[84px] flex min-h-[92svh] items-end overflow-hidden">
        <img
          src={heroBrush}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />

        <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-16 pt-40 sm:px-8 sm:pb-24">
          <span className="label-eyebrow rise-in">VinilArt Sport</span>

          <h1 className="rise-in mt-6 max-w-5xl text-[3rem] leading-[0.86] sm:text-[5.5rem] md:text-[7rem]">
            O teu design.
            <br />
            <span className="text-sport-gradient">O teu jogo.</span>
          </h1>

          <p className="rise-in mt-8 max-w-lg text-base text-muted-foreground sm:text-lg">
            Personalização desportiva para atletas, clubes e adeptos.
          </p>

          <div className="rise-in mt-10 flex flex-wrap items-center gap-3">
            <SportLink to="/loja" size="lg" variant="primary">
              Ver loja
            </SportLink>
            <SportLink to="/portfolio" size="lg" variant="outline">
              Ver portfólio
            </SportLink>
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-xl text-[2rem] leading-[0.95] sm:text-5xl">
            Produtos personalizáveis
          </h2>
          <Link
            to="/loja"
            className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Ver tudo</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} size="feature" />
          ))}
        </div>
      </section>

      {/* PORTFÓLIO */}
      <section className="border-y border-border bg-surface/30 py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-[2rem] leading-[0.95] sm:text-5xl">
              Trabalhos realizados
            </h2>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>Ver portfólio</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            <figure className="group relative overflow-hidden rounded-2xl bg-studio sm:col-span-2 lg:row-span-2">
              <img
                src={prodCaneleiras}
                alt="Caneleiras personalizadas produzidas pela VinilArt Sport"
                loading="lazy"
                className="media-zoom h-full min-h-[320px] w-full object-cover lg:min-h-[640px]"
              />
              <figcaption className="absolute inset-x-6 bottom-6 flex items-end justify-between opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="font-display text-lg">Caneleiras</span>
                <span className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
                  Personalização
                </span>
              </figcaption>
            </figure>

            {[
              { src: prodCaneleiraDetail, label: "Aplicação", alt: "Detalhe gráfico aplicado numa caneleira" },
              { src: prodEquipamento, label: "Equipamento", alt: "Equipamento desportivo personalizado" },
              { src: prodBandeira, label: "Bandeira", alt: "Bandeira personalizada para adeptos" },
            ].map((item) => (
              <figure
                key={item.label}
                className="group relative overflow-hidden rounded-2xl bg-studio"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="media-zoom h-full min-h-[280px] w-full object-cover"
                />
                <figcaption className="absolute inset-x-5 bottom-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="font-display text-base">{item.label}</span>
                </figcaption>
              </figure>
            ))}

            <figure className="group relative hidden overflow-hidden rounded-2xl bg-studio lg:block">
              <img
                src={prodCaneleiraDetail}
                alt="Grafismo desportivo aplicado em caneleira"
                loading="lazy"
                className="media-zoom h-full min-h-[280px] w-full object-cover"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 md:py-32">
        <h2 className="max-w-xl text-[2rem] leading-[0.95] sm:text-5xl">
          Serviços
        </h2>

        <div className="mt-12 divide-y divide-border border-t border-border">
          {services.map((service) =>
            service.params ? (
              <Link
                key={service.slug}
                to={service.to}
                params={service.params}
                className="group flex flex-wrap items-baseline justify-between gap-4 py-8 transition-colors hover:bg-foreground/[0.03] sm:px-2"
              >
                <span className="font-display text-2xl sm:text-3xl">
                  {service.name}
                </span>
                <span className="max-w-md flex-1 text-sm text-muted-foreground sm:text-right">
                  {service.text}
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-foreground" />
              </Link>
            ) : (
              <Link
                key={service.slug}
                to={service.to}
                className="group flex flex-wrap items-baseline justify-between gap-4 py-8 transition-colors hover:bg-foreground/[0.03] sm:px-2"
              >
                <span className="font-display text-2xl sm:text-3xl">
                  {service.name}
                </span>
                <span className="max-w-md flex-1 text-sm text-muted-foreground sm:text-right">
                  {service.text}
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-foreground" />
              </Link>
            ),
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-magenta/15 blur-[150px]" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 md:py-32">
          <h2 className="text-[2.2rem] leading-[0.95] sm:text-6xl">
            Tens uma ideia?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
            Envia-nos o teu ficheiro ou a tua referência. A VinilArt trata do
            resto.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <SportLink to="/contactos" size="lg" variant="primary">
              Pedir orçamento
            </SportLink>
            <SportLink to="/loja" size="lg" variant="outline">
              Explorar loja
            </SportLink>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
