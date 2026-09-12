import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/sport/PageShell";
import { ProductCard } from "@/components/sport/ProductCard";
import { SportLink } from "@/components/sport/SportButton";
import { CatalogExamples } from "@/components/sport/CatalogExamples";
import { products } from "@/lib/sport-data";

export const Route = createFileRoute("/loja")({
  component: Loja,
  head: () => ({
    meta: [
      { title: "Loja — VinilArt Sport" },
      {
        name: "description",
        content:
          "Caneleiras, equipamentos e bandeiras personalizáveis, além de artigos para adeptos, estampagem e impressão gráfica.",
      },
      { property: "og:title", content: "Loja — VinilArt Sport" },
      {
        property: "og:description",
        content: "Produtos personalizáveis e serviços gráficos desportivos da VinilArt Sport.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Loja() {
  const customizable = products.filter(
    (p) => p.isCustomizable && p.customizationMode === "product",
  );

  const servicesAndOthers = products.filter(
    (p) => !p.isCustomizable || p.customizationMode !== "product",
  );

  return (
    <PageShell className="brand-shop">
      <PageHero
        eyebrow="Catálogo"
        title="Loja VinilArt Sport"
        text="Produtos personalizáveis online e serviços gráficos sob consulta."
      />

      <div className="brand-section">
        <section>
          <div className="flex items-end justify-between gap-6 border-t border-border pt-8">
            <h2 className="text-2xl sm:text-3xl">Produtos personalizáveis</h2>
            <span className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
              {customizable.length} artigos
            </span>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {customizable.map((product) => (
              <ProductCard key={product.slug} product={product} size="feature" />
            ))}
          </div>
        </section>

        <section className="mt-24">
          <div className="flex items-end justify-between gap-6 border-t border-border pt-8">
            <h2 className="text-2xl sm:text-3xl">Serviços / Outros pedidos</h2>
            <span className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
              Sob consulta
            </span>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {servicesAndOthers.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-24"><h2 className="text-2xl sm:text-3xl">Merchandising e acessórios</h2><p className="mt-4 mb-8 text-muted-foreground">Alguns exemplos de artigos para personalizar, sob consulta.</p><CatalogExamples limit={4}/></section>
        <section className="mt-24 overflow-hidden brand-shop-cta rounded-md bg-surface/50 px-6 py-14 sm:px-12">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="label-eyebrow">Clubes e equipas</span>
              <h2 className="mt-4 text-[1.8rem] leading-[1] sm:text-4xl">
                Um pedido para toda a equipa
              </h2>
              <p className="mt-4 text-sm text-muted-foreground sm:text-base">
                Falamos contigo para preparar a proposta gráfica do teu clube, claque ou grupo de
                atletas.
              </p>
            </div>
            <SportLink to="/contactos" size="lg" variant="primary">
              Falar com a VinilArt
            </SportLink>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
