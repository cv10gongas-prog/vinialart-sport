import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/sport/PageShell";
import { SportLink } from "@/components/sport/SportButton";

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Portfólio — VinilArt Sport" },
      {
        name: "description",
        content:
          "Portfólio da VinilArt Sport: caneleiras, equipamentos, bandeiras, artigos para adeptos, estampagem e impressão.",
      },
      { property: "og:title", content: "Portfólio — VinilArt Sport" },
      {
        property: "og:description",
        content: "Trabalhos de personalização desportiva da VinilArt Sport.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

/**
 * Grelha de espaços reservados para fotografias reais dos trabalhos.
 * Nenhuma imagem é inventada: a composição é tipográfica até existirem fotografias.
 */
const slots = [
  { label: "Caneleiras", ratio: "aspect-[4/5]", accent: "bg-magenta" },
  { label: "Equipamentos", ratio: "aspect-[4/3]", accent: "bg-cyan" },
  { label: "Bandeiras", ratio: "aspect-[4/3]", accent: "bg-yellow" },
  { label: "Artigos para adeptos", ratio: "aspect-[4/5]", accent: "bg-magenta" },
  { label: "Estampagem", ratio: "aspect-[4/5]", accent: "bg-cyan" },
  { label: "Impressão", ratio: "aspect-[4/3]", accent: "bg-yellow" },
  { label: "Detalhe de aplicação", ratio: "aspect-square", accent: "bg-cyan" },
  { label: "Trabalho de clube", ratio: "aspect-[4/3]", accent: "bg-yellow" },
];

function Portfolio() {
  return (
    <PageShell>
      <section className="mx-auto max-w-[1600px] px-5 pb-10 pt-16 sm:px-8 sm:pt-24">
        <div className="flex items-center gap-3">
          <span className="flex gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            <span className="h-1.5 w-1.5 rounded-full bg-magenta" />
            <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
          </span>
          <span className="label-eyebrow">Portfólio</span>
        </div>

        <h1 className="mt-6 max-w-[20ch] text-[2.3rem] leading-[1] sm:text-5xl md:text-6xl">
          Trabalhos realizados
        </h1>
        <p className="mt-6 max-w-lg text-sm text-muted-foreground sm:text-base">
          Esta galeria está reservada para fotografias reais dos trabalhos
          VinilArt Sport. Envia as fotografias e são colocadas aqui.
        </p>
      </section>

      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>figure]:mb-5">
          {slots.map((slot) => (
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

        <section className="mb-8 mt-20 flex flex-wrap items-center justify-between gap-8 border-t border-border pt-14">
          <div className="max-w-lg">
            <h2 className="text-[1.8rem] leading-[1] sm:text-4xl">
              Queres algo assim para a tua equipa?
            </h2>
            <p className="mt-5 text-sm text-muted-foreground sm:text-base">
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
