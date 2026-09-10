import { createFileRoute } from "@tanstack/react-router";
import { Flag, Heart, Megaphone, Sticker } from "lucide-react";
import { PageHero, PageShell } from "@/components/sport/PageShell";
import { SectionHeading } from "@/components/sport/SectionHeading";
import { SportLink } from "@/components/sport/SportButton";
import { ProductCard } from "@/components/sport/ProductCard";
import { products } from "@/lib/sport-data";

export const Route = createFileRoute("/adeptos")({
  component: Adeptos,
  head: () => ({
    meta: [
      { title: "Bandeiras & Artigos para Adeptos — VinilArt Sport" },
      {
        name: "description",
        content:
          "Bandeiras e artigos personalizados para adeptos, claques e apoio desportivo.",
      },
      { property: "og:title", content: "Bandeiras & Artigos para Adeptos — VinilArt Sport" },
      {
        property: "og:description",
        content: "Bandeiras e artigos personalizados para adeptos, claques e grupos desportivos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/adeptos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/adeptos" }],
  }),
});

const items = [
  { icon: Flag, title: "Bandeiras", text: "Vários formatos com impressão gráfica personalizada." },
  { icon: Megaphone, title: "Faixas e tarjas", text: "Mensagens, nomes e símbolos do teu clube." },
  { icon: Sticker, title: "Autocolantes", text: "Emblemas e grafismos da claque ou clube." },
  { icon: Heart, title: "Artigos de apoio", text: "Peças de apoio à equipa no dia de jogo." },
];

function Adeptos() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Bandeiras & Artigos para Adeptos"
        title="Leva as cores do teu clube para a bancada."
        text="Soluções de personalização gráfica em bandeiras, faixas e artigos de apoio para claques, adeptos e eventos desportivos."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <div key={i.title} className="card-sport p-5">
              <i.icon className="h-5 w-5 text-magenta" />
              <p className="mt-4 font-display text-base leading-tight">{i.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{i.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <SectionHeading eyebrow="Artigos" title="Bandeiras e artigos de apoio" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products
              .filter(
                (p) => p.category === "Bandeiras" || p.category === "Artigos para Adeptos",
              )
              .map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="grain flex aspect-square items-center justify-center border border-dashed border-border bg-surface text-center p-3"
            >
              <span className="text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                Possibilidade {i + 1}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <SportLink to="/personalizar" size="lg">
            Personalizar artigo
          </SportLink>
        </div>
      </section>
    </PageShell>
  );
}
