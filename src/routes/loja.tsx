import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
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

const MAIN_PRODUCT_SLUGS = [
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

function getProductPrice(product: Product) {
  if (product.slug === "caneleiras-personalizadas") {
    return "Desde 19,90€";
  }

  return "Sob orçamento";
}

function MainProductCard({
  product,
}: {
  product: Product;
}) {
  const image = product.catalogImage ?? product.image;
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
      className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-[#10141b] outline-none transition duration-300 hover:-translate-y-1 hover:border-cyan-400/35 hover:bg-[#121923] hover:shadow-[0_18px_55px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <div className="relative aspect-square overflow-hidden bg-[#090d12]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.09),transparent_58%)]" />

        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className={[
            "relative z-10 h-full w-full transition-transform duration-500 group-hover:scale-[1.025]",
            isPhoto
              ? "object-cover"
              : "object-contain p-5 sm:p-6",
          ].join(" ")}
        />

        <div className="absolute left-3 top-3 z-20 rounded-full border border-white/10 bg-black/75 px-3 py-1.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.11em] text-white backdrop-blur">
          {getProductPrice(product)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex-1">
          <span className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.16em] text-cyan-400">
            {product.category}
          </span>

          <h3 className="mt-2 font-display text-xl uppercase leading-none tracking-wide text-white transition-colors group-hover:text-cyan-200">
            {product.name}
          </h3>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">
            {product.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
          <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-zinc-200">
            Personalizar
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 text-black transition-transform group-hover:translate-x-1">
            <ArrowRight size={15} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CatalogProductCard({
  example,
}: {
  example: (typeof catalogExamples)[number];
}) {
  const isRealPhoto =
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
      className="group flex h-full flex-col overflow-hidden rounded-[1.15rem] border border-white/[0.08] bg-[#0f1319] outline-none transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#12171e] focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <div className="relative aspect-square overflow-hidden bg-[#090d12]">
        <img
          src={example.image}
          alt={example.name}
          loading="lazy"
          className={[
            "h-full w-full transition-transform duration-500 group-hover:scale-[1.025]",
            isRealPhoto
              ? "object-cover"
              : "object-contain p-5 sm:p-6",
          ].join(" ")}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-zinc-500">
          {isRealPhoto
            ? "Exemplo real"
            : "Personalizável"}
        </span>

        <h3 className="mt-2 font-display text-lg uppercase leading-none text-white transition-colors group-hover:text-cyan-200">
          {example.name}
        </h3>

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-cyan-300">
            Ver produto
          </span>

          <ArrowRight
            size={14}
            className="text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-cyan-300"
          />
        </div>
      </div>
    </Link>
  );
}

function Loja() {
  const mainProducts = MAIN_PRODUCT_SLUGS
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
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#0b0f14]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-48 h-[500px] w-[500px] rounded-full bg-cyan-400/[0.07] blur-[140px]" />

          <div className="absolute -left-40 bottom-[-220px] h-[400px] w-[400px] rounded-full bg-fuchsia-500/[0.04] blur-[140px]" />

          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              <span>VinilArt Sport</span>

              <span className="h-px w-10 bg-cyan-400/40" />

              <span className="text-zinc-500">
                Loja
              </span>
            </div>

            <h1 className="mt-5 font-display text-[3.15rem] uppercase leading-[0.86] tracking-tight sm:text-6xl lg:text-[5.5rem]">
              Feito para
              <br />
              <span className="text-cyan-300">
                o teu jogo.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-[0.98rem] leading-7 text-zinc-400 sm:text-base">
              Personaliza equipamento, acessórios e
              artigos desportivos com a identidade da
              tua equipa, clube ou projeto.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#principais"
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-cyan-400 px-5 font-mono text-[0.67rem] font-bold uppercase tracking-[0.13em] text-black transition hover:bg-cyan-300"
              >
                Ver produtos
                <ChevronDown size={14} />
              </a>

              <Link
                to="/contactos"
                className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 font-mono text-[0.67rem] font-semibold uppercase tracking-[0.13em] text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.07]"
              >
                Preciso de ajuda
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
        {/* PRINCIPAIS */}
        <section
          id="principais"
          className="scroll-mt-28"
        >
          <div className="mb-8 flex flex-col gap-5 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400">
                <Sparkles size={14} />

                <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em]">
                  Produtos principais
                </span>
              </div>

              <h2 className="mt-3 font-display text-3xl uppercase leading-none text-white sm:text-5xl">
                Começa por aqui.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-zinc-400">
              Os produtos principais da VinilArt Sport,
              disponíveis para personalização e pedidos
              de equipa.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {mainProducts.map((product) => (
              <MainProductCard
                key={product.slug}
                product={product}
              />
            ))}
          </div>
        </section>

        {/* OUTROS ARTIGOS */}
        <section
          id="catalogo"
          className="mt-20 scroll-mt-28 lg:mt-28"
        >
          <div className="mb-8 flex flex-col gap-5 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-yellow-300">
                <Package size={14} />

                <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em]">
                  Outros artigos
                </span>
              </div>

              <h2 className="mt-3 font-display text-3xl uppercase leading-none text-white sm:text-5xl">
                Mais para
                <span className="text-zinc-500">
                  {" "}personalizar.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-zinc-400">
              Garrafas, bonés, sacos, mochilas,
              T-shirts, braçadeiras, calções e outros
              artigos disponíveis mediante pedido.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {catalogExamples.map((example) => (
              <CatalogProductCard
                key={example.id}
                example={example}
              />
            ))}
          </div>
        </section>

        {/* PEDIDO ESPECIAL */}
        <section className="mt-20 lg:mt-28">
          <div className="relative overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-[#10151c] p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.07] blur-[90px]" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.17em] text-cyan-400">
                  Projeto especial
                </span>

                <h2 className="mt-3 font-display text-3xl uppercase leading-none sm:text-4xl">
                  Não encontraste
                  <br className="hidden sm:block" />
                  <span className="text-zinc-500">
                    {" "}o que procuravas?
                  </span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">
                  Envia-nos a tua ideia. Podemos avaliar
                  outros artigos e soluções personalizadas
                  para a tua equipa ou projeto.
                </p>
              </div>

              <Link
                to="/contactos"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-white px-5 font-mono text-[0.67rem] font-bold uppercase tracking-[0.13em] text-black transition hover:bg-cyan-300"
              >
                Falar com a VinilArt
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* CLUBES */}
        <section className="mt-12 lg:mt-16">
          <TeamClubBanner />
        </section>
      </main>
    </PageShell>
  );
}
