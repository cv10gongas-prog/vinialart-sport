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
      { title: "Adeptos — VinilArt Sport" },
      {
        name: "description",
        content:
          "Artigos personalizados para adeptos e claques: bandeiras, faixas, autocolantes e merchandising.",
      },
      { property: "og:title", content: "Adeptos — VinilArt Sport" },
      {
        property: "og:description",
        content: "Bandeiras, faixas e artigos personalizados para adeptos e grupos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/adeptos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/adeptos" }],
  }),
});

const items = [
  { icon: Flag, title: "Bandeiras", text: "Vários formatos, impressão a cores." },
  { icon: Megaphone, title: "Faixas e tarjas", text: "Mensagens e grafismos à medida." },
  { icon: Sticker, title: "Autocolantes", text: "Logos e símbolos do grupo." },
  { icon: Heart, title: "Artigos de apoio", text: "Peças personalizadas para o dia de jogo." },
];

function Adeptos() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Adeptos"
        title="Leva as tuas cores para a bancada."
        text="Artigos personalizados para adeptos, grupos e claques."
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
          <SectionHeading eyebrow="Artigos" title="Para adeptos" />
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
              className="grain flex aspect-square items-center justify-center border border-dashed border-border bg-surface"
            >
              <span className="text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                Trabalho {i + 1}
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
