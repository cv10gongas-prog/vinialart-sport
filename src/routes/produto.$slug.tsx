import {
  useEffect,
  useState,
} from "react";

import {
  createFileRoute,
  Link,
  notFound,
} from "@tanstack/react-router";

import {
  CheckCircle,
  ShoppingBag,
  Upload,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

import { PageShell } from "@/components/sport/PageShell";
import { ProductCard } from "@/components/sport/ProductCard";

import { products } from "@/lib/sport-data";
import { useCart } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

import { ServiceQuoteForm } from "@/components/sport/ServiceQuoteForm";

export const Route = createFileRoute(
  "/produto/$slug",
)({
  loader: ({ params }) => {
    const product = products.find(
      (item) => item.slug === params.slug,
    );

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
        {
          title: `${name} — VinilArt Sport`,
        },
        {
          name: "description",
          content: description,
        },
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
  }, [product.slug]);

  const related = products
    .filter(
      (item) => item.slug !== product.slug && (item.category === product.category || item.isCustomizable),
    )
    .slice(0, 3);

  const isService = product.customizationMode === "service";

  function addWithoutCustomization() {
    addItem(product.slug, product.name, {
      quantity,
    });

    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  return (
    <PageShell>
      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <nav className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
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

      <section
        className={cn(
          "mx-auto max-w-7xl px-4 py-8 sm:px-6",
          isService ? "max-w-4xl" : "grid gap-12 lg:grid-cols-2",
        )}
      >
        {/* Lado Esquerdo: Imagem de Produto */}
        {!isService && (
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden border border-border bg-black/90">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    aria-label={`Ver foto ${index + 1}`}
                    onClick={() => setSelectedImage(image)}
                    className={cn(
                      "aspect-square overflow-hidden border bg-black transition-all",
                      selectedImage === image
                        ? "border-cyan ring-1 ring-cyan"
                        : "border-border opacity-70 hover:opacity-100",
                    )}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lado Direito: Detalhes & Ações Comerciais */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge) => (
                <span
                  key={badge}
                  className="bg-cyan px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-black"
                >
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="mt-4 font-display text-3xl font-black uppercase sm:text-5xl leading-tight">
              {product.name}
            </h1>

            <p className="mt-2 font-mono text-sm uppercase tracking-widest text-cyan font-bold">
              {product.priceLabel}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {isService ? (
              <div className="mt-8">
                <ServiceQuoteForm
                  productId={product.slug}
                  productName={product.name}
                  serviceType={product.slug === "estampagem" ? "estampagem" : "impressao"}
                />
              </div>
            ) : product.isCustomizable ? (
              /* OPÇÕES CLARAS DE PERSONALIZAÇÃO ACIMA DA DOBRA */
              <div className="mt-8 border-2 border-border bg-surface p-6">
                <span className="font-mono text-xs uppercase tracking-widest text-cyan font-bold">
                  Personalização Online
                </span>
                <h3 className="mt-1 font-display text-xl font-bold uppercase text-foreground">
                  Já tens o design pronto?
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Escolhe como queres avançar com a personalização deste artigo:
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {/* FLUXO A: TENHO O DESIGN */}
                  <Link
                    to="/personalizar"
                    search={{ produto: product.slug, modo: "design" }}
                    className="flex flex-col justify-between border-2 border-cyan/70 bg-background/80 p-4 transition-all hover:border-cyan hover:shadow-lg hover:shadow-cyan/5"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-cyan">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Tenho o Design</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Carrega o teu ficheiro pronto e posiciona-o no produto.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between font-display text-xs uppercase text-cyan font-bold">
                      <span>Começar</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>

                  {/* FLUXO B: QUERO AJUDA */}
                  <Link
                    to="/personalizar"
                    search={{ produto: product.slug, modo: "ajuda" }}
                    className="flex flex-col justify-between border-2 border-magenta/70 bg-background/80 p-4 transition-all hover:border-magenta hover:shadow-lg hover:shadow-magenta/5"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-magenta">
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>Quero Ajuda</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Envia a tua ideia. A equipa da VinilArt trata da criação.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between font-display text-xs uppercase text-magenta font-bold">
                      <span>Pedir Apoio</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          {/* Quantidade & Compra Direta */}
          {!isService && (
            <div className="mt-8 border-t border-border/80 pt-6">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Quantidade:
                </span>
                <div className="inline-flex items-center border border-border bg-surface">
                  <button
                    type="button"
                    onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                    className="grid h-10 w-10 place-items-center hover:text-cyan"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-mono text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((v) => v + 1)}
                    className="grid h-10 w-10 place-items-center hover:text-cyan"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={addWithoutCustomization}
                  className={cn(
                    "flex h-12 w-full items-center justify-center gap-2 border border-border bg-surface font-display text-xs uppercase tracking-wider transition-all hover:border-cyan hover:text-cyan",
                    added && "border-green-500 text-green-400",
                  )}
                >
                  {added ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Adicionado ao Pedido</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>Adicionar sem personalizar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Outros Artigos */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 border-t border-border/60">
        <h2 className="font-display text-2xl font-black uppercase">
          Outros Artigos na Loja
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}