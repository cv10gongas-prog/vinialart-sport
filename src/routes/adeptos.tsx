import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/sport/PageShell";
import { SportLink } from "@/components/sport/SportButton";
import { ServiceQuoteForm } from "@/components/sport/ServiceQuoteForm";
import prodBandeira from "@/assets/prod-bandeira.jpg";

export const Route = createFileRoute("/adeptos")({
  component: Adeptos,
  head: () => ({
    meta: [
      { title: "Artigos para Adeptos — VinilArt Sport" },
      {
        name: "description",
        content:
          "Bandeiras e artigos personalizados para adeptos, claques e apoio desportivo.",
      },
      { property: "og:title", content: "Artigos para Adeptos — VinilArt Sport" },
      {
        property: "og:description",
        content:
          "Bandeiras e artigos personalizados para adeptos, claques e grupos desportivos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/adeptos" }],
  }),
});

function Adeptos() {
  const [showForm, setShowForm] = useState(false);

  return (
    <PageShell>
      <section className="mx-auto max-w-[1600px] px-5 pb-10 pt-14 sm:px-8 sm:pt-20">
        <span className="label-eyebrow">Adeptos e claques</span>
        <h1 className="mt-4 max-w-2xl text-[2.4rem] leading-[0.9] sm:text-6xl">
          Artigos para adeptos
        </h1>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 pb-16 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="group overflow-hidden rounded-3xl bg-surface/60">
            <div className="overflow-hidden bg-studio">
              <img
                src={prodBandeira}
                alt="Bandeira personalizada para adeptos"
                className="media-zoom aspect-[16/10] w-full object-cover"
              />
            </div>
            <div className="p-8">
              <h2 className="text-2xl">Bandeira personalizada</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Carrega o emblema, as cores e as mensagens do teu grupo e vê o
                resultado diretamente na bandeira.
              </p>
              <SportLink
                to="/personalizar"
                search={{ produto: "bandeira-personalizada" }}
                size="lg"
                variant="primary"
                className="mt-8 w-full"
              >
                Personalizar
              </SportLink>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl bg-surface/60 p-8">
            <div>
              <span className="label-eyebrow">Sob consulta</span>
              <h2 className="mt-4 text-2xl">Outro artigo</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Indica o artigo pretendido, a quantidade e as notas do teu
                pedido. Preparamos a proposta para o teu grupo.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-8 flex h-12 w-full items-center justify-center rounded-full border border-border text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-foreground/40 hover:bg-foreground/5"
            >
              Pedido sob consulta
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mx-auto mt-16 max-w-3xl">
            <ServiceQuoteForm
              productId="artigos-adeptos"
              productName="Artigos para Adeptos"
              defaultItemOrService=""
              serviceType="adeptos"
            />
          </div>
        )}
      </section>
    </PageShell>
  );
}
