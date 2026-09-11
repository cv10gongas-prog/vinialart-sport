import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/sport/PageShell";
import { SportLink } from "@/components/sport/SportButton";

import prodCaneleiras from "@/assets/prod-caneleiras.jpg";
import prodCaneleiraDetail from "@/assets/prod-caneleira-detail.jpg";
import prodCaneleiraAngle from "@/assets/prod-caneleira-angle.jpg";
import prodCaneleiraBack from "@/assets/prod-caneleira-back.jpg";
import prodEquipamento from "@/assets/prod-equipamento.jpg";
import prodBandeira from "@/assets/prod-bandeira.jpg";

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Portfólio — VinilArt Sport" },
      {
        name: "description",
        content:
          "Trabalhos realizados pela VinilArt Sport: caneleiras personalizadas, equipamentos e artigos desportivos.",
      },
      { property: "og:title", content: "Portfólio — VinilArt Sport" },
      {
        property: "og:description",
        content: "Galeria de trabalhos realizados pela VinilArt Sport.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const items = [
  {
    id: "caneleiras-real-1",
    title: "Caneleiras personalizadas",
    category: "Caneleiras",
    image: prodCaneleiras,
    span: "sm:col-span-2 lg:row-span-2",
    ratio: "aspect-[4/3] lg:aspect-auto lg:h-full",
  },
  {
    id: "caneleiras-detail",
    title: "Caneleiras personalizadas",
    category: "Detalhe",
    image: prodCaneleiraDetail,
    span: "",
    ratio: "aspect-square",
  },
  {
    id: "caneleiras-angle",
    title: "Caneleiras personalizadas",
    category: "Perspetiva",
    image: prodCaneleiraAngle,
    span: "",
    ratio: "aspect-square",
  },
  {
    id: "equipamento-jogo",
    title: "Equipamento personalizado",
    category: "Equipamentos",
    image: prodEquipamento,
    span: "sm:col-span-2",
    ratio: "aspect-[16/10]",
  },
  {
    id: "caneleiras-back",
    title: "Caneleiras personalizadas",
    category: "Verso",
    image: prodCaneleiraBack,
    span: "",
    ratio: "aspect-square",
  },
  {
    id: "bandeira-clube",
    title: "Bandeira personalizada",
    category: "Bandeiras",
    image: prodBandeira,
    span: "",
    ratio: "aspect-square",
  },
];

function Portfolio() {
  return (
    <PageShell>
      <section className="mx-auto max-w-[1600px] px-5 pb-10 pt-14 sm:px-8 sm:pt-20">
        <span className="label-eyebrow">Portfólio</span>
        <h1 className="mt-4 text-[2.4rem] leading-[0.9] sm:text-6xl md:text-7xl">
          Trabalhos realizados
        </h1>
      </section>

      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <figure
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl bg-studio ${item.span}`}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className={`media-zoom w-full object-cover ${item.ratio}`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <figcaption className="pointer-events-none absolute inset-x-5 bottom-5 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="block text-[0.62rem] uppercase tracking-[0.26em] text-muted-foreground">
                  {item.category}
                </span>
                <span className="mt-1 block font-display text-lg leading-tight">
                  {item.title}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <section className="mt-24 flex flex-wrap items-center justify-between gap-8 rounded-3xl bg-surface/50 px-6 py-14 sm:px-12">
          <div className="max-w-lg">
            <h2 className="text-[1.8rem] leading-[1] sm:text-4xl">
              Queres algo assim para a tua equipa?
            </h2>
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              Carrega o teu design na loja ou envia-nos a tua ideia.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <SportLink to="/loja" size="lg" variant="primary">
              Ver loja
            </SportLink>
            <SportLink to="/contactos" size="lg" variant="outline">
              Pedir orçamento
            </SportLink>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
