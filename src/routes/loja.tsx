import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/sport/PageShell";
import { ProductCard } from "@/components/sport/ProductCard";
import { TeamClubBanner } from "@/components/sport/TeamClubBanner";
import { CatalogExamples } from "@/components/sport/CatalogExamples";
import { products } from "@/lib/sport-data";

export const Route = createFileRoute("/loja")({
  component: Loja,
  head: () => ({
    meta: [
      { title: "Loja Oficial — VinilArt Sport" },
      {
        name: "description",
        content:
          "Caneleiras, equipamentos e artigos desportivos personalizáveis com qualidade de impressão profissional e pré-visualização em tempo real.",
      },
      { property: "og:title", content: "Loja Oficial — VinilArt Sport" },
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
    <PageShell className="bg-[#0B0E14] text-foreground">
      {/* Header / Hero */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[#111622] to-[#0B0E14] py-14 sm:py-20 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
            Catálogo Oficial
          </span>
          <h1 className="mt-3 font-display text-3xl sm:text-5xl uppercase tracking-wider text-white">
            Loja VinilArt Sport
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed">
            Produtos de alta performance com personalização gráfica individual ou para toda a equipa.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-16 space-y-20">
        {/* Produtos Personalizáveis */}
        <section>
          <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-5">
            <div>
              <span className="font-mono text-[0.68rem] uppercase tracking-widest text-cyan-400">
                01 // Configurador Online
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl uppercase tracking-wide text-white">
                Produtos Personalizáveis
              </h2>
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              {customizable.length} artigos
            </span>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {customizable.map((product) => (
              <ProductCard key={product.slug} product={product} size="feature" />
            ))}
          </div>
        </section>

        {/* Serviços / Outros Pedidos */}
        <section>
          <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-5">
            <div>
              <span className="font-mono text-[0.68rem] uppercase tracking-widest text-cyan-400">
                02 // Especialidades Gráficas
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl uppercase tracking-wide text-white">
                Serviços & Estampagem
              </h2>
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Sob Consulta
            </span>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesAndOthers.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        {/* Merchandising & Acessórios */}
        <section>
          <div className="border-b border-white/10 pb-5">
            <span className="font-mono text-[0.68rem] uppercase tracking-widest text-cyan-400">
              03 // Merchandising
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl uppercase tracking-wide text-white">
              Acessórios de Adeptos
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Artigos produzidos com gravação sob consulta para claques, sócios e torneios.
            </p>
          </div>
          <div className="mt-8">
            <CatalogExamples limit={7} />
          </div>
        </section>

        {/* Banner Pedido para Toda a Equipa */}
        <section className="pt-4">
          <TeamClubBanner />
        </section>
      </div>
    </PageShell>
  );
}
