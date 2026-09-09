import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { PageHero, PageShell } from "@/components/sport/PageShell";
import { SectionHeading } from "@/components/sport/SectionHeading";
import { EditorMock } from "@/components/sport/EditorMock";
import { SportButton, SportLink } from "@/components/sport/SportButton";
import { products, steps } from "@/lib/sport-data";

export const Route = createFileRoute("/personalizar")({
  component: Personalizar,
  head: () => ({
    meta: [
      { title: "Personalizar — VinilArt Sport" },
      {
        name: "description",
        content:
          "Escolhe o produto, envia as tuas imagens e personaliza cores, nome e número. Pré-visualização antes de produzir.",
      },
      { property: "og:title", content: "Personalizar — VinilArt Sport" },
      {
        property: "og:description",
        content: "O personalizador VinilArt Sport: imagens, cores, nome, número e pré-visualização.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/personalizar" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/personalizar" }],
  }),
});

function Personalizar() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Personalizar"
        title="Tu imaginas. Nós personalizamos."
        text="Interface de demonstração. O personalizador completo está em desenvolvimento."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => (
            <li key={s.n} className="border border-border bg-surface p-4">
              <span className="font-display text-2xl text-magenta">{s.n}</span>
              <p className="mt-2 font-display text-sm leading-tight">{s.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <p className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
            01 — Escolhe o produto
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {products.slice(0, 4).map((p, i) => (
              <span
                key={p.slug}
                className={`border px-4 py-2 text-xs uppercase tracking-[0.1em] ${
                  i === 0 ? "border-magenta text-magenta" : "border-border text-muted-foreground"
                }`}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <EditorMock />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <SportButton size="lg" disabled>
            Finalizar encomenda
          </SportButton>
          <SportLink to="/contactos" variant="outline" shape="square" size="lg">
            Pedir ajuda
          </SportLink>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <SectionHeading
            align="center"
            eyebrow="Em breve"
            title={
              <>
                Não tens um design?{" "}
                <span className="text-sport-gradient">Cria um com IA.</span>
              </>
            }
          />
          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              placeholder="Descreve o design que imaginas…"
              className="h-12 flex-1 border border-input bg-background px-4 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-cyan"
            />
            <SportButton variant="gradient" size="lg" disabled>
              <Sparkles className="h-4 w-4" /> Criar design
            </SportButton>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Exemplo: “Preto e verde, número 10, estilo agressivo e moderno.”
          </p>
        </div>
      </section>
    </PageShell>
  );
}
