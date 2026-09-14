import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Package,
  Sparkles,
} from "lucide-react";

import { PageShell } from "@/components/sport/PageShell";
import { TeamClubBanner } from "@/components/sport/TeamClubBanner";
import { catalogExamples } from "@/lib/catalog-examples";
import { products, type Product } from "@/lib/sport-data";

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

const PRIMARY_SLUGS = [
  "caneleiras-personalizadas",
  "equipamento-personalizado",
  "bandeira-personalizada",
  "estampagem",
];

const REAL_PHOTO_SLUGS = new Set([
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

function getProductImage(product: Product) {
  return product.catalogImage ?? product.image;
}

function HeroProductTile({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const image = getProductImage(product);
  const isPhoto = REAL_PHOTO_SLUGS.has(product.slug);

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
      className={[
        "group relative overflow-hidden bg-[#0c1118] outline-none",
        "border border-white/[0.08]",
        "transition-all duration-500",
        "hover:border-cyan-400/35",
        "focus-visible:ring-2 focus-visible:ring-cyan-400",
        index === 0
          ? "col-span-2 row-span-2 rounded-[1.65rem]"
          : "rounded-[1.25rem]",
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(34,211,238,0.10),transparent_58%)]" />

      <img
        src={image}
        alt={product.name}
        className={[
          "relative z-10 h-full w-full transition-transform duration-700",
          "group-hover:scale-[1.035]",
          isPhoto
            ? "object-cover"
            : index === 0
              ? "object-contain p-8"
              : "object-contain p-5",
        ].join(" ")}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[55%] bg-gradient-to-t from-black via-black/45 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-30 p-4 sm:p-5">
        <span className="font-mono text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-cyan-300">
          {index === 0
            ? "Mais procurado"
            : product.category}
        </span>

        <div className="mt-1 flex items-end justify-between gap-3">
          <h3
            className={[
              "font-display uppercase leading-none text-white",
              index === 0
                ? "text-2xl sm:text-3xl"
                : "text-base sm:text-lg",
            ].join(" ")}
          >
            {product.name}
          </h3>

          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:translate-x-1">
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function MainProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const image = getProductImage(product);
  const isPhoto = REAL_PHOTO_SLUGS.has(product.slug);

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
      className="group flex h-full flex-col overflow-hidden border-b border-white/[0.09] bg-transparent pb-6 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-[#0c1117]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(34,211,238,0.09),transparent_62%)]" />

        <div className="absolute left-4 top-4 z-20 font-mono text-[0.62rem] font-semibold tracking-[0.12em] text-zinc-500">
          0{index + 1}
        </div>

        <div className="absolute right-3 top-3 z-20 rounded-full border border-white/[0.09] bg-black/75 px-3 py-1.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur">
          {productPrice(product)}
        </div>

        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className={[
            "relative z-10 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.035]",
            isPhoto
              ? "object-cover"
              : "object-contain p-5 sm:p-7",
          ].join(" ")}
        />
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex-1">
          <span className="font-mono text-[0.61rem] font-semibold uppercase tracking-[0.17em] text-cyan-400">
            {product.category}
          </span>

          <h3 className="mt-2 font-display text-[1.45rem] uppercase leading-none text-white transition-colors group-hover:text-cyan-200 sm:text-[1.65rem]">
            {product.name}
          </h3>

          <p className="mt-3 line-clamp-2 max-w-sm text-[0.84rem] leading-6 text-zinc-500">
            {product.description}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-2 font-mono text-[0.64rem] font-bold uppercase tracking-[0.13em] text-white">
          Personalizar

          <ArrowRight
            size={13}
            className="text-cyan-400 transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

function CatalogCard({
  example,
}: {
  example: (typeof catalogExamples)[number];
}) {
  const isPhoto =
    example.kind === "Fotografia de trabalho";

  return (
    <Link
      to="/produto/$slug"
      params={{
        slug: `${example.id}-personalizado`,
      }}
      search={{
        modo: undefined,
        cartItem: undefined,
      }}
      className="group flex min-w-0 flex-col outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.15rem] border border-white/[0.07] bg-[#0d1218] transition-all duration-300 group-hover:border-cyan-400/25 group-hover:bg-[#101720]">
        <img
          src={example.image}
          alt={example.name}
          loading="lazy"
          className={[
            "h-full w-full transition-transform duration-500 group-hover:scale-[1.035]",
            isPhoto
              ? "object-cover"
              : "object-contain p-4 sm:p-5",
          ].join(" ")}
        />

        <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.1] bg-black/70 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <ArrowRight size={13} />
        </div>
      </div>

      <div className="px-1 pt-3">
        <span className="font-mono text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-zinc-600">
          {isPhoto
            ? "Exemplo real"
            : "Personalizável"}
        </span>

        <h3 className="mt-1 font-display text-base uppercase leading-none text-white transition-colors group-hover:text-cyan-200 sm:text-lg">
          {example.name}
        </h3>

        <span className="mt-2 block font-mono text-[0.58rem] uppercase tracking-[0.12em] text-zinc-500">
          Sob consulta
        </span>
      </div>
    </Link>
  );
}

function Loja() {
  const primaryProducts = PRIMARY_SLUGS
    .map((slug) =>
      products.find(
        (product) => product.slug === slug,
      ),
    )
    .filter(
      (product): product is Product =>
        Boolean(product),
    );

  return (
    <PageShell className="bg-[#080b0f] text-white">
      {/* HERO / STOREFRONT */}
      <section className="border-b border-white/[0.08] bg-[#090d12]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            {/* LEFT */}
            <div className="max-w-xl">
              <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-cyan-400">
                VinilArt Sport // Loja
              </span>

              <h1 className="mt-5 font-display text-[3.2rem] uppercase leading-[0.85] tracking-tight text-white sm:text-6xl lg:text-[5.2rem]">
                Tudo para
                <br />

                <span className="text-zinc-500">
                  jogar à tua maneira.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-[0.96rem] leading-7 text-zinc-400">
                Personaliza equipamento e acessórios
                para ti, para a tua equipa ou para o
                teu clube.
              </p>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-y border-white/[0.07] py-5">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Check
                    size={14}
                    className="text-cyan-400"
                  />

                  Personalização online
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Check
                    size={14}
                    className="text-cyan-400"
                  />

                  Apoio VinilArt
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Check
                    size={14}
                    className="text-cyan-400"
                  />

                  Clubes e equipas
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#produtos"
                  className="inline-flex min-h-12 items-center gap-3 rounded-full bg-cyan-400 px-5 font-mono text-[0.66rem] font-bold uppercase tracking-[0.13em] text-black transition hover:bg-cyan-300"
                >
                  Explorar produtos
                  <ChevronDown size={14} />
                </a>

                <Link
                  to="/contactos"
                  className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/10 px-5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-zinc-300 transition hover:border-white/25 hover:text-white"
                >
                  Falar connosco
                </Link>
              </div>
            </div>

            {/* RIGHT PRODUCT MOSAIC */}
            <div className="grid aspect-[1.05/1] grid-cols-4 grid-rows-4 gap-2.5 sm:gap-3">
              {primaryProducts.map(
                (product, index) => {
                  if (index === 0) {
                    return (
                      <div
                        key={product.slug}
                        className="col-span-2 row-span-4"
                      >
                        <HeroProductTile
                          product={product}
                          index={index}
                        />
                      </div>
                    );
                  }

                  if (index === 1) {
                    return (
                      <div
                        key={product.slug}
                        className="col-span-2 row-span-2"
                      >
                        <HeroProductTile
                          product={product}
                          index={index}
                        />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={product.slug}
                      className="col-span-1 row-span-2"
                    >
                      <HeroProductTile
                        product={product}
                        index={index}
                      />
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SMALL CATEGORY BAR */}
      <div className="border-b border-white/[0.07] bg-[#0b0f14]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-5 py-3 sm:px-8">
          <a
            href="#produtos"
            className="shrink-0 rounded-full bg-white px-4 py-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-black"
          >
            Principais
          </a>

          <a
            href="#catalogo"
            className="shrink-0 rounded-full border border-white/[0.08] px-4 py-2 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-zinc-400 transition hover:border-white/20 hover:text-white"
          >
            Outros artigos
          </a>

          <Link
            to="/contactos"
            className="shrink-0 rounded-full border border-white/[0.08] px-4 py-2 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-zinc-400 transition hover:border-white/20 hover:text-white"
          >
            Projeto personalizado
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        {/* PRIMARY */}
        <section
          id="produtos"
          className="scroll-mt-28"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles
                  size={13}
                  className="text-cyan-400"
                />

                <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Os principais
                </span>
              </div>

              <h2 className="mt-3 font-display text-3xl uppercase leading-none text-white sm:text-4xl">
                Escolhe o teu produto.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-zinc-500">
              As quatro soluções principais VinilArt
              Sport, prontas para começares a
              personalizar.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
            {primaryProducts.map(
              (product, index) => (
                <MainProductCard
                  key={product.slug}
                  product={product}
                  index={index}
                />
              ),
            )}
          </div>
        </section>

        {/* SECONDARY CATALOG */}
        <section
          id="catalogo"
          className="mt-24 scroll-mt-28 lg:mt-32"
        >
          <div className="flex flex-col gap-5 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Package
                  size={13}
                  className="text-yellow-300"
                />

                <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-yellow-300">
                  Mais artigos
                </span>
              </div>

              <h2 className="mt-3 font-display text-3xl uppercase leading-none text-white sm:text-4xl">
                Há muito mais
                <span className="text-zinc-600">
                  {" "}para personalizar.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-zinc-500">
              Acessórios, merchandising e outros
              artigos disponíveis para projetos
              individuais, equipas e clubes.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
            {catalogExamples.map(
              (example) => (
                <CatalogCard
                  key={example.id}
                  example={example}
                />
              ),
            )}
          </div>
        </section>

        {/* CUSTOM PROJECT */}
        <section className="mt-24 lg:mt-32">
          <div className="relative overflow-hidden border-y border-white/[0.08] py-10 sm:py-12">
            <div className="pointer-events-none absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-400/[0.055] blur-[120px]" />

            <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Não está no catálogo?
                </span>

                <h2 className="mt-3 max-w-3xl font-display text-3xl uppercase leading-[0.95] text-white sm:text-4xl">
                  Se tens a ideia,
                  <span className="text-zinc-600">
                    {" "}nós vemos como a fazer.
                  </span>
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
                  Fala connosco sobre outros artigos,
                  personalizações especiais ou projetos
                  para a tua equipa.
                </p>
              </div>

              <Link
                to="/contactos"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-5 font-mono text-[0.66rem] font-bold uppercase tracking-[0.13em] text-black transition hover:bg-cyan-300"
              >
                Pedir informação

                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* TEAM / CLUB */}
        <section className="mt-14 lg:mt-20">
          <TeamClubBanner />
        </section>
      </main>
    </PageShell>
  );
}
