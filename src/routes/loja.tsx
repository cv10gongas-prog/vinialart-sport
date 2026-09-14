import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Check,
  PackageSearch,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import { PageShell } from "@/components/sport/PageShell";
import { TeamClubBanner } from "@/components/sport/TeamClubBanner";
import { products, type Product } from "@/lib/sport-data";
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

function StorePill({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-10 items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 text-[0.78rem] text-zinc-300 backdrop-blur-sm">
      <span className="text-cyan-300">
        {icon}
      </span>

      {children}
    </div>
  );
}

function SectionHeader({
  number,
  label,
  title,
  mutedTitle,
  description,
  tone = "cyan",
}: {
  number: string;
  label: string;
  title: string;
  mutedTitle: string;
  description: string;
  tone?: "cyan" | "yellow";
}) {
  return (
    <div className="grid gap-7 border-b border-white/10 pb-7 lg:grid-cols-[1fr_420px] lg:items-end">
      <div>
        <div
          className={[
            "flex items-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.21em]",
            tone === "yellow"
              ? "text-yellow-300"
              : "text-cyan-400",
          ].join(" ")}
        >
          <span>
            {number}
          </span>

          <span className="h-px w-10 bg-current opacity-50" />

          <span>
            {label}
          </span>
        </div>

        <h2 className="mt-4 font-display text-[2.7rem] uppercase leading-[0.87] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
          <br />

          <span className="text-zinc-600">
            {mutedTitle}
          </span>
        </h2>
      </div>

      <p className="max-w-md text-[0.94rem] leading-7 text-zinc-400 lg:justify-self-end">
        {description}
      </p>
    </div>
  );
}

function ProductCard({
  title,
  category,
  image,
  description,
  priceLabel,
  isPhoto = false,
  featured = false,
  linkProps,
}: {
  title: string;
  category: string;
  image: string;
  description?: string;
  priceLabel?: string;
  isPhoto?: boolean;
  featured?: boolean;
  linkProps: any;
}) {
  return (
    <Link
      {...linkProps}
      className={[
        "group relative flex h-full flex-col overflow-hidden",
        "rounded-[1.6rem] border border-white/[0.09]",
        "bg-[#0f1620] outline-none",
        "transition-all duration-300",
        "hover:-translate-y-1.5",
        "hover:border-cyan-400/35",
        "hover:shadow-[0_22px_70px_rgba(0,0,0,0.42)]",
        "focus-visible:ring-2 focus-visible:ring-cyan-400",
      ].join(" ")}
    >
      <article className="flex h-full flex-col">
        <div
          className={[
            "relative flex aspect-square w-full items-center justify-center overflow-hidden",
            "bg-[#080d14]",
            featured ? "p-3 sm:p-4" : "p-4",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.12),transparent_58%)] opacity-80" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#080d14] via-[#080d14]/55 to-transparent" />

          <div className="pointer-events-none absolute left-0 top-0 h-20 w-20 bg-gradient-to-br from-cyan-400/[0.08] to-transparent" />

          <img
            src={image}
            alt={title}
            loading="lazy"
            className={[
              "relative z-10 transition duration-500 ease-out",
              "group-hover:scale-[1.035]",
              isPhoto
                ? "h-full w-full object-cover"
                : "max-h-full max-w-full object-contain",
            ].join(" ")}
          />

          {priceLabel && (
            <div className="absolute right-3 top-3 z-20 rounded-full border border-white/10 bg-black/80 px-3 py-1.5 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-zinc-100 shadow-lg backdrop-blur-md">
              {priceLabel}
            </div>
          )}

          {featured && (
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.09] px-3 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-cyan-300 backdrop-blur-md">
              <Sparkles size={11} />
              Produto principal
            </div>
          )}
        </div>

        <div
          className={[
            "relative flex flex-1 flex-col border-t border-white/[0.065]",
            featured ? "p-5 sm:p-6" : "p-4 sm:p-5",
          ].join(" ")}
        >
          <div className="flex-1">
            <span className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.17em] text-cyan-400">
              {category}
            </span>

            <h3
              className={[
                "mt-2.5 font-display uppercase leading-[1] tracking-wide text-white",
                "transition-colors duration-300",
                "group-hover:text-cyan-200",
                featured
                  ? "text-[1.35rem] sm:text-[1.55rem]"
                  : "text-lg sm:text-xl",
              ].join(" ")}
            >
              {title}
            </h3>

            {description && (
              <p className="mt-3 line-clamp-3 text-[0.83rem] leading-6 text-zinc-400">
                {description}
              </p>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-cyan-300">
              Personalizar
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-zinc-400 transition-all duration-300 group-hover:border-cyan-400 group-hover:bg-cyan-400 group-hover:text-black">
              <ArrowRight size={15} />
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent transition-all duration-300 group-hover:via-cyan-400/80" />
      </article>
    </Link>
  );
}

function MainProductCard({
  product,
}: {
  product: Product;
}) {
  const image = product.catalogImage ?? product.image;

  return (
    <ProductCard
      title={product.name}
      category={product.category}
      image={image}
      description={product.description}
      priceLabel={productPrice(product)}
      isPhoto={REAL_PHOTO_SLUGS.has(product.slug)}
      featured
      linkProps={{
        to: "/produto/$slug",
        params: {
          slug: product.slug,
        },
        search: {
          cartItem: undefined,
          modo: undefined,
        },
      }}
    />
  );
}

function CatalogProductCard({
  example,
}: {
  example: (typeof catalogExamples)[number];
}) {
  const isPhoto =
    example.kind === "Fotografia de trabalho";

  return (
    <ProductCard
      title={example.name}
      category={
        isPhoto
          ? "Exemplo real"
          : "Base para personalização"
      }
      image={example.image}
      priceLabel="Sob consulta"
      isPhoto={isPhoto}
      linkProps={{
        to: "/produto/$slug",
        params: {
          slug: `${example.id}-personalizado`,
        },
        search: {
          modo: undefined,
          cartItem: undefined,
        },
      }}
    />
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
    <PageShell className="bg-[#080b10] text-white">
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0b1017]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(34,211,238,0.025),transparent_38%,rgba(217,70,239,0.02)_70%,rgba(250,204,21,0.02))]" />

          <div className="absolute right-[14%] top-[-250px] h-[720px] w-[155px] rotate-[31deg] bg-cyan-400/[0.075]" />
          <div className="absolute right-[8%] top-[-250px] h-[720px] w-[105px] rotate-[31deg] bg-fuchsia-500/[0.07]" />
          <div className="absolute right-[4%] top-[-250px] h-[720px] w-[55px] rotate-[31deg] bg-yellow-300/[0.07]" />

          <div className="absolute -left-60 bottom-[-350px] h-[620px] w-[620px] rounded-full bg-cyan-400/[0.08] blur-[180px]" />

          <div className="absolute right-[-80px] top-[180px] h-[350px] w-[350px] rounded-full bg-fuchsia-500/[0.045] blur-[150px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-28">
          <div>
            <div className="flex items-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-cyan-400">
              <span>
                VinilArt Sport
              </span>

              <span className="h-px w-9 bg-cyan-400/50" />

              <span className="text-zinc-500">
                Loja
              </span>
            </div>

            <h1 className="mt-5 max-w-4xl font-display text-[3.1rem] uppercase leading-[0.84] tracking-tight text-white sm:text-6xl lg:text-[5.6rem]">
              O teu jogo.
              <br />

              <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-yellow-300 bg-clip-text text-transparent">
                A tua identidade.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-[0.98rem] leading-7 text-zinc-400 sm:text-base">
              Caneleiras, equipamentos, bandeiras,
              estampagem e acessórios feitos para
              atletas, equipas e clubes que querem
              jogar com identidade própria.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <StorePill
                icon={<WandSparkles size={14} />}
              >
                Personalização online
              </StorePill>

              <StorePill
                icon={<Users size={14} />}
              >
                Clubes e equipas
              </StorePill>

              <StorePill
                icon={<Check size={13} />}
              >
                Apoio da VinilArt
              </StorePill>
            </div>
          </div>

          <div className="lg:justify-self-end">
            <div className="max-w-md rounded-[1.6rem] border border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-sm sm:p-6">
              <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Começa por aqui
              </span>

              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Escolhe um dos nossos principais
                produtos ou explora todas as bases
                disponíveis para personalização.
              </p>

              <div className="mt-5 grid gap-2">
                <a
                  href="#produtos-principais"
                  className="group flex min-h-12 items-center justify-between rounded-xl border border-cyan-400/25 bg-cyan-400/[0.075] px-4 font-mono text-[0.67rem] font-semibold uppercase tracking-[0.13em] text-cyan-300 transition hover:bg-cyan-400 hover:text-black"
                >
                  Produtos principais

                  <ArrowDown
                    size={14}
                    className="transition-transform group-hover:translate-y-0.5"
                  />
                </a>

                <a
                  href="#catalogo"
                  className="group flex min-h-12 items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 font-mono text-[0.67rem] font-semibold uppercase tracking-[0.13em] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  Ver catálogo

                  <ArrowDown
                    size={14}
                    className="transition-transform group-hover:translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
        {/* PRINCIPAIS */}
        <section
          id="produtos-principais"
          className="scroll-mt-28"
        >
          <SectionHeader
            number="01"
            label="Produtos principais"
            title="Os essenciais."
            mutedTitle="Feitos à tua maneira."
            description="As principais soluções VinilArt Sport, prontas para personalizares diretamente no site ou desenvolveres com a nossa equipa."
          />

          <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {primaryProducts.map((product) => (
              <MainProductCard
                key={product.slug}
                product={product}
              />
            ))}
          </div>
        </section>

        {/* DIVISOR */}
        <div className="my-24 flex items-center gap-4 lg:my-32">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-white/10" />

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0d131b] text-zinc-600">
            <PackageSearch size={16} />
          </div>

          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-white/10" />
        </div>

        {/* CATÁLOGO */}
        <section
          id="catalogo"
          className="scroll-mt-28"
        >
          <SectionHeader
            number="02"
            label="Catálogo"
            title="Mais formas"
            mutedTitle="de personalizar."
            tone="yellow"
            description="Do acessório de treino ao merchandising. Explora outras bases disponíveis e encontra novas formas de representar a tua equipa."
          />

          <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catalogExamples.map((example) => (
              <CatalogProductCard
                key={example.id}
                example={example}
              />
            ))}
          </div>
        </section>

        {/* CUSTOM REQUEST CTA */}
        <section className="relative mt-24 overflow-hidden rounded-[1.8rem] border border-white/[0.09] bg-[#0e151f] lg:mt-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/[0.07] blur-[100px]" />
            <div className="absolute -bottom-20 left-[25%] h-60 w-60 rounded-full bg-fuchsia-500/[0.05] blur-[110px]" />
          </div>

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div>
              <div className="flex items-center gap-2 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                <Sparkles size={12} />
                Projeto especial
              </div>

              <h2 className="mt-3 max-w-2xl font-display text-3xl uppercase leading-[0.95] text-white sm:text-4xl">
                Não encontraste
                <span className="text-zinc-600">
                  {" "}o que procuravas?
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                Se tens uma ideia, um produto diferente
                ou precisas de algo para a tua equipa,
                fala connosco. A VinilArt analisa o
                projeto e prepara uma solução à medida.
              </p>
            </div>

            <Link
              to="/contactos"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-cyan-400/25 bg-cyan-400/[0.08] px-5 font-mono text-[0.67rem] font-semibold uppercase tracking-[0.13em] text-cyan-300 transition hover:bg-cyan-400 hover:text-black"
            >
              Falar com a VinilArt
              <ArrowRight size={15} />
            </Link>
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
