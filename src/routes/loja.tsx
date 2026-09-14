import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";
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

type CardLinkProps =
  | {
      to: "/produto/$slug";
      params: {
        slug: string;
      };
      search: {
        cartItem: undefined;
        modo: undefined;
      };
    }
  | {
      to: "/adeptos";
      search: {
        artigo: undefined;
        cartItem: undefined;
      };
    };

function UniformProductCard({
  title,
  category,
  priceLabel,
  description,
  image,
  isPhoto = false,
  actionLabel,
  linkProps,
  featured = false,
}: {
  title: string;
  category: string;
  priceLabel?: string;
  description?: string;
  image: string;
  isPhoto?: boolean;
  actionLabel: string;
  linkProps: CardLinkProps;
  featured?: boolean;
}) {
  return (
    <Link
      {...(linkProps as any)}
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-[1.35rem]",
        "border border-white/[0.09] bg-[#101722]",
        "outline-none transition-all duration-300",
        "hover:-translate-y-1 hover:border-cyan-400/35",
        "hover:shadow-[0_18px_50px_rgba(0,0,0,0.32)]",
        "focus-visible:ring-2 focus-visible:ring-cyan-400",
        featured ? "min-h-full" : "",
      ].join(" ")}
    >
      <article className="flex h-full flex-col">
        <div
          className={[
            "relative flex aspect-square w-full items-center justify-center overflow-hidden",
            "bg-[#090e15]",
            featured ? "p-3 sm:p-4" : "p-4 sm:p-5",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(34,211,238,0.09),transparent_62%)]" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#090e15]/65 to-transparent" />

          <img
            src={image}
            alt={title}
            loading="lazy"
            className={[
              "relative z-10 transition-transform duration-500",
              "group-hover:scale-[1.025]",
              isPhoto
                ? "h-full w-full object-cover"
                : "max-h-full max-w-full object-contain",
            ].join(" ")}
          />

          {priceLabel && (
            <span className="absolute right-3 top-3 z-20 rounded-full border border-white/10 bg-black/80 px-3 py-1.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.11em] text-zinc-100 backdrop-blur-md">
              {priceLabel}
            </span>
          )}

          {featured && (
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-zinc-300 backdrop-blur-md">
              <Sparkles size={10} className="text-cyan-300" />
              Destaque
            </div>
          )}
        </div>

        <div
          className={[
            "flex flex-1 flex-col border-t border-white/[0.06]",
            featured ? "p-5 sm:p-6" : "p-4 sm:p-5",
          ].join(" ")}
        >
          <div className="flex-1">
            <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-cyan-400">
              {category}
            </span>

            <h3
              className={[
                "mt-2 font-display uppercase leading-[1.02] tracking-wide text-white",
                "transition-colors group-hover:text-cyan-200",
                featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
              ].join(" ")}
            >
              {title}
            </h3>

            {description && (
              <p
                className={[
                  "mt-3 line-clamp-3 leading-relaxed text-zinc-400",
                  featured ? "text-sm" : "text-[0.82rem]",
                ].join(" ")}
              >
                {description}
              </p>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-cyan-300">
              {actionLabel}
            </span>

            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-all duration-300 group-hover:border-cyan-400 group-hover:bg-cyan-400 group-hover:text-black">
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function MainProductCard({ product }: { product: Product }) {
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

function FeaturePill({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs text-zinc-300">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
        <Check size={10} strokeWidth={3} />
      </span>

      {children}
    </div>
  );
}

function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  description,
  accentColor = "cyan",
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  accentColor?: "cyan" | "yellow";
}) {
  return (
    <div className="flex flex-col justify-between gap-7 border-b border-white/10 pb-7 md:flex-row md:items-end">
      <div>
        <span
          className={[
            "font-mono text-[0.66rem] font-medium uppercase tracking-[0.22em]",
            accentColor === "yellow"
              ? "text-yellow-300"
              : "text-cyan-400",
          ].join(" ")}
        >
          {index} // {eyebrow}
        </span>

        <h2 className="mt-3 font-display text-4xl uppercase leading-[0.9] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
          <br />
          <span className="text-zinc-600">
            {accent}
          </span>
        </h2>
      </div>

      <p className="max-w-md text-[0.95rem] leading-7 text-zinc-400">
        {description}
      </p>
    </div>
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
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));

  return (
    <PageShell className="bg-[#090c11] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0c1118]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-[9%] top-[-210px] h-[580px] w-[150px] rotate-[30deg] bg-cyan-400/[0.075]" />
          <div className="absolute right-[3%] top-[-210px] h-[580px] w-[105px] rotate-[30deg] bg-fuchsia-500/[0.075]" />
          <div className="absolute right-[-1%] top-[-210px] h-[580px] w-[58px] rotate-[30deg] bg-yellow-400/[0.075]" />

          <div className="absolute -left-52 bottom-[-310px] h-[520px] w-[520px] rounded-full bg-cyan-400/[0.07] blur-[160px]" />

          <div className="absolute right-[12%] top-[20%] h-72 w-72 rounded-full bg-fuchsia-500/[0.04] blur-[120px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:py-24">
          <div>
            <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em] text-cyan-400">
              Loja // VinilArt Sport
            </span>

            <h1 className="mt-5 max-w-5xl font-display text-[3rem] uppercase leading-[0.86] tracking-tight text-white sm:text-6xl lg:text-[5.2rem]">
              Personaliza
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-300 bg-clip-text text-transparent">
                o teu jogo.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-[0.98rem] leading-7 text-zinc-400 sm:text-base">
              Do equipamento aos acessórios. Escolhe o produto, envia o teu
              design e prepara a tua personalização diretamente com a VinilArt.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <FeaturePill>
                Personalização online
              </FeaturePill>

              <FeaturePill>
                Apoio da equipa VinilArt
              </FeaturePill>

              <FeaturePill>
                Projetos para clubes e equipas
              </FeaturePill>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <p className="max-w-sm text-sm leading-6 text-zinc-500 lg:text-right">
              Começa pelos nossos produtos principais ou explora outras bases
              disponíveis para personalização.
            </p>

            <div className="mt-2 flex flex-wrap gap-2 lg:justify-end">
              <a
                href="#destaques"
                className="rounded-full border border-cyan-400/30 bg-cyan-400/[0.08] px-4 py-2.5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-400 hover:text-black"
              >
                Produtos principais
              </a>

              <a
                href="#mais-formas"
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-zinc-300 transition hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
              >
                Ver catálogo
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-5 py-16 sm:px-8 sm:py-20 lg:space-y-32 lg:py-28">
        <section
          id="destaques"
          className="scroll-mt-28"
        >
          <SectionHeading
            index="01"
            eyebrow="Produtos em destaque"
            title="Escolhe."
            accent="Personaliza."
            description="Os produtos principais da VinilArt Sport, preparados para criares a tua personalização diretamente no site."
          />

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {primaryProducts.map((product) => (
              <MainProductCard
                key={product.slug}
                product={product}
              />
            ))}
          </div>
        </section>

        <section
          id="mais-formas"
          className="scroll-mt-28"
        >
          <SectionHeading
            index="02"
            eyebrow="Mais opções"
            title="Mais formas"
            accent="de personalizar."
            accentColor="yellow"
            description="Outros artigos que podemos preparar à tua medida — para atletas, equipas, clubes, eventos e adeptos."
          />

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catalogExamples.map((example) => (
              <CatalogCard
                key={example.id}
                example={example}
              />
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#0d131c] px-5 py-7 sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-cyan-400/[0.06] blur-[100px]" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <span className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-cyan-400">
                Não encontraste o que procuravas?
              </span>

              <h2 className="mt-2 font-display text-2xl uppercase leading-tight text-white sm:text-3xl">
                Também personalizamos
                <span className="text-zinc-500">
                  {" "}outros artigos.
                </span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Envia-nos a tua ideia ou uma referência e fala diretamente com
                a equipa VinilArt para avaliarmos o projeto.
              </p>
            </div>

            <Link
              to="/contactos"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/[0.08] px-5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-cyan-300 transition hover:bg-cyan-400 hover:text-black"
            >
              Falar com a VinilArt
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        <section>
          <TeamClubBanner />
        </section>
      </div>
    </PageShell>
  );
}
