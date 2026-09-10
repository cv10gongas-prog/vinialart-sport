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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const activeImage = selectedImage ?? product.image;

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
          <div className="grain relative overflow-hidden border border-border bg-surface">
            <img
              src={activeImage}
              alt={product.name}
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover transition-all duration-300"
            />
            <div className="pointer-events-none absolute bottom-3 right-3">
              <span className="skew-tag border border-border bg-background/80 px-2 py-0.5 font-mono text-[0.6rem] text-muted-foreground backdrop-blur-sm">
                DETALHE TÉCNICO // 100% REAL
              </span>
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3" role="list" aria-label="Galeria de imagens">
              {gallery.map((img, i) => {
                const isCurrent = activeImage === img;
                return (
                  <button
                    key={i}
                    type="button"
                    role="listitem"
                    aria-label={`Ver foto ${i + 1}`}
                    aria-pressed={isCurrent}
                    onClick={() => setSelectedImage(img)}
                    className={cn(
                      "aspect-square overflow-hidden border bg-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan",
                      isCurrent
                        ? "border-cyan ring-1 ring-cyan scale-[1.02]"
                        : "border-border opacity-70 hover:opacity-100 hover:border-cyan/50",
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.name} — detalhe ${i + 1}`}
                      loading="lazy"
                      width={1024}
                      height={1024}
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detalhes */}
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2" role="list" aria-label="Características">
            {product.badges.map((b) => (
              <span
                key={b}
                role="listitem"
                className="skew-tag border border-cyan bg-cyan/10 px-2.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-cyan"
              >
                {b}
              </span>
            ))}
            {product.isCustomizable && (
              <span className="skew-tag border border-magenta bg-magenta px-2.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-white shadow-glow-magenta">
                ⚡ ESTÚDIO 2D DISPONÍVEL
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl text-foreground">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-3">
            <span className="font-mono text-sm uppercase tracking-widest text-cyan font-bold">
              {product.priceLabel}
            </span>
            <span className="font-mono text-xs text-muted-foreground/60">
              // Encomenda unitária ou de clube
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Funcionalidades de Personalização */}
          {product.isCustomizable ? (
            <div className="mt-6 rounded border border-border/80 bg-surface p-4 text-xs">
              <p className="font-display text-[0.7rem] uppercase tracking-wider text-foreground">
                Funcionalidades do Personalizador Online
              </p>
              <div className="mt-2.5 grid grid-cols-2 gap-3 font-mono text-[0.65rem] text-muted-foreground">
                <div>
                  <span className="text-white/60">DOIS LADOS:</span>
                  <p className="text-foreground">Personalização Esquerda / Direita</p>
                </div>
                <div>
                  <span className="text-white/60">IMAGENS:</span>
                  <p className="text-foreground">Upload das Tuas Fotos & Logos</p>
                </div>
                <div>
                  <span className="text-white/60">TEXTO:</span>
                  <p className="text-foreground">Nome e Número Editáveis</p>
                </div>
                <div>
                  <span className="text-white/60">FERRAMENTAS:</span>
                  <p className="text-foreground">Remoção de Fundo & Ajuste</p>
                </div>
                <div>
                  <span className="text-white/60">VISUALIZAÇÃO:</span>
                  <p className="text-foreground">Pré-visualização em Tempo Real</p>
                </div>
                <div>
                  <span className="text-white/60">PROCESSO:</span>
                  <p className="text-foreground">Guardar e Editar Personalização</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded border border-border/80 bg-surface p-4 text-xs">
              <p className="font-display text-[0.7rem] uppercase tracking-wider text-foreground">
                Personalização à Tua Medida
              </p>
              <div className="mt-2.5 grid grid-cols-2 gap-3 font-mono text-[0.65rem] text-muted-foreground">
                <div>
                  <span className="text-white/60">IDENTIDADE:</span>
                  <p className="text-foreground">Cores e Emblemas da Equipa</p>
                </div>
                <div>
                  <span className="text-white/60">ELEMENTOS:</span>
                  <p className="text-foreground">Nomes, Números e Grafismos</p>
                </div>
                <div>
                  <span className="text-white/60">PRODUÇÃO:</span>
                  <p className="text-foreground">Individual ou Equipa Completa</p>
                </div>
                <div>
                  <span className="text-white/60">ORÇAMENTO:</span>
                  <p className="text-foreground">Acompanhamento e Proposta Rápida</p>
                </div>
              </div>
            </div>
          )}

          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <p
                id="size-label"
                className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground"
              >
                Tamanho Sugerido
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
                      "h-10 w-12 border font-display text-xs uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan",
                      size === s
                        ? "border-magenta bg-magenta text-white shadow-glow-magenta"
                        : "border-border text-muted-foreground hover:border-cyan hover:text-foreground",
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
              className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground"
            >
              Quantidade
            </p>
            <div
              className="mt-2 inline-flex items-center border border-border bg-surface"
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
              <span className="w-12 text-center font-mono text-sm font-bold" aria-live="polite">
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

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {product.isCustomizable ? (
              <>
                <SportLink
                  to="/personalizar"
                  size="lg"
                  variant="primary"
                  shape="slant"
                  className="shadow-glow-magenta text-sm font-black"
                >
                  Personalizar no Estúdio 2D
                </SportLink>
                <SportButton
                  variant="outline"
                  shape="square"
                  size="lg"
                  onClick={handleAddToCart}
                  className={cn(
                    "hover:border-cyan hover:text-cyan",
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
              </>
            ) : (
              <>
                <SportButton
                  variant="primary"
                  shape="slant"
                  size="lg"
                  onClick={handleAddToCart}
                  className={cn(
                    "shadow-glow-magenta",
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
                <SportLink
                  to="/contactos"
                  variant="outline"
                  shape="square"
                  size="lg"
                >
                  Pedir Orçamento de Equipa
                </SportLink>
              </>
            )}
          </div>

          <div className="mt-10 grid gap-3 border-t border-border pt-6 text-sm sm:grid-cols-3">
            <p className="flex items-start gap-2 text-muted-foreground text-xs">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
              Prazo sob confirmação
            </p>
            <p className="flex items-start gap-2 text-muted-foreground text-xs">
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-magenta" aria-hidden="true" />
              Individual ou de equipa
            </p>
            <p className="flex items-start gap-2 text-muted-foreground text-xs">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-yellow" aria-hidden="true" />
              Envio com acompanhamento
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
