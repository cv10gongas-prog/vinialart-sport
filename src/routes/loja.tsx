import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  Package,
  Sparkles,
  Users,
  WandSparkles,
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

function getProductImage(product: Product) {
  return product.catalogImage ?? product.image;
}

function getProductPrice(product: Product) {
  return product.slug === "caneleiras-personalizadas"
    ? "Desde 19,90€"
    : "Sob orçamento";
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
      params={{ slug: product.slug }}
      search={{
        cartItem: undefined,
        modo: undefined,
      }}
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1rem] border border-white/[0.08] bg-[#0d1218] outline-none transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_22px_65px_rgba(0,0,0,0.38)] focus-visible:ring-2 focus-visible:ring-cyan-400 sm:rounded-[1.35rem]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#080c11]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(34,211,238,0.09),transparent_62%)]" />

        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className={[
            "relative z-10 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.035]",
            isPhoto
              ? "object-cover"
              : "object-contain p-3 sm:p-5 xl:p-6",
          ].join(" ")}
        />

        <div className="absolute left-2 top-2 z-20 flex h-7 min-w-7 items-center justify-center rounded-full border border-white/10 bg-black/70 px-1.5 font-mono text-[0.5rem] font-bold tracking-[0.08em] text-zinc-300 backdrop-blur sm:left-3 sm:top-3 sm:h-8 sm:min-w-8 sm:px-2 sm:text-[0.61rem]">
          0{index + 1}
        </div>

        <div className="absolute right-2 top-2 z-20 max-w-[82px] rounded-full border border-white/10 bg-black/80 px-2 py-1.5 text-center font-mono text-[0.43rem] font-semibold uppercase leading-tight tracking-[0.06em] text-white backdrop-blur sm:right-3 sm:top-3 sm:max-w-none sm:px-3 sm:text-[0.59rem] sm:tracking-[0.1em]">
          {getProductPrice(product)}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14 bg-gradient-to-t from-[#080c11]/85 to-transparent sm:h-24" />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="min-w-0 flex-1">
          <span className="block truncate font-mono text-[0.48rem] font-semibold uppercase tracking-[0.11em] text-cyan-400 sm:text-[0.61rem] sm:tracking-[0.17em]">
            {product.category}
          </span>

          <h3 className="mt-1.5 line-clamp-2 min-h-[2.15rem] font-display text-[0.98rem] uppercase leading-[1.05] tracking-wide text-white transition-colors group-hover:text-cyan-200 sm:mt-2.5 sm:min-h-0 sm:text-[1.35rem] xl:text-[1.5rem]">
            {product.name}
          </h3>

          <p className="mt-3 hidden line-clamp-2 text-[0.8rem] leading-5 text-zinc-400 sm:block">
            {product.description}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-3 sm:mt-5 sm:pt-4">
          <span className="font-mono text-[0.5rem] font-bold uppercase tracking-[0.09em] text-white sm:text-[0.65rem] sm:tracking-[0.13em]">
            Personalizar
          </span>

          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-black transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-cyan-300 sm:h-9 sm:w-9 sm:group-hover:translate-x-1">
            <ArrowRight
              size={12}
              strokeWidth={2.5}
              className="sm:h-[15px] sm:w-[15px]"
            />
          </span>
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
  const isPhoto = example.kind === "Fotografia de trabalho";

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
      className="group min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.1rem] border border-white/[0.07] bg-[#0c1117] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-cyan-400/25 group-hover:bg-[#101720] group-hover:shadow-[0_16px_45px_rgba(0,0,0,0.28)]">
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

        <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <ArrowRight size={13} />
        </div>
      </div>

      <div className="px-1 pt-3">
        <span className="font-mono text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-zinc-600">
          {isPhoto ? "Exemplo real" : "Personalizável"}
        </span>

        <h3 className="mt-1.5 font-display text-base uppercase leading-none text-white transition-colors group-hover:text-cyan-200 sm:text-lg">
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
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));

  return (
    <PageShell className="bg-[#080b0f] text-white">
      <style>
        {`
          .store-nav-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .store-nav-scroll::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}
      </style>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#090d12]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(34,211,238,0.025),transparent_45%,rgba(217,70,239,0.02))]" />

          <div className="absolute right-[17%] top-[-260px] h-[700px] w-[130px] rotate-[28deg] bg-cyan-400/[0.055]" />
          <div className="absolute right-[10%] top-[-260px] h-[700px] w-[90px] rotate-[28deg] bg-fuchsia-500/[0.045]" />
          <div className="absolute right-[5%] top-[-260px] h-[700px] w-[50px] rotate-[28deg] bg-yellow-300/[0.045]" />

          <div className="absolute -left-52 bottom-[-360px] h-[600px] w-[600px] rounded-full bg-cyan-400/[0.06] blur-[170px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-18 lg:py-20">
          <div className="grid gap-9 lg:grid-cols-[1fr_0.78fr] lg:items-end lg:gap-10">
            <div className="min-w-0">
              <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-cyan-400">
                VinilArt Sport // Loja
              </span>

              <h1 className="mt-5 w-full max-w-full font-display text-[2.25rem] uppercase leading-[0.9] tracking-[-0.025em] text-white sm:max-w-4xl sm:text-6xl sm:leading-[0.86] sm:tracking-tight lg:text-[5.2rem]">
                <span className="block whitespace-nowrap">
                  Personalização
                </span>

                <span className="mt-1 block text-zinc-600 sm:mt-0">
                  <span className="block sm:inline">
                    feita para
                  </span>{" "}
                  <span className="block sm:inline">
                    jogar.
                  </span>
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-[0.94rem] leading-7 text-zinc-400 sm:text-[0.96rem]">
                Produtos desportivos e acessórios personalizados para atletas,
                equipas e clubes.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#principais"
                  className="inline-flex min-h-12 items-center gap-3 rounded-full bg-cyan-400 px-5 font-mono text-[0.66rem] font-bold uppercase tracking-[0.13em] text-black transition hover:bg-cyan-300"
                >
                  Ver produtos
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

            {/* INFO PANEL */}
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="flex items-center gap-4 border-t border-white/[0.08] py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400/[0.08] text-cyan-300">
                  <WandSparkles size={15} />
                </span>

                <div>
                  <span className="block text-sm font-medium text-white">
                    Personaliza online
                  </span>

                  <span className="mt-0.5 block text-xs leading-5 text-zinc-500">
                    Vê o resultado antes de enviar o pedido.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-white/[0.08] py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuchsia-400/[0.07] text-fuchsia-300">
                  <Users size={15} />
                </span>

                <div>
                  <span className="block text-sm font-medium text-white">
                    Equipas e clubes
                  </span>

                  <span className="mt-0.5 block text-xs leading-5 text-zinc-500">
                    Soluções individuais ou em quantidade.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-y border-white/[0.08] py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-300/[0.07] text-yellow-300">
                  <Sparkles size={15} />
                </span>

                <div>
                  <span className="block text-sm font-medium text-white">
                    Tens outra ideia?
                  </span>

                  <span className="mt-0.5 block text-xs leading-5 text-zinc-500">
                    Também trabalhamos projetos fora do catálogo.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORE NAV */}
      <div className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#090d12]/90 backdrop-blur-xl">
        <div className="store-nav-scroll mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 sm:px-8">
          <a
            href="#principais"
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
            Pedido especial
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
        {/* PRIMARY PRODUCTS */}
        <section
          id="principais"
          className="scroll-mt-24"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.19em] text-cyan-400">
                01 // Produtos principais
              </span>

              <h2 className="mt-3 font-display text-3xl uppercase leading-none text-white sm:text-4xl lg:text-5xl">
                Começa por aqui.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-zinc-500">
              As principais soluções VinilArt Sport para personalização
              individual ou de equipa.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
            {primaryProducts.map((product, index) => (
              <MainProductCard
                key={product.slug}
                product={product}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* SECONDARY */}
        <section
          id="catalogo"
          className="mt-24 scroll-mt-24 lg:mt-32"
        >
          <div className="flex flex-col gap-5 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Package
                  size={13}
                  className="text-yellow-300"
                />

                <span className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.19em] text-yellow-300">
                  02 // Mais artigos
                </span>
              </div>

              <h2 className="mt-3 font-display text-3xl uppercase leading-none text-white sm:text-4xl lg:text-5xl">
                Mais formas
                <span className="text-zinc-600">
                  {" "}
                  de personalizar.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-zinc-500">
              Garrafas, bonés, sacos, mochilas, T-shirts, braçadeiras,
              calções e muito mais.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
            {catalogExamples.map((example) => (
              <CatalogCard
                key={example.id}
                example={example}
              />
            ))}
          </div>
        </section>

        {/* SPECIAL REQUEST */}
        <section className="mt-24 lg:mt-32">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-white px-6 py-8 text-black sm:px-8 sm:py-10 lg:px-10">
            <div className="pointer-events-none absolute right-[-60px] top-[-100px] h-64 w-64 rounded-full bg-cyan-300/40 blur-[80px]" />

            <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Fora do catálogo
                </span>

                <h2 className="mt-3 max-w-3xl font-display text-3xl uppercase leading-[0.95] sm:text-4xl">
                  Tens outra coisa
                  <br className="hidden sm:block" />
                  em mente?
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600">
                  Diz-nos o que precisas e vemos contigo a melhor solução
                  para o projeto.
                </p>
              </div>

              <Link
                to="/contactos"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-black px-5 font-mono text-[0.66rem] font-bold uppercase tracking-[0.13em] text-white transition hover:bg-cyan-400 hover:text-black"
              >
                Falar com a VinilArt

                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-14 lg:mt-20">
          <TeamClubBanner />
        </section>
      </main>
    </PageShell>
  );
}
