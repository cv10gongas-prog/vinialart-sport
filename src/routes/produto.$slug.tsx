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
  Eye,
  ImagePlus,
  ShoppingBag,
} from "lucide-react";

import { PageShell } from "@/components/sport/PageShell";
import {
  SportButton,
  SportLink,
} from "@/components/sport/SportButton";
import { ProductCard } from "@/components/sport/ProductCard";

import { products } from "@/lib/sport-data";
import { useCart } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/produto/$slug",
)({
  loader: ({ params }) => {
    const product = products.find(
      (item) =>
        item.slug === params.slug,
    );

    if (!product) {
      throw notFound();
    }

    return { product };
  },

  component: Produto,

  head: ({ loaderData }) => {
    const name =
      loaderData?.product.name ??
      "Produto";

    const description =
      loaderData?.product
        .description ?? "";

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
  const { product } =
    Route.useLoaderData();

  const [quantity, setQuantity] =
    useState(1);

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(product.image);

  const [added, setAdded] =
    useState(false);

  const { addItem } = useCart();

  useEffect(() => {
    setSelectedImage(product.image);
    setQuantity(1);
    setAdded(false);
  }, [product.slug, product.image]);

  const gallery =
    product.gallery?.length
      ? product.gallery
      : [product.image];

  const related = products
    .filter(
      (item) =>
        item.slug !== product.slug,
    )
    .slice(0, 4);

  function addWithoutCustomization() {
    addItem(
      product.slug,
      product.name,
      {
        quantity,
      },
    );

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <nav className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
          <Link
            to="/"
            className="hover:text-cyan"
          >
            Início
          </Link>{" "}
          /{" "}
          <Link
            to="/loja"
            className="hover:text-cyan"
          >
            Loja
          </Link>{" "}
          /{" "}
          <span className="text-foreground">
            {product.name}
          </span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2">
        <div>
          <div className="relative overflow-hidden border border-border bg-black">
            <img
              src={selectedImage}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />

            {product.isCustomizable && (
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/80 px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-widest text-cyan backdrop-blur">
                <Eye className="h-3.5 w-3.5" />
                Base de pré-visualização
              </div>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.map(
                (image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    aria-label={`Ver imagem ${index + 1}`}
                    onClick={() =>
                      setSelectedImage(
                        image,
                      )
                    }
                    className={cn(
                      "aspect-square overflow-hidden border bg-black transition-all",
                      selectedImage ===
                        image
                        ? "border-cyan ring-1 ring-cyan"
                        : "border-border opacity-70 hover:opacity-100",
                    )}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ),
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2">
            {product.badges.map(
              (badge) => (
                <span
                  key={badge}
                  className="bg-cyan px-2.5 py-1 font-mono text-[0.58rem] font-bold uppercase tracking-wider text-black"
                >
                  {badge}
                </span>
              ),
            )}
          </div>

          <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
            {product.name}
          </h1>

          <p className="mt-2 font-mono text-sm uppercase tracking-widest text-cyan">
            {product.priceLabel}
          </p>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {product.isCustomizable && (
            <div className="mt-7 border border-border bg-surface p-5">
              <p className="font-display text-sm">
                Personalização online
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <ImagePlus className="mt-0.5 h-4 w-4 shrink-0 text-magenta" />
                  Carrega imagens e
                  logótipos.
                </div>

                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Eye className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                  Vê a pré-visualização
                  diretamente no site.
                </div>
              </div>
            </div>
          )}

          <div className="mt-7">
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
              Quantidade
            </p>

            <div className="mt-2 inline-flex items-center border border-border bg-surface">
              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (value) =>
                      Math.max(
                        1,
                        value - 1,
                      ),
                  )
                }
                className="grid h-10 w-10 place-items-center hover:text-cyan"
              >
                −
              </button>

              <span className="w-12 text-center font-mono text-sm">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (value) =>
                      value + 1,
                  )
                }
                className="grid h-10 w-10 place-items-center hover:text-cyan"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {product.isCustomizable && (
              <SportLink
                to="/personalizar"
                search={{
                  produto:
                    product.slug,
                }}
                size="lg"
                className="w-full"
              >
                Personalizar online
              </SportLink>
            )}

            <SportButton
              type="button"
              variant="outline"
              shape="square"
              size="lg"
              onClick={
                addWithoutCustomization
              }
              className={cn(
                "w-full",
                added &&
                  "border-green-500 text-green-400",
              )}
            >
              {added ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Adicionado
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Adicionar sem
                  personalizar
                </>
              )}
            </SportButton>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Podes guardar uma
            personalização criada no
            editor ou adicionar o artigo
            sem design para explicares o
            pedido posteriormente.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-black sm:text-3xl">
          Outros artigos
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard
              key={item.slug}
              product={item}
            />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
