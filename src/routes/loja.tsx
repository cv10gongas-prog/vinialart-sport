import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Package,
  Sparkles,
  Star,
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

function getProductPrice(product: Product) {
  if (product.slug === "caneleiras-personalizadas") {
    return "Desde 19,90€";
  }

  return "Sob orçamento";
}

function StoreBadge({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex min-h-10 items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 text-[0.76rem] font-medium text-zinc-300 backdrop-blur-md">
      <span className="text-cyan-300">
        {icon}
      </span>

      {children}
    </div>
  );
}

function PrimaryProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
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
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-white/[0.085] bg-[#0e141c] outline-none transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-400/35 hover:shadow-[0_26px_80px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden bg-[#080c11]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(34,211,238,0.11),transparent_58%)]" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#080c11]/95 via-[#080c11]/40 to-transparent" />

          <div className="absolute left-4 top-4 z-20 flex h-8 min-w-8 items-center justify-center rounded-full border border-white/10 bg-black/65 px-2 font-mono text-[0.62rem] font-bold tracking-[0.08em] text-zinc-300 backdrop-blur-md">
            0{index + 1}
          </div>

          <div className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/75 px-3 py-1.5 font-mono text-[0.61rem] font-semibold uppercase tracking-[0.11em] text-white backdrop-blur-md">
            {getProductPrice(product)}
          </div>

          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className={[
              "relative z-[5] h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.035]",
              isPhoto
                ? "object-cover"
                : "object-contain p-5 sm:p-6",
            ].join(" ")}
          />

          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-3 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-cyan-300 backdrop-blur-md">
            <Star size={10} fill="currentColor" />
            Produto principal
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex-1">
            <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-cyan-400">
              {product.category}
            </span>

            <h3 className="mt-2.5 font-display text-[1.45rem] uppercase leading-[0.96] tracking-wide text-white transition-colors duration-300 group-hover:text-cyan-200 sm:text-[1.65rem]">
              {product.name}
            </h3>

            <p className="mt-3 line-clamp-3 text-[0.86rem] leading-6 text-zinc-400">
              {product.description}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white">
              Personalizar
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 text-black transition-all duration-300 group-hover:translate-x-1 group-hover:bg-cyan-300">
              <ArrowRight size={15} strokeWidth={2.5} />
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent transition-all duration-500 group-hover:via-cyan-400/80" />
      </article>
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
      className="group flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-white/[0.075] bg-[#0d1218] outline-none transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#111820] hover:shadow-[0_18px_55px_rgba(0,0,0,0.32)] focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <div className="relative aspect-square overflow-hidden bg-[#080c11]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.035),transparent_60%)]" />

        <img
          src={example.image}
          alt={example.name}
          loading="lazy"
          className={[
            "h-full w-full transition-transform duration-500 group-hover:scale-[1.035]",
            isPhoto
              ? "object-cover"
              : "object-contain p-5 sm:p-6",
          ].join(" ")}
        />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex-1">
          <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {isPhoto
              ? "Exemplo real"
              : "Personalizável"}
          </span>

          <h3 className="mt-2 font-display text-lg uppercase leading-none tracking-wide text-white transition-colors group-hover:text-cyan-200 sm:text-xl">
            {example.name}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3.5">
          <span className="font-mono text-[0.61rem] font-semibold uppercase tracking-[0.13em] text-cyan-300">
            Personalizar
          </span>

          <ArrowRight
            size={14}
            className="text-zinc-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan-300"
          />
        </div>
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
    <PageShell className="bg-[#070a0e] text-white">
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-white/[0.08] bg-[#0a0e13]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(34,211,238,0.03),transparent_35%,rgba(217,70,239,0.025)_70%,rgba(250,204,21,0.025))]" />

          <div className="absolute right-[11%] top-[-260px] h-[760px] w-[160px] rotate-[31deg] bg-cyan-400/[0.065]" />
          <div className="absolute right-[5%] top-[-260px] h-[760px] w-[105px] rotate-[31deg] bg-fuchsia-500/[0.055]" />
          <div className="absolute right-[1%] top-[-260px] h-[760px] w-[58px] rotate-[31deg] bg-yellow-300/[0.055]" />

          <div className="absolute -left-64 bottom-[-380px] h-[680px] w-[680px] rounded-full bg-cyan-400/[0.07] blur-[190px]" />

          <div className="absolute right-[-140px] top-[120px] h-[440px] w-[440px] rounded-full bg-fuchsia-500/[0.04] blur-[170px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-cyan-400">
                <span>VinilArt Sport</span>

                <span className="h-px w-10 bg-cyan-400/45" />

                <span className="text-zinc-500">
                  Loja oficial
                </span>
              </div>

              <h1 className="mt-5 max-w-5xl font-display text-[3.25rem] uppercase leading-[0.82] tracking-tight text-white sm:text-6xl lg:text-[5.7rem] xl:text-[6.4rem]">
                Joga com
                <br />

                <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                  a tua identidade.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-[0.98rem] leading-7 text-zinc-400 sm:text-base">
                Personalização feita para atletas,
                equipas e clubes. Escolhe o produto,
                envia o teu design e cria algo que seja
                mesmo teu.
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <StoreBadge
                  icon={
                    <WandSparkles size={14} />
                  }
                >
                  Personalização online
                </StoreBadge>

                <StoreBadge
                  icon={
                    <Users size={14} />
                  }
                >
                  Equipas e clubes
                </StoreBadge>

                <StoreBadge
                  icon={
                    <Check
                      size={13}
                      strokeWidth={3}
                    />
                  }
                >
                  Apoio VinilArt
                </StoreBadge>
              </div>
            </div>

            <div className="lg:justify-self-end">
              <div className="w-full max-w-md overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-black/20 backdrop-blur-md">
                <div className="border-b border-white/[0.07] px-5 py-4">
                  <span className="font-mono text-[0.61rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Explorar a loja
                  </span>
                </div>

                <div className="p-3">
                  <a
                    href="#principais"
                    className="group flex min-h-14 items-center justify-between rounded-xl px-4 transition hover:bg-cyan-400/[0.08]"
                  >
                    <div>
                      <span className="block text-sm font-semibold text-white">
                        Produtos principais
                      </span>

                      <span className="mt-0.5 block text-xs text-zinc-500">
                        Caneleiras, equipamento,
                        bandeiras e estampagem
                      </span>
                    </div>

                    <ArrowRight
                      size={16}
                      className="text-cyan-400 transition-transform group-hover:translate-x-1"
                    />
                  </a>

                  <a
                    href="#catalogo"
                    className="group flex min-h-14 items-center justify-between rounded-xl px-4 transition hover:bg-white/[0.04]"
                  >
                    <div>
                      <span className="block text-sm font-semibold text-white">
                        Mais artigos
                      </span>

                      <span className="mt-0.5 block text-xs text-zinc-500">
                        Merchandising e outras bases
                        personalizáveis
                      </span>
                    </div>

                    <ArrowRight
                      size={16}
                      className="text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-white"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 flex justify-center lg:mt-20">
            <a
              href="#principais"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-zinc-500 transition hover:border-cyan-400/30 hover:text-cyan-300"
              aria-label="Ver produtos"
            >
              <ChevronDown size={16} />
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
        {/* PRINCIPAIS */}
        <section
          id="principais"
          className="scroll-mt-28"
        >
          <div className="grid gap-7 border-b border-white/[0.08] pb-7 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <div className="flex items-center gap-3 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                <span>01</span>

                <span className="h-px w-10 bg-cyan-400/40" />

                <span>
                  Produtos principais
                </span>
              </div>

              <h2 className="mt-4 font-display text-[2.8rem] uppercase leading-[0.86] tracking-tight sm:text-5xl lg:text-6xl">
                Os essenciais.
                <br />

                <span className="text-zinc-600">
                  Feitos à tua maneira.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[0.94rem] leading-7 text-zinc-400 lg:justify-self-end">
              As principais soluções VinilArt Sport,
              preparadas para personalização direta e
              projetos de equipa.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {primaryProducts.map(
              (product, index) => (
                <PrimaryProductCard
                  key={product.slug}
                  product={product}
                  index={index}
                />
              ),
            )}
          </div>
        </section>

        {/* SEPARADOR */}
        <div className="my-24 flex items-center gap-5 lg:my-32">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-white/10" />

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-[#0d1218] text-zinc-600">
            <Package size={15} />
          </div>

          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-white/10" />
        </div>

        {/* CATÁLOGO */}
        <section
          id="catalogo"
          className="scroll-mt-28"
        >
          <div className="grid gap-7 border-b border-white/[0.08] pb-7 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <div className="flex items-center gap-3 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-yellow-300">
                <span>02</span>

                <span className="h-px w-10 bg-yellow-300/40" />

                <span>
                  Mais artigos
                </span>
              </div>

              <h2 className="mt-4 font-display text-[2.8rem] uppercase leading-[0.86] tracking-tight sm:text-5xl lg:text-6xl">
                Mais formas
                <br />

                <span className="text-zinc-600">
                  de personalizar.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[0.94rem] leading-7 text-zinc-400 lg:justify-self-end">
              Garrafas, bonés, sacos, mochilas,
              T-shirts, braçadeiras, calções e outras
              bases disponíveis para personalização.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
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

        {/* CTA */}
        <section className="mt-24 lg:mt-32">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#0e141c]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/[0.08] blur-[100px]" />

              <div className="absolute -bottom-28 left-[20%] h-72 w-72 rounded-full bg-fuchsia-500/[0.045] blur-[120px]" />
            </div>

            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-11">
              <div>
                <div className="flex items-center gap-2 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  <Sparkles size={12} />

                  <span>
                    Projeto especial
                  </span>
                </div>

                <h2 className="mt-3 max-w-3xl font-display text-3xl uppercase leading-[0.94] sm:text-4xl lg:text-5xl">
                  Tens uma ideia
                  <br />

                  <span className="text-zinc-600">
                    que não está no catálogo?
                  </span>
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                  Fala connosco. Podemos analisar
                  outros artigos, projetos especiais
                  ou soluções para clubes, equipas e
                  eventos.
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
        <section className="mt-14 lg:mt-20">
          <TeamClubBanner />
        </section>
      </main>
    </PageShell>
  );
}
