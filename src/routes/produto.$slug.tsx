import { useEffect, useState } from "react";

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ShoppingBag, Upload, HelpCircle, ArrowUpRight } from "lucide-react";

import { PageShell } from "@/components/sport/PageShell";
import { ProductCard } from "@/components/sport/ProductCard";
import { SportLink } from "@/components/sport/SportButton";

import { products } from "@/lib/sport-data";
import { useCart } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

import { ServiceQuoteForm } from "@/components/sport/ServiceQuoteForm";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = products.find((item) => item.slug === params.slug);

    if (!product) {
      throw notFound();
    }

    return { product };
  },

  component: Produto,

  head: ({ loaderData }) => {
    const name = loaderData?.product.name ?? "Produto";
    const description = loaderData?.product.description ?? "";

    return {
      meta: [
        { title: `${name} — VinilArt Sport` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} — VinilArt Sport` },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
});

function Produto() {
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const gallery = [product.image, ...(product.gallery ?? [])];
  const [selectedImage, setSelectedImage] = useState(gallery[0]);

  useEffect(() => {
    setSelectedImage(gallery[0]);
    setQuantity(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  const relatedPreferred = products.filter(
    (item) =>
      item.slug !== product.slug &&
      (item.category === product.category || item.isCustomizable),
  );

  // Preenche sempre a grelha (evita colunas vazias) com os restantes artigos.
  const related = [
    ...relatedPreferred,
    ...products.filter(
      (item) =>
        item.slug !== product.slug &&
        !relatedPreferred.some((r) => r.slug === item.slug),
    ),
  ].slice(0, 3);


  const isService = product.customizationMode === "service";

  function addWithoutCustomization() {
    addItem(product.slug, product.name, { quantity });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-[1600px] px-5 pt-10 sm:px-8">
        <nav className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            Início
          </Link>
          <span className="px-2 text-muted-foreground/50">/</span>
          <Link to="/loja" className="transition-colors hover:text-foreground">
            Loja
          </Link>
          <span className="px-2 text-muted-foreground/50">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <section
        className={cn(
          "mx-auto max-w-[1600px] px-5 py-10 sm:px-8 sm:py-14",
          isService
            ? "max-w-3xl"
            : "grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-20",
        )}
      >
        {/* GALERIA GRANDE */}
        {!isService && (
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-3xl bg-studio">
              <img
                src={selectedImage}
                alt={product.name}
                className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
              />
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    aria-label={`Ver imagem ${index + 1}`}
                    onClick={() => setSelectedImage(image)}
                    className={cn(
                      "overflow-hidden rounded-xl bg-studio transition-all duration-300",
                      selectedImage === image
                        ? "ring-2 ring-foreground"
                        : "opacity-60 hover:opacity-100",
                    )}
                  >
                    <img
                      src={image}
                      alt=""
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INFORMAÇÃO & AÇÕES */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="label-eyebrow">{product.category}</span>

          <h1 className="mt-4 text-[2.2rem] leading-[0.92] sm:text-5xl">
            {product.name}
          </h1>

          <p className="mt-5 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Preço sob consulta
          </p>

          <p className="mt-6 max-w-lg text-sm text-muted-foreground sm:text-base">
            {product.description}
          </p>

          {isService ? (
            <div className="mt-10">
              <ServiceQuoteForm
                productId={product.slug}
                productName={product.name}
                serviceType={
                  product.slug === "estampagem" ? "estampagem" : "impressao"
                }
              />
            </div>
          ) : product.isCustomizable ? (
            <div className="mt-10 space-y-3">
              <SportLink
                to="/personalizar"
                search={{ produto: product.slug, modo: "design" }}
                size="lg"
                variant="primary"
                className="w-full"
              >
                <Upload className="h-4 w-4" />
                Tenho o design
              </SportLink>

              <SportLink
                to="/personalizar"
                search={{ produto: product.slug, modo: "ajuda" }}
                size="lg"
                variant="outline"
                className="w-full"
              >
                <HelpCircle className="h-4 w-4" />
                Quero ajuda
              </SportLink>
            </div>
          ) : (
            <div className="mt-10">
              <SportLink
                to="/contactos"
                size="lg"
                variant="primary"
                className="w-full"
              >
                Pedir orçamento
              </SportLink>
            </div>
          )}

          {!isService && (
            <div className="mt-10 border-t border-border pt-8">
              <div className="flex flex-wrap items-center gap-5">
                <span className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Quantidade
                </span>
                <div className="inline-flex items-center rounded-full border border-border">
                  <button
                    type="button"
                    aria-label="Diminuir quantidade"
                    onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                    className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-foreground/5"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Aumentar quantidade"
                    onClick={() => setQuantity((v) => v + 1)}
                    className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-foreground/5"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={addWithoutCustomization}
                className={cn(
                  "mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-foreground/40 hover:bg-foreground/5",
                  added && "border-cyan text-cyan",
                )}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Adicionado ao pedido</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>Adicionar sem personalizar</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8">
        <div className="flex items-end justify-between gap-6 border-t border-border pt-8">
          <h2 className="text-2xl sm:text-3xl">Também na loja</h2>
          <Link
            to="/loja"
            className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Ver tudo</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
