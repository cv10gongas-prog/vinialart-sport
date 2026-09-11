import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Upload, MessageSquare } from "lucide-react";

import { PageShell } from "@/components/sport/PageShell";
import { SportLink } from "@/components/sport/SportButton";
import { products } from "@/lib/sport-data";

export const Route = createFileRoute("/")({
  component: Home,

  head: () => ({
    meta: [
      { title: "VinilArt Sport — Personalização desportiva" },
      {
        name: "description",
        content:
          "Divisão desportiva da VinilArt: personalização, design e impressão em caneleiras, equipamentos, bandeiras, artigos para adeptos e estampagem.",
      },
      {
        property: "og:title",
        content: "VinilArt Sport — Personalização desportiva",
      },
      {
        property: "og:description",
        content:
          "Personalizamos material para o mundo do desporto: caneleiras, equipamentos, bandeiras, adeptos, estampagem e impressão.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

/** Áreas de personalização (produtos com editor próprio). */
const areas = [
  { slug: "caneleiras-personalizadas", label: "Caneleiras" },
  { slug: "equipamento-personalizado", label: "Equipamentos" },
  { slug: "bandeira-personalizada", label: "Bandeiras" },
];

const services = [
  {
    slug: "adeptos",
    name: "Artigos para adeptos",
    text: "Artigos de apoio preparados com as cores e símbolos do clube.",
    to: "/adeptos" as const,
  },
  {
    slug: "estampagem",
    name: "Estampagem",
    text: "Nomes, números, emblemas e grafismos em peças desportivas.",
    to: "/produto/$slug" as const,
    params: { slug: "estampagem" },
  },
  {
    slug: "impressao",
    name: "Impressão",
    text: "Impressão gráfica a partir do teu ficheiro, em suportes à medida.",
    to: "/produto/$slug" as const,
    params: { slug: "impressao" },
  },
];

/**
 * Espaços reservados para fotografias reais de trabalhos VinilArt Sport.
 * Sem imagens inventadas: composição tipográfica até existirem fotografias.
 */
const workSlots = [
  { label: "Caneleiras", ratio: "aspect-[4/5]", accent: "bg-magenta" },
  { label: "Equipamentos", ratio: "aspect-[4/3]", accent: "bg-cyan" },
  { label: "Bandeiras", ratio: "aspect-[4/3]", accent: "bg-yellow" },
  { label: "Adeptos", ratio: "aspect-[4/5]", accent: "bg-cyan" },
  { label: "Estampagem", ratio: "aspect-[4/5]", accent: "bg-magenta" },
  { label: "Impressão", ratio: "aspect-[4/3]", accent: "bg-yellow" },
];

function Home() {
  const areaProducts = areas
    .map((area) => ({
      ...area,
      product: products.find((p) => p.slug === area.slug),
    }))
    .filter((a) => a.product);

  return (
    <PageShell>
      {/* HERO — editorial, preto e branco, assinatura CMYK discreta */}
      <section className="relative -mt-[84px] overflow-hidden">
        <div className="relative mx-auto grid w-full max-w-[1600px] items-center gap-14 px-5 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-40 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex gap-1" aria-hidden="true">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                <span className="h-1.5 w-1.5 rounded-full bg-magenta" />
                <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
              </span>
              <span className="label-eyebrow">VinilArt Sport</span>
            </div>

            <h1 className="rise-in mt-7 max-w-[18ch] text-[2.7rem] leading-[0.98] sm:text-[3.8rem] lg:text-[4.4rem]">
              Personalizamos o material do teu desporto.
            </h1>

            <p className="rise-in mt-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Divisão desportiva da VinilArt. Design, personalização e impressão
              em caneleiras, equipamentos, bandeiras, artigos para adeptos e
              estampagem — para atletas, clubes e claques.
            </p>

            <div className="rise-in mt-10 flex flex-wrap items-center gap-3">
              <SportLink to="/loja" size="lg" variant="primary">
                Ver loja
              </SportLink>
              <SportLink to="/portfolio" size="lg" variant="outline">
                Ver trabalhos
              </SportLink>
            </div>
          </div>

          {/* Composição editorial: sem fotografia inventada */}
          <div className="rise-in relative lg:-mr-8">
            <div className="border-l border-border pl-8 sm:pl-10">
              <ul className="space-y-0">
                {[
                  "Caneleiras",
                  "Equipamentos",
                  "Bandeiras",
                  "Artigos para adeptos",
                  "Estampagem",
                  "Impressão",
                ].map((item, index) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-4 border-b border-border/60 py-4 last:border-b-0"
                  >
                    <span className="font-mono text-[0.62rem] tracking-[0.2em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-lg uppercase leading-none sm:text-2xl">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-8 max-w-xs font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
                Personalização · Design · Impressão
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O QUE PERSONALIZAMOS */}
      <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-border pt-10">
          <h2 className="text-[1.9rem] leading-[1] sm:text-4xl">
            O que personalizamos
          </h2>
          <Link
            to="/loja"
            className="group inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Ver loja</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areaProducts.map(({ slug, label, product }) => (
            <Link
              key={slug}
              to="/produto/$slug"
              params={{ slug }}
              className="group relative block overflow-hidden rounded-[1.5rem] bg-studio"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={product!.image}
                  alt={`Mockup neutro — ${label}`}
                  loading="lazy"
                  className="h-full w-full object-contain p-6 pb-24 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-xl uppercase leading-none sm:text-2xl">
                      {label}
                    </h3>
                    <span className="mt-2 block h-px w-8 bg-magenta transition-all duration-500 group-hover:w-16" />
                  </div>
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Personalizar
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRABALHOS REALIZADOS */}
      <section className="border-y border-border bg-surface/25 py-20 md:py-28">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-[1.9rem] leading-[1] sm:text-4xl">
              Trabalhos realizados
            </h2>
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>Ver portfólio</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>figure]:mb-5">
            {workSlots.map((slot) => (
              <figure
                key={slot.label}
                className={`relative flex break-inside-avoid items-end overflow-hidden rounded-[1.25rem] border border-border/70 bg-studio ${slot.ratio}`}
              >
                <figcaption className="w-full p-6">
                  <span className={`mb-4 block h-px w-8 ${slot.accent}`} />
                  <span className="block font-display text-lg uppercase leading-none">
                    {slot.label}
                  </span>
                  <span className="mt-2 block font-mono text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Fotografia real por colocar
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* COMO QUERES AVANÇAR? */}
      <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 md:py-28">
        <h2 className="text-[1.9rem] leading-[1] sm:text-4xl">
          Como queres avançar?
        </h2>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col justify-between rounded-[1.5rem] border border-border bg-surface/40 p-8 transition-colors hover:bg-surface/70 sm:p-10">
            <div>
              <Upload className="h-5 w-5 text-cyan" />
              <h3 className="mt-6 text-2xl leading-none sm:text-3xl">
                Já tens o design?
              </h3>
              <p className="mt-5 max-w-md text-sm text-muted-foreground sm:text-base">
                Carrega o teu ficheiro e vê como pode ficar no produto.
              </p>
            </div>
            <SportLink
              to="/personalizar"
              size="lg"
              variant="primary"
              className="mt-10 self-start"
            >
              Personalizar
            </SportLink>
          </div>

          <div className="flex flex-col justify-between rounded-[1.5rem] border border-border bg-surface/40 p-8 transition-colors hover:bg-surface/70 sm:p-10">
            <div>
              <MessageSquare className="h-5 w-5 text-magenta" />
              <h3 className="mt-6 text-2xl leading-none sm:text-3xl">
                Ainda não tens o design?
              </h3>
              <p className="mt-5 max-w-md text-sm text-muted-foreground sm:text-base">
                Envia a tua ideia ou referência e a VinilArt trata contigo da
                personalização.
              </p>
            </div>
            <SportLink
              to="/contactos"
              size="lg"
              variant="outline"
              className="mt-10 self-start"
            >
              Pedir ajuda
            </SportLink>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="mx-auto max-w-[1600px] px-5 pb-20 sm:px-8 md:pb-28">
        <h2 className="text-[1.9rem] leading-[1] sm:text-4xl">Serviços</h2>

        <div className="mt-10 divide-y divide-border border-t border-border">
          {services.map((service) =>
            service.params ? (
              <Link
                key={service.slug}
                to={service.to}
                params={service.params}
                className="group flex flex-wrap items-baseline justify-between gap-4 py-7 transition-colors hover:bg-foreground/[0.03] sm:px-2"
              >
                <span className="font-display text-xl uppercase sm:text-2xl">
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
                className="group flex flex-wrap items-baseline justify-between gap-4 py-7 transition-colors hover:bg-foreground/[0.03] sm:px-2"
              >
                <span className="font-display text-xl uppercase sm:text-2xl">
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

      {/* CTA / CONTACTO */}
      <section className="border-t border-border">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-10 px-5 py-20 sm:px-8 md:py-24">
          <div className="max-w-xl">
            <h2 className="text-[1.9rem] leading-[1] sm:text-4xl">
              Fala com a VinilArt Sport
            </h2>
            <p className="mt-5 text-sm text-muted-foreground sm:text-base">
              Envia o teu ficheiro ou a tua ideia e recebes uma proposta.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
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
