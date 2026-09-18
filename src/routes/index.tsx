import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowRight,
  Flag,
  Layers,
  Printer,
} from "lucide-react";
import { PageShell } from "@/components/sport/PageShell";
import { useHomeContent, useRepositories } from "@/lib/content/store";
import { productPresentationImage } from "@/lib/sport-presentation";
import type { SiteHomeService } from "@/lib/content/types";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "VinilArt Sport — Personalização desportiva" },
      {
        name: "description",
        content:
          "Divisão desportiva da VinilArt. Design, personalização e impressão para atletas, clubes e adeptos: caneleiras, equipamentos e bandeiras.",
      },
      {
        property: "og:title",
        content: "VinilArt Sport — Personalização desportiva",
      },
      {
        property: "og:description",
        content:
          "Personalizamos material para o mundo do desporto: caneleiras, equipamentos, bandeiras, adeptos, estampagem e impressão.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.png" },
    ],
  }),
});

/** Conjunto fixo de ícones disponíveis para os serviços (escolha por dados). */
const serviceIcons = {
  flag: Flag,
  layers: Layers,
  printer: Printer,
} as const;

function ServiceCard({ service }: { service: SiteHomeService }) {
  const Icon = serviceIcons[service.icon];

  const body = (
    <>
      <Icon size={30} strokeWidth={1.5} aria-hidden="true" />

      <div>
        <h3>{service.title}</h3>

        <p>{service.text}</p>
      </div>

      <span className="home-service-action">
        {service.actionLabel} <ArrowUpRight size={22} aria-hidden="true" />
      </span>
    </>
  );

  const className = `home-service home-accent-${service.accent}`;

  if (service.slug) {
    return (
      <Link
        to="/produto/$slug"
        params={{ slug: service.slug }}
        className={className}
      >
        {body}
      </Link>
    );
  }

  return (
    <Link
      to={service.to}
      search={{ artigo: undefined, cartItem: undefined }}
      className={className}
    >
      {body}
    </Link>
  );
}

function Home() {
  const { products: productsRepo } = useRepositories();
  const home = useHomeContent();

  const highlights = home.products.highlights
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);

  const works = home.works.items
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);

  const services = home.services.items
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <PageShell className="sport-home">
      <style>
        {`
          /*
           * A imagem é panorâmica, por isso num telemóvel não é possível
           * mostrar os três jogadores ao mesmo tempo sem a esmagar.
           *
           * Este crop privilegia o jogador da esquerda + jogador central
           * e deixa a zona do texto suficientemente escura.
           */
          @media (max-width: 639px) {
            .sport-site .campaign-hero-image {
              object-position: 42% center !important;
              filter: brightness(0.82) contrast(1.05);
            }

            .sport-site .campaign-hero {
              background: #07090d;
            }

            .sport-site .campaign-hero-inner {
              position: relative;
              z-index: 2;
            }
          }

          /*
           * Em tablet começamos a recentrar progressivamente a composição.
           */
          @media (min-width: 640px) and (max-width: 899px) {
            .sport-site .campaign-hero-image {
              object-position: 48% center !important;
            }
          }
        `}
      </style>

      <section
        className="home-hero campaign-hero"
        aria-labelledby="home-title"
      >
        <img
          className="campaign-hero-image"
          src={home.hero.image}
          alt=""
          aria-hidden="true"
          width="1600"
          height="1104"
          fetchPriority="high"
        />

        <div className="home-container campaign-hero-inner">
          <p className="campaign-tag">{home.hero.tag}</p>

          <h1 id="home-title">
            {home.hero.titleLine1}
            <br />
            <span>{home.hero.titleHighlight}</span>
          </h1>

          <p className="home-intro">{home.hero.intro}</p>

          <div className="home-actions">
            <Link
              to={home.hero.primaryCta.to}
              className="home-button home-button-cyan"
            >
              {home.hero.primaryCta.label}{" "}
              <ArrowRight size={19} aria-hidden="true" />
            </Link>

            <Link
              to={home.hero.secondaryCta.to}
              className="home-button home-button-outline"
            >
              {home.hero.secondaryCta.label}{" "}
              <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="campaign-hero-baseline home-container">
          <span>{home.hero.baselineText}</span>

          <a href={home.hero.baselineLinkHref}>
            {home.hero.baselineLinkLabel}{" "}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section
        className="home-products home-section"
        id="personalizamos"
        aria-labelledby="products-title"
      >
        <div className="home-container">
          <div className="home-section-heading">
            <div>
              <p className="home-eyebrow">{home.products.eyebrow}</p>

              <h2 id="products-title">
                {home.products.titleLine1}
                <br />
                {home.products.titleLine2}
                <span className="home-magenta">.</span>
              </h2>
            </div>

            <Link to="/loja" className="home-text-link">
              {home.products.linkLabel}{" "}
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </div>

          <div className="home-product-grid">
            {highlights.map((area, i) => {
              const product = productsRepo.getBySlug(area.productSlug);

              if (!product) return null;

              return (
                <Link
                  key={area.id}
                  to="/produto/$slug"
                  params={{ slug: area.productSlug }}
                  className={`home-product home-accent-${area.accent}`}
                >
                  <div className="home-product-top">
                    <span>0{i + 1}</span>
                    <span>{home.products.itemBadge}</span>
                  </div>

                  <div className="home-product-stage">
                    <div className="home-product-ink" aria-hidden="true" />

                    <img
                      src={productPresentationImage(product.image)}
                      alt={`Modelo neutro de ${area.label.toLowerCase()}`}
                      width="800"
                      height="800"
                      loading="lazy"
                    />
                  </div>

                  <div className="home-product-copy">
                    <h3>{area.label}</h3>

                    <p>{area.text}</p>

                    <div className="home-product-bottom">
                      <span>{home.products.itemAction}</span>

                      <span className="home-product-arrow">
                        <ArrowUpRight size={20} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {works.length > 0 && (
        <section
          className="home-works home-section"
          aria-labelledby="works-title"
        >
          <div className="home-container">
            <div className="home-section-heading">
              <h2 id="works-title">{home.works.title}</h2>

              <Link to="/portfolio" className="home-text-link">
                {home.works.linkLabel}{" "}
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            </div>

            <div className="home-work-grid">
              {works.map((work) => (
                <figure key={work.id}>
                  <img src={work.image} alt={work.alt} loading="lazy" />

                  <figcaption>{work.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        className="home-services home-section"
        aria-labelledby="services-title"
      >
        <div className="home-container">
          <div className="home-section-heading">
            <div>
              <p className="home-eyebrow">{home.services.eyebrow}</p>

              <h2 id="services-title">
                {home.services.titleLine1}
                <br />
                {home.services.titleLine2}
              </h2>
            </div>

            <span className="home-service-label">{home.services.label}</span>
          </div>

          <div className="home-service-grid">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-contact" aria-labelledby="contact-title">
        <div className="home-container home-contact-inner">
          <div>
            <p className="home-eyebrow">{home.contact.eyebrow}</p>

            <h2 id="contact-title">
              {home.contact.titleLine1}
              <br />
              {home.contact.titleLine2}{" "}
              <span>{home.contact.titleHighlight}</span>
            </h2>

            <p>{home.contact.text}</p>
          </div>

          <Link
            to={home.contact.cta.to}
            className="home-button home-button-light"
          >
            {home.contact.cta.label}{" "}
            <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
