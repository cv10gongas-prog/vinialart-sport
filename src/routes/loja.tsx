import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { PageHero, PageShell } from "@/components/sport/PageShell";
import { ProductCard } from "@/components/sport/ProductCard";
import { categories, products } from "@/lib/sport-data";
import { cn } from "@/lib/utils";

type LojaSearch = { categoria?: string | undefined };

export const Route = createFileRoute("/loja")({
  component: Loja,
  validateSearch: (search: Record<string, unknown>): LojaSearch => ({
    categoria: typeof search["categoria"] === "string" ? search["categoria"] : undefined,
  }),

  head: () => ({
    meta: [
      { title: "Loja — VinilArt Sport" },
      {
        name: "description",
        content:
          "Explora a loja VinilArt Sport: caneleiras, equipamentos, bandeiras, artigos para adeptos, estampagem e impressão personalizados.",
      },
      { property: "og:title", content: "Loja — VinilArt Sport" },
      {
        property: "og:description",
        content: "Artigos desportivos personalizáveis: caneleiras, equipamentos, bandeiras e mais.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/loja" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/loja" }],
  }),
});

const badgeFilters = ["Personalizável", "Novo", "Mais popular"] as const;

function Loja() {
  const { categoria } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | undefined>(categoria);
  const [badge, setBadge] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState("relevancia");

  const list = useMemo(() => {
    let out = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) &&
        (!cat || p.category === cat) &&
        (!badge || p.badges.includes(badge as never)),
    );
    if (sort === "az") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") out = [...out].sort((a, b) => b.name.localeCompare(a.name));
    return out;
  }, [query, cat, badge, sort]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Loja"
        title="Artigos personalizáveis"
        text="Catálogo demonstrativo. Preços e variantes finais a confirmar."
      />

      <div className="mx-auto max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        {/* Filtros */}
        <aside className="mb-8 lg:mb-0">
          <div className="card-sport hover:!translate-y-0 p-5">
            <p className="flex items-center gap-2 font-display text-sm">
              <SlidersHorizontal className="h-4 w-4 text-cyan" /> Filtros
            </p>

            <p className="mt-5 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              Categorias
            </p>
            <div className="mt-2 flex flex-wrap gap-2 lg:flex-col lg:items-start">
              <button
                onClick={() => setCat(undefined)}
                className={cn(
                  "px-3 py-1.5 text-xs uppercase tracking-[0.1em] transition-colors",
                  !cat ? "bg-magenta text-primary-foreground" : "text-muted-foreground hover:text-cyan",
                )}
              >
                Todas
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCat(c.name)}
                  className={cn(
                    "px-3 py-1.5 text-left text-xs uppercase tracking-[0.1em] transition-colors",
                    cat === c.name
                      ? "bg-magenta text-primary-foreground"
                      : "text-muted-foreground hover:text-cyan",
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <p className="mt-6 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              Etiquetas
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {badgeFilters.map((b) => (
                <button
                  key={b}
                  onClick={() => setBadge(badge === b ? undefined : b)}
                  className={cn(
                    "border px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.1em] transition-colors",
                    badge === b
                      ? "border-cyan text-cyan"
                      : "border-border text-muted-foreground hover:border-cyan",
                  )}
                >
                  {b}
                </button>
              ))}
            </div>

            <p className="mt-6 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              Preço
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Filtro de preço disponível quando os preços forem definidos.
            </p>
          </div>
        </aside>

        {/* Grelha */}
        <div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar produtos…"
                className="h-11 w-full border border-input bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-cyan sm:w-72"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 shrink-0 border border-input bg-surface px-3 text-xs uppercase tracking-[0.1em] outline-none focus:border-cyan"
            >
              <option value="relevancia">Relevância</option>
              <option value="az">Nome A–Z</option>
              <option value="za">Nome Z–A</option>
            </select>
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {list.length} artigo{list.length === 1 ? "" : "s"}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>

          {list.length === 0 && (
            <p className="mt-10 text-sm text-muted-foreground">
              Sem resultados para esta combinação de filtros.
            </p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
