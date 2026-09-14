import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import { PageShell } from "@/components/sport/PageShell";
import { TeamClubBanner } from "@/components/sport/TeamClubBanner";

import {
  products,
  type Product,
} from "@/lib/sport-data";

import { catalogExamples } from "@/lib/catalog-examples";

export const Route = createFileRoute("/loja")({
  component: Loja,
  head: () => ({
    meta: [
      {
        title: "Loja Oficial — VinilArt Sport",
      },
      {
        name: "description",
        content:
          "Caneleiras, equipamentos, estampagem, acessórios e artigos desportivos personalizáveis pela VinilArt Sport.",
      },
      {
        property: "og:title",
        content: "Loja Oficial — VinilArt Sport",
      },
      {
        property: "og:description",
        content:
          "Produtos personalizáveis e serviços gráficos desportivos da VinilArt Sport.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
});

const realPhotoSlugs = new Set([
  "caneleiras-personalizadas",
  "equipamento-personalizado",
  "estampagem",
  "artigos-adeptos",
]);

function productPrice(product: Product) {
  return product.slug === "caneleiras-personalizadas"
    ? "Desde 19,90€"
    : "Sob orçamento";
}

function ProductRouteLink({
  product,
  children,
  className,
}: {
  product: Product;
  children: React.ReactNode;
  className?: string;
}) {
  if (product.customizationMode === "catalog") {
    return (
      <Link
        to="/adeptos"
        search={{
          artigo: undefined,
          cartItem: undefined,
        }}
        className={className}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      to="/produto/$slug"
      params={{
        slug: product.slug,
      }}
      search={{
        cartItem: undefined,
        modo: undefined,
      }}
      className={className}
    >
      {children}
    </Link>
  );
}

function UniformProductCard({
  title,
  category,
  priceLabel,
  description,
  image,
  isPhoto,
  actionLabel,
  linkProps,
  isExternalLink = false,
}: {
  title: string;
  category: string;
  priceLabel?: string;
  description?: string;
  image: string;
  isPhoto?: boolean;
  actionLabel: string;
  linkProps: any;
  isExternalLink?: boolean;
}) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isExternalLink) {
      return (
        <a {...linkProps} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111722] outline-none transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-cyan-400">
          {children}
        </a>
      );
    }
    return (
      <Link {...linkProps} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111722] outline-none transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-cyan-400">
        {children}
      </Link>
    );
  };

  return (
    <CardWrapper>
      <article className="flex h-full flex-col">
        {/* Square 1:1 Media Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#0a0e16] p-4 sm:p-5 flex items-center justify-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(0,200,255,0.08),transparent_65%)]" />

          <img
            src={image}
            alt={title}
            loading="lazy"
            className={`relative z-10 max-h-full max-w-full w-auto h-auto transition-transform duration-500 group-hover:scale-105 ${
              isPhoto ? "object-cover h-full w-full" : "object-contain"
            }`}
          />

          {priceLabel && (
            <span className="absolute right-3 top-3 z-20 rounded-full border border-white/10 bg-black/75 px-2.5 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-wider text-zinc-200 backdrop-blur-md">
              {priceLabel}
            </span>
          )}
        </div>

        {/* Content Box */}
        <div className="flex flex-1 flex-col justify-between border-t border-white/[0.06] p-4 sm:p-5">
          <div>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-cyan-400">
              {category}
            </span>

            <h3 className="mt-1.5 font-display text-lg uppercase leading-tight tracking-wide text-white transition-colors group-hover:text-cyan-300 sm:text-xl">
              {title}
            </h3>

            {description && (
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                {description}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3">
            <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-cyan-300">
              {actionLabel}
            </span>

            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-all duration-300 group-hover:border-cyan-400 group-hover:bg-cyan-400 group-hover:text-black">
              <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </article>
    </CardWrapper>
  );
}

function MainProductCard({
  product,
}: {
  product: Product;
}) {
  const image = product.catalogImage ?? product.image;
  const isRealPhoto = realPhotoSlugs.has(product.slug);

  return (
    <UniformProductCard
      title={product.name}
      category={product.category}
      priceLabel={productPrice(product)}
      description={product.description}
      image={image}
      isPhoto={isRealPhoto}
      actionLabel="Personalizar"
      linkProps={{
        to: "/produto/$slug",
        params: { slug: product.slug },
        search: { cartItem: undefined, modo: undefined },
      }}
    />
  );
}

function ServiceCard({
  product,
  visual,
}: {
  product: Product;
  visual: "photo" | "graphic";
}) {
  const isCatalogMode = product.customizationMode === "catalog";
  const image =
    visual === "photo" && product.catalogImage
      ? product.catalogImage
      : product.image ?? "/catalog/editor/estampagem.svg";

  return (
    <UniformProductCard
      title={product.name}
      category={product.category}
      priceLabel="Sob consulta"
      description={product.description}
      image={image}
      isPhoto={visual === "photo" && !!product.catalogImage}
      actionLabel={isCatalogMode ? "Ver artigos" : "Pedir orçamento"}
      linkProps={
        isCatalogMode
          ? {
              to: "/adeptos",
              search: { artigo: undefined, cartItem: undefined },
            }
          : {
              to: "/produto/$slug",
              params: { slug: product.slug },
              search: { cartItem: undefined, modo: undefined },
            }
      }
    />
  );
}

function CatalogCard({
  example,
}: {
  example: (typeof catalogExamples)[number];
}) {
  const isPhoto = example.kind === "Fotografia de trabalho";

  return (
    <UniformProductCard
      title={example.name}
      category={isPhoto ? "Exemplo real" : "Base para personalização"}
      priceLabel="Sob consulta"
      image={example.image}
      isPhoto={isPhoto}
      actionLabel="Personalizar"
      linkProps={{
        to: "/produto/$slug",
        params: { slug: `${example.id}-personalizado` },
        search: { modo: undefined, cartItem: undefined },
      }}
    />
  );
}

function Loja() {
  const primarySlugs = [
    "caneleiras-personalizadas",
    "equipamento-personalizado",
    "bandeira-personalizada",
    "estampagem",
  ];

  const primaryProducts = primarySlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  return (
    <PageShell className="bg-[#090c11] text-white">
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0d1119]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[8%] top-[-180px] h-[520px] w-[150px] rotate-[30deg] bg-cyan-400/[0.08]" />
          <div className="absolute right-[2%] top-[-180px] h-[520px] w-[105px] rotate-[30deg] bg-fuchsia-500/[0.08]" />
          <div className="absolute right-[-1%] top-[-180px] h-[520px] w-[55px] rotate-[30deg] bg-yellow-400/[0.08]" />

          <div className="absolute -left-44 bottom-[-260px] h-[440px] w-[440px] rounded-full bg-cyan-400/[0.07] blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <span className="font-mono text-[0.67rem] uppercase tracking-[0.22em] text-cyan-400">
            Loja // VinilArt Sport
          </span>

          <h1 className="mt-4 max-w-5xl font-display text-4xl uppercase leading-[0.9] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Personaliza
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-300 bg-clip-text text-transparent">
              o teu jogo.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            Escolhe o produto, carrega o teu design e prepara a tua
            personalização diretamente no site — ou pede ajuda à equipa
            VinilArt.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <a
              href="#destaques"
              className="rounded-full border border-cyan-400/30 bg-cyan-400/[0.08] px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-cyan-300 transition hover:bg-cyan-400 hover:text-black"
            >
              Produtos Principais
            </a>

            <a
              href="#mais-formas"
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-zinc-300 transition hover:border-white/25 hover:bg-white/[0.07]"
            >
              Mais Formas de Personalizar
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-5 py-16 sm:px-8 lg:py-24">
        {/* SECÇÃO 1: 4 PRODUTOS PRINCIPAIS */}
        <section
          id="destaques"
          className="scroll-mt-28"
        >
          <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-cyan-400">
                01 // Produtos em destaque
              </span>

              <h2 className="mt-2 font-display text-3xl uppercase leading-none tracking-tight text-white sm:text-5xl">
                Produtos
                <br />
                <span className="text-zinc-500">
                  principais.
                </span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-zinc-500">
              Personaliza diretamente no site ou pede orçamento para caneleiras,
              equipamento, bandeira e estampagem.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {primaryProducts.map((product) => (
              <MainProductCard
                key={product.slug}
                product={product}
              />
            ))}
          </div>
        </section>

        {/* SECÇÃO 2: MAIS FORMAS DE PERSONALIZAR (RESTANTES ARTIGOS) */}
        <section
          id="mais-formas"
          className="scroll-mt-28"
        >
          <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-yellow-300">
                02 // Catálogo alargado
              </span>

              <h2 className="mt-2 font-display text-3xl uppercase leading-none tracking-tight text-white sm:text-5xl">
                Mais formas
                <br />
                <span className="text-zinc-500">
                  de personalizar.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-zinc-500">
              Garrafas, bonés, sacos, mochilas, T-shirts, braçadeiras, calções
              e outros artigos disponíveis para personalização e pedidos de equipa.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catalogExamples.map((example) => (
              <CatalogCard
                key={example.id}
                example={example}
              />
            ))}
          </div>
        </section>

        <section className="pt-2">
          <TeamClubBanner />
        </section>
      </div>
    </PageShell>
  );
}
