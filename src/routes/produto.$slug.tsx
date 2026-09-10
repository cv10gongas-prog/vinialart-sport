import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Clock, Package, Truck, CheckCircle } from "lucide-react";
import { PageShell } from "@/components/sport/PageShell";
import { SportButton, SportLink } from "@/components/sport/SportButton";
import { ProductCard } from "@/components/sport/ProductCard";
import { products } from "@/lib/sport-data";
import { useCart } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  component: Produto,
  head: ({ params, loaderData }) => {
    const name = loaderData?.product.name ?? "Produto";
    const description =
      loaderData?.product.description ??
      `${name} — personalização VinilArt Sport com as tuas imagens, cores, nome e número.`;
    return {
      meta: [
        { title: `${name} — VinilArt Sport` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} — VinilArt Sport` },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/produto/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/produto/${params.slug}` }],
    };
  },
});

function Produto() {
  const { product } = Route.useLoaderData();
  const [size, setSize] = useState<string>(product.variants?.[2] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  function handleAddToCart() {
    addItem(product.slug, product.name, {
      quantity: qty,
      variant: size ? size : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <nav
          aria-label="Localização"
          className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground"
        >
          <Link to="/" className="hover:text-cyan">
            Início
          </Link>{" "}
          /{" "}
          <Link to="/loja" className="hover:text-cyan">
            Loja
          </Link>{" "}
          / <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2">
        {/* Galeria */}
        <div>
          <div className="grain overflow-hidden border border-border bg-surface">
            <img
              src={product.image}
              alt={product.name}
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3" role="list" aria-label="Mais imagens">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                role="listitem"
                className={cn(
                  "aspect-square overflow-hidden border bg-surface",
                  i === 0 ? "border-magenta" : "border-border",
                )}
              >
                <img
                  src={product.image}
                  alt={`${product.name} — vista ${i + 1}`}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover opacity-80"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Detalhes */}
        <div>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Características">
            {product.badges.map((b) => (
              <span
                key={b}
                role="listitem"
                className="border border-cyan px-2 py-1 font-display text-[0.6rem] uppercase tracking-[0.12em] text-cyan"
              >
                {b}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl leading-[0.95] sm:text-4xl">{product.name}</h1>
          <p className="mt-3 font-display text-sm uppercase tracking-[0.14em] text-muted-foreground">
            Preço sob consulta
          </p>

          <p className="mt-6 text-sm text-muted-foreground">{product.description}</p>

          {product.variants && product.variants.length > 0 && (
            <div className="mt-8">
              <p
                id="size-label"
                className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground"
              >
                Tamanho
              </p>
              <div
                className="mt-2 flex flex-wrap gap-2"
                role="group"
                aria-labelledby="size-label"
              >
                {product.variants.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={size === s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "h-10 w-12 border text-xs uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan",
                      size === s
                        ? "border-magenta bg-magenta text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-cyan",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p
              id="qty-label"
              className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground"
            >
              Quantidade
            </p>
            <div
              className="mt-2 inline-flex items-center border border-border"
              role="group"
              aria-labelledby="qty-label"
            >
              <button
                type="button"
                aria-label="Diminuir quantidade"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="grid h-10 w-10 place-items-center text-muted-foreground transition-colors hover:text-cyan disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                −
              </button>
              <span className="w-12 text-center font-display text-sm" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                aria-label="Aumentar quantidade"
                onClick={() => setQty((q) => q + 1)}
                className="grid h-10 w-10 place-items-center text-muted-foreground transition-colors hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {product.isCustomizable && (
              <SportLink to="/personalizar" size="lg">
                Personalizar este produto
              </SportLink>
            )}
            <SportButton
              variant="outline"
              shape="square"
              size="lg"
              onClick={handleAddToCart}
              className={cn(
                added && "border-green-500 text-green-400",
              )}
            >
              {added ? (
                <>
                  <CheckCircle className="h-4 w-4" aria-hidden="true" /> Adicionado
                </>
              ) : (
                "Adicionar ao carrinho"
              )}
            </SportButton>
          </div>

          {!product.isCustomizable && (
            <div className="mt-4">
              <SportLink
                to="/contactos"
                variant="outline"
                shape="square"
                size="sm"
              >
                Pedir orçamento por contacto
              </SportLink>
            </div>
          )}

          <div className="mt-10 grid gap-3 border-t border-border pt-6 text-sm sm:grid-cols-3">
            <p className="flex items-start gap-2 text-muted-foreground">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
              Prazo de produção a confirmar
            </p>
            <p className="flex items-start gap-2 text-muted-foreground">
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-magenta" aria-hidden="true" />
              Produção unitária ou por equipa
            </p>
            <p className="flex items-start gap-2 text-muted-foreground">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-yellow" aria-hidden="true" />
              Condições de envio a definir
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl sm:text-3xl">Também podes gostar</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
