import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag, MessageSquarePlus, Sparkles, ArrowRight } from "lucide-react";
import { PageHero, PageShell } from "@/components/sport/PageShell";
import { SectionHeading } from "@/components/sport/SectionHeading";
import { SportLink } from "@/components/sport/SportButton";
import { ServiceQuoteForm } from "@/components/sport/ServiceQuoteForm";
import { flagWhite } from "@/lib/customizer/mockups";
import { cn } from "@/lib/utils";

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
        content: "Bandeiras e artigos personalizados para adeptos, claques e grupos desportivos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/adeptos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/adeptos" }],
  }),
});

function Adeptos() {
  const [selectedFlow, setSelectedFlow] = useState<"bandeira" | "outro">("bandeira");

  return (
    <PageShell>
      <section className="border-b border-border/80 bg-surface/50 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-cyan">
            Apoio Desportivo & Claques
          </p>
          <h1 className="mt-2 text-2xl font-black uppercase sm:text-4xl text-foreground">
            Que artigo queres personalizar?
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground">
            Escolhe personalizar uma bandeira diretamente no estúdio online ou configura um pedido sob medida para outros artigos de apoio.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* 2 Options Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Opção 1: Bandeira (Personalizador Real) */}
          <div
            onClick={() => setSelectedFlow("bandeira")}
            className={cn(
              "card-sport cursor-pointer border p-6 flex flex-col justify-between transition-all",
              selectedFlow === "bandeira"
                ? "border-magenta bg-magenta/5 shadow-glow-magenta"
                : "border-border bg-surface hover:border-magenta/50",
            )}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="bg-magenta px-2.5 py-0.5 font-mono text-[0.58rem] font-bold uppercase tracking-wider text-white">
                  Personalizador 2D
                </span>
                <span className="font-mono text-[0.65rem] text-muted-foreground uppercase">
                  Opção 01
                </span>
              </div>

              <div className="mt-4 aspect-video overflow-hidden border border-border bg-black">
                <img
                  src={flagWhite}
                  alt="Bandeira branca neutra personalizável"
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="mt-4 font-display text-xl text-foreground">
                Bandeira Personalizada
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Abre o personalizador interativo com base neutra, carrega o emblema, textos e cores do teu grupo.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60">
              <SportLink
                to="/personalizar"
                search={{ produto: "bandeira-personalizada" }}
                variant={selectedFlow === "bandeira" ? "primary" : "outline"}
                size="md"
                className="w-full justify-center"
              >
                Personalizar Bandeira <ArrowRight className="h-4 w-4" />
              </SportLink>
            </div>
          </div>

          {/* Opção 2: Outro Artigo (Formulário Personalizado) */}
          <div
            onClick={() => setSelectedFlow("outro")}
            className={cn(
              "card-sport cursor-pointer border p-6 flex flex-col justify-between transition-all",
              selectedFlow === "outro"
                ? "border-cyan bg-cyan/5 shadow-glow-cyan"
                : "border-border bg-surface hover:border-cyan/50",
            )}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="bg-cyan px-2.5 py-0.5 font-mono text-[0.58rem] font-bold uppercase tracking-wider text-black">
                  Pedido sob consulta
                </span>
                <span className="font-mono text-[0.65rem] text-muted-foreground uppercase">
                  Opção 02
                </span>
              </div>

              <div className="mt-4 aspect-video flex flex-col items-center justify-center border border-dashed border-border bg-surface-2 p-6 text-center">
                <MessageSquarePlus className="h-10 w-10 text-cyan mb-2" />
                <span className="font-display text-sm uppercase tracking-wider text-foreground">
                  Artigo Sob Medida
                </span>
                <span className="text-[0.7rem] text-muted-foreground mt-1">
                  Pedido personalizado para claques, grupos e adeptos
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl text-foreground">
                Outro Artigo
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Indica o artigo pretendido, quantidade e notas para prepararmos o orçamento direto.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={() => setSelectedFlow("outro")}
                className={cn(
                  "w-full inline-flex items-center justify-center gap-2 font-display text-xs uppercase tracking-[0.14em] h-11 px-6 transition-all",
                  selectedFlow === "outro"
                    ? "bg-cyan text-black font-bold"
                    : "border border-border text-foreground hover:border-cyan hover:text-cyan",
                )}
              >
                Configurar Pedido <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Form Area when 'Outro Artigo' is selected */}
        {selectedFlow === "outro" && (
          <div className="mt-14 max-w-3xl mx-auto">
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
