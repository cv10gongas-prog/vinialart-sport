import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  FileImage,
  Layers3,
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

function MainProductCard({
  product,
}: {
  product: Product;
}) {
  const image =
    product.catalogImage ??
    product.image;

  const isRealPhoto =
    realPhotoSlugs.has(
      product.slug,
    );

  return (
    <ProductRouteLink
      product={product}
      className="group block overflow-hidden rounded-3xl border border-white/10 bg-[#101520] outline-none transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_22px_70px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <article className="relative">
        <div className="relative h-[340px] overflow-hidden bg-[#0c111a] sm:h-[400px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(0,200,255,0.12),transparent_42%),radial-gradient(circle_at_90%_90%,rgba(236,0,140,0.10),transparent_42%)]" />

          <img
            src={image}
            alt={`${product.name} — ${product.imageKind ?? "VinilArt Sport"}`}
            loading="lazy"
            className={`relative z-10 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.035] ${
              isRealPhoto
                ? "object-cover"
                : "object-contain p-8 sm:p-10"
            }`}
          />

          <span className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-zinc-200 backdrop-blur-md">
            {productPrice(product)}
          </span>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-[#101520] to-transparent" />
        </div>

        <div className="relative z-20 -mt-5 px-6 pb-7 sm:px-7">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-cyan-400">
            {product.category}
          </span>

          <h3 className="mt-2 font-display text-2xl uppercase leading-none tracking-wide text-white sm:text-3xl">
            {product.name}
          </h3>

          <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-400">
            {product.description}
          </p>

          <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4">
            <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-cyan-300">
              Personalizar
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition-all duration-300 group-hover:border-cyan-400 group-hover:bg-cyan-400 group-hover:text-black">
              <ArrowRight size={15} />
            </span>
          </div>
        </div>
      </article>
    </ProductRouteLink>
  );
}

function ServiceCard({
  product,
  visual,
}: {
  product: Product;
  visual: "photo" | "graphic";
}) {
  const content = (
    <article className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#10141d] transition-all duration-500 hover:border-white/20">
      <div className="relative min-h-[290px] overflow-hidden">
        {visual === "photo" &&
        product.catalogImage ? (
          <>
            <img
              src={product.catalogImage}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#10141d] via-black/15 to-black/10" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[#0b0f16]" />

            <div className="absolute -right-12 -top-28 h-[440px] w-[125px] rotate-[28deg] bg-cyan-400/20" />
            <div className="absolute right-12 -top-28 h-[440px] w-[90px] rotate-[28deg] bg-fuchsia-500/20" />
            <div className="absolute right-28 -top-28 h-[440px] w-[42px] rotate-[28deg] bg-yellow-400/20" />

            <div className="absolute bottom-8 left-7">
              <FileImage
                size={48}
                strokeWidth={1.2}
                className="text-zinc-500"
              />
            </div>
          </>
        )}

        <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.17em] text-zinc-300 backdrop-blur">
          Sob consulta
        </span>
      </div>

      <div className="relative px-6 pb-7 pt-6">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-zinc-500">
          {product.category}
        </span>

        <h3 className="mt-2 font-display text-2xl uppercase tracking-wide text-white">
          {product.name}
        </h3>

        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
          {product.description}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4">
          <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-cyan-300">
            {product.customizationMode ===
            "catalog"
              ? "Ver artigos"
              : "Pedir orçamento"}
          </span>

          <ArrowUpRight
            size={16}
            className="text-zinc-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300"
          />
        </div>
      </div>
    </article>
  );

  if (
    product.customizationMode ===
    "catalog"
  ) {
    return (
      <Link
        to="/adeptos"
        search={{
          artigo: undefined,
          cartItem: undefined,
        }}
        className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-3xl"
      >
        {content}
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
      className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-3xl"
    >
      {content}
    </Link>
  );
}

function CatalogCard({
  example,
}: {
  example: (typeof catalogExamples)[number];
}) {
  const isPhoto =
    example.kind ===
    "Fotografia de trabalho";

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
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#111722] outline-none transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <article>
        <div className="relative h-[245px] overflow-hidden bg-[#090d13]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,255,0.10),transparent_55%)]" />

          <img
            src={example.image}
            alt={`${example.name} — ${example.kind}`}
            loading="lazy"
            className={`relative z-10 h-full w-full transition-transform duration-500 group-hover:scale-105 ${
              isPhoto
                ? "object-cover"
                : "object-contain p-5"
            }`}
          />
        </div>

        <div className="border-t border-white/[0.06] px-5 py-5">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-zinc-500">
            {isPhoto
              ? "Exemplo real"
              : "Base para personalização"}
          </span>

          <h3 className="mt-1 font-display text-xl uppercase tracking-wide text-white">
            {example.name}
          </h3>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3">
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-cyan-300">
              Personalizar
            </span>

            <ArrowUpRight
              size={14}
              className="text-zinc-500 transition-colors group-hover:text-cyan-300"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

function Loja() {
  const customizable = products.filter(
    (product) =>
      product.isCustomizable &&
      product.customizationMode ===
        "product",
  );

  const supporterService =
    products.find(
      (product) =>
        product.slug ===
        "artigos-adeptos",
    );

  const printService =
    products.find(
      (product) =>
        product.slug ===
        "impressao",
    );

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
              href="#personalizaveis"
              className="rounded-full border border-cyan-400/30 bg-cyan-400/[0.08] px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-cyan-300 transition hover:bg-cyan-400 hover:text-black"
            >
              Personalizáveis
            </a>

            <a
              href="#servicos"
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-zinc-300 transition hover:border-white/25 hover:bg-white/[0.07]"
            >
              Serviços
            </a>

            <a
              href="#adeptos"
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-zinc-300 transition hover:border-white/25 hover:bg-white/[0.07]"
            >
              Artigos & acessórios
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-5 py-16 sm:px-8 lg:py-24">
        {/* PERSONALIZÁVEIS */}
        <section
          id="personalizaveis"
          className="scroll-mt-28"
        >
          <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-cyan-400">
                01 // Configurador online
              </span>

              <h2 className="mt-2 font-display text-3xl uppercase leading-none tracking-tight text-white sm:text-5xl">
                Produtos
                <br />
                <span className="text-zinc-500">
                  personalizáveis.
                </span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-zinc-500">
              Personaliza diretamente no site e vê o resultado antes de
              adicionares o pedido.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {customizable.map(
              (product) => (
                <MainProductCard
                  key={product.slug}
                  product={product}
                />
              ),
            )}
          </div>
        </section>

        {/* SERVIÇOS */}
        <section
          id="servicos"
          className="scroll-mt-28"
        >
          <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-fuchsia-400">
                02 // Pedidos & serviços
              </span>

              <h2 className="mt-2 font-display text-3xl uppercase leading-none tracking-tight text-white sm:text-5xl">
                Para além
                <br />
                <span className="text-zinc-500">
                  do equipamento.
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2 text-zinc-500">
              <Layers3 size={16} />

              <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em]">
                Sob consulta
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {supporterService && (
              <ServiceCard
                product={supporterService}
                visual="photo"
              />
            )}

            {printService && (
              <ServiceCard
                product={printService}
                visual="graphic"
              />
            )}
          </div>
        </section>

        {/* MERCHANDISING */}
        <section
          id="adeptos"
          className="scroll-mt-28"
        >
          <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-yellow-300">
                03 // Artigos & merchandising
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
              Garrafas, bonés, sacos, mochilas, T-shirts, braçadeiras e
              calções disponíveis para pedidos de personalização.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

        <section className="pt-2">
          <TeamClubBanner />
        </section>
      </div>
    </PageShell>
  );
}
