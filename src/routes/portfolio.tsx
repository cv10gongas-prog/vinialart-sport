import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/sport/PageShell";
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

// No client photographs have been verified in the current repository.
// Keep the page compact rather than presenting invented projects or empty tiles.
function Portfolio() {
  return (
    <PageShell>
      <PageHero eyebrow="Portfólio" title="A identidade ganha forma." />
      <section className="brand-section brand-empty-portfolio">
        <h2>
          O próximo projeto
          <br />
          <span className="text-cyan">pode ser o teu.</span>
        </h2>
        <p>
          Fala com a VinilArt Sport para conhecer trabalhos de personalização e explicar o que
          procuras para o teu clube ou equipa.
        </p>
        <div className="flex flex-wrap gap-3">
          <SportLink to="/contactos" size="lg">
            Falar com a VinilArt
          </SportLink>
          <SportLink to="/loja" size="lg" variant="outline">
            Ver loja
          </SportLink>
        </div>
      </section>
    </PageShell>
  );
}
