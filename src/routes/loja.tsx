import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/sport/PageShell";
import { ProductCard } from "@/components/sport/ProductCard";
import { products } from "@/lib/sport-data";
import { Sparkles, FileText, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/loja")({
  component: Loja,
  head: () => ({
    meta: [
      { title: "Loja Oficial — VinilArt Sport" },
      {
        name: "description",
        content:
          "Explora a loja VinilArt Sport: caneleiras personalizadas, equipamentos, bandeiras, artigos para adeptos, estampagem e impressão gráfica.",
      },
    ],
  }),
});

function Loja() {
  const customizableProducts = products.filter(
    (p) => p.isCustomizable && p.customizationMode === "product",
  );

  const otherProducts = products.filter(
    (p) => !p.isCustomizable || p.customizationMode !== "product",
  );

  return (
    <PageShell>
      {/* Loja Hero Header */}
      <section className="grain relative border-b border-border bg-tech-grid py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="bg-magenta px-3 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-widest text-white">
            Catálogo Oficial
          </span>
          <h1 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl">
            Loja VinilArt Sport
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Equipamentos e caneleiras à tua medida, artigos para adeptos, estampagem e impressão gráfica desportiva.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-16">
        {/* SECÇÃO 1: PRODUTOS PERSONALIZÁVEIS */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan" />
                <span className="font-mono text-xs uppercase tracking-widest text-cyan font-bold">
                  Personalização Online
                </span>
              </div>
              <h2 className="mt-1 font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">
                Produtos Personalizáveis
              </h2>
            </div>
            <p className="max-w-md text-xs text-muted-foreground">
              Carrega o teu ficheiro pronto para pré-visualizar no produto ou solicita apoio à nossa equipa.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {customizableProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* SECÇÃO 2: OUTROS PEDIDOS & SERVIÇOS */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-yellow" />
                <span className="font-mono text-xs uppercase tracking-widest text-yellow font-bold">
                  Serviços & Merchandising
                </span>
              </div>
              <h2 className="mt-1 font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">
                Outros Pedidos
              </h2>
            </div>
            <p className="max-w-md text-xs text-muted-foreground">
              Pedidos à medida para clubes, adeptos e eventos desportivos com envio de ficheiro e orçamento sob medida.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* Banner Pedido Especial */}
        <section className="card-sport flex flex-col items-start justify-between gap-6 border-2 border-border bg-surface p-8 sm:flex-row sm:items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-cyan font-bold">
              Tens um projeto específico?
            </span>
            <h3 className="mt-2 font-display text-xl sm:text-2xl font-black uppercase text-foreground">
              Equipamento para a tua equipa ou clube desportivo
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xl">
              Trabalhamos com atletas individuais, claques e clubes desportivos com propostas gráficas personalizadas.
            </p>
          </div>
          <Link
            to="/contactos"
            className="inline-flex items-center gap-2 border border-cyan bg-cyan px-6 py-3 font-display text-xs uppercase tracking-wider text-black font-bold hover:bg-cyan/90 transition-colors"
          >
            <span>Falar com a VinilArt</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </PageShell>
  );
}