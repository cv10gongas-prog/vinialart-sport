import { createFileRoute } from "@tanstack/react-router";
import { Shirt, Users, Palette, Hash } from "lucide-react";
import { PageHero, PageShell } from "@/components/sport/PageShell";
import { SectionHeading } from "@/components/sport/SectionHeading";
import { SportLink } from "@/components/sport/SportButton";
import { ProductCard } from "@/components/sport/ProductCard";
import { products } from "@/lib/sport-data";

export const Route = createFileRoute("/equipamentos")({
  component: Equipamentos,
  head: () => ({
    meta: [
      { title: "Equipamentos — VinilArt Sport" },
      {
        name: "description",
        content:
          "Equipamentos personalizados para clubes e equipas: nomes, números, cores e identidade da tua equipa.",
      },
      { property: "og:title", content: "Equipamentos — VinilArt Sport" },
      {
        property: "og:description",
        content: "Equipamentos desportivos personalizados para clubes, equipas e encomendas de grupo.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/equipamentos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/equipamentos" }],
  }),
});

const blocks = [
  { icon: Shirt, title: "Personalização de Equipamentos", text: "Adaptação de cores, emblemas e identidade da tua equipa." },
  { icon: Hash, title: "Nomes e números", text: "Estampagem e numeração individual para cada atleta." },
  { icon: Users, title: "Encomendas de equipa", text: "Produção individual ou para equipas completas." },
  { icon: Palette, title: "Identidade visual", text: "Logótipos, patrocinadores e grafismos personalizados." },
];

function Equipamentos() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Equipamentos"
        title="Personalização para equipas e clubes."
        text="Desenvolvemos a personalização do teu equipamento desportivo com as cores e símbolos da tua equipa."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {blocks.map((b) => (
            <div key={b.title} className="card-sport p-5">
              <b.icon className="h-5 w-5 text-cyan" />
              <p className="mt-4 font-display text-base leading-tight">{b.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <SectionHeading eyebrow="Artigos" title="Equipamentos personalizáveis" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products
              .filter((p) => p.category === "Equipamentos" || p.category === "Estampagem")
              .map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
          </div>
        </div>

        <div className="mt-14 border border-border bg-surface p-8 text-center">
          <h2 className="text-2xl sm:text-3xl">Encomenda para a tua equipa</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Envia-nos a tua lista de nomes, números e detalhes pretendidos e preparamos a proposta.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <SportLink to="/contactos" size="lg">
              Falar com a VinilArt Sport
            </SportLink>
            <SportLink to="/personalizar" variant="outline" shape="square" size="lg">
              Personalizar
            </SportLink>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
