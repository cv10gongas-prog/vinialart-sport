import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CatalogExamples } from "@/components/sport/CatalogExamples";
import { QuoteRequestForm } from "@/components/sport/QuoteRequestForm";
import { catalogExamples } from "@/lib/catalog-examples";
import { useCart } from "@/lib/cart/store";
import { PageShell } from "@/components/sport/PageShell";
import { SportLink } from "@/components/sport/SportButton";
import { ServiceQuoteForm } from "@/components/sport/ServiceQuoteForm";
import { productPresentationImage } from "@/lib/sport-presentation";
import { flagWhite } from "@/lib/customizer/mockups";

export const Route = createFileRoute("/adeptos")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { artigo?: string | undefined; cartItem?: string | undefined } => ({
    artigo: typeof search["artigo"] === "string" ? search["artigo"] : undefined,
    cartItem: typeof search["cartItem"] === "string" ? search["cartItem"] : undefined,
  }),
  component: Adeptos,
  head: () => ({
    meta: [
      { title: "Artigos para Adeptos — VinilArt Sport" },
      {
        name: "description",
        content: "Bandeiras e artigos personalizados para adeptos, claques e apoio desportivo.",
      },
      { property: "og:title", content: "Artigos para Adeptos — VinilArt Sport" },
      {
        property: "og:description",
        content: "Bandeiras e artigos personalizados para adeptos, claques e grupos desportivos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/adeptos" }],
  }),
});

function Adeptos() {
  const { artigo, cartItem } = Route.useSearch();
  const { items } = useCart();
  const item = items.find((i) => i.id === cartItem);
  const example = catalogExamples.find((e) => e.id === artigo);
  const [other, setOther] = useState(false);
  return (
    <PageShell className="brand-supporters">
      <section className="product-container py-14">
        <span className="label-eyebrow">Adeptos e clubes</span>
        <h1 className="mt-4 text-4xl sm:text-6xl">Artigos para adeptos</h1>
        <p className="mt-5 mb-10 max-w-xl text-muted-foreground">
          Alguns exemplos de trabalhos, bases e artigos de catálogo. Personalização e condições sob
          consulta.
        </p>
        {example || item || other ? (
          <>
            <div className="supporter-request">
              <div>
                {example && <img src={example.image} alt={`${example.name} — ${example.kind}`} />}
                <Link
                  to="/adeptos"
                  search={{ artigo: undefined, cartItem: undefined }}
                  onClick={() => setOther(false)}
                  className="inline-block mt-5 text-cyan"
                >
                  ← Ver todos os exemplos
                </Link>
              </div>
              <QuoteRequestForm
                key={item?.id ?? example?.id ?? "other"}
                productId="artigos-adeptos"
                productName="Artigos para Adeptos"
                example={example?.name ?? "Outro artigo"}
                item={item}
                mode="servico"
              />
            </div>
          </>
        ) : (
          <>
            <CatalogExamples />
            <div className="supporter-links">
              <SportLink
                to="/produto/$slug"
                params={{ slug: "bandeira-personalizada" }}
                search={{ cartItem: undefined, modo: undefined }}
                size="lg"
              >
                Ver bandeira personalizada
              </SportLink>
              <button className="order-secondary" onClick={() => setOther(true)}>
                Pedir outro artigo
              </button>
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}
