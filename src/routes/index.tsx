import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowRight,
  Upload,
  MessageSquare,
  Flag,
  Layers,
  Printer,
} from "lucide-react";
import { PageShell } from "@/components/sport/PageShell";
import { products } from "@/lib/sport-data";
import { productPresentationImage } from "@/lib/sport-presentation";

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
      { property: "og:title", content: "VinilArt Sport — Personalização desportiva" },
      {
        property: "og:description",
        content:
          "Personalizamos material para o mundo do desporto: caneleiras, equipamentos, bandeiras, adeptos, estampagem e impressão.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const areas = [
  {
    slug: "caneleiras-personalizadas",
    label: "Caneleiras",
    accent: "magenta",
    text: "A tua identidade, em cada entrada em campo.",
  },
  {
    slug: "equipamento-personalizado",
    label: "Equipamentos",
    accent: "cyan",
    text: "O mesmo espírito. Uma identidade de equipa.",
  },
  {
    slug: "bandeira-personalizada",
    label: "Bandeiras",
    accent: "yellow",
    text: "As tuas cores, dentro e fora do campo.",
  },
] as const;

// Only verified client photographs belong here. The gallery stays hidden until
// those assets are supplied; neutral configurator bases are never portfolio work.
const realWorks: { image: string; alt: string; label: string }[] = [];

function InkSignature() {
  return (
    <span className="home-ink-signature" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function Home() {
  return (
    <PageShell className="sport-home">
      <section className="home-hero campaign-hero" aria-labelledby="home-title">
        <img
          className="campaign-hero-image"
          src="/brand/sport-hero-approved.jpg"
          alt=""
          aria-hidden="true"
          width="1600"
          height="1104"
          fetchPriority="high"
        />
        <div className="home-container campaign-hero-inner">
          <p className="campaign-tag">VinilArt Sport</p>
          <h1 id="home-title">
            Personalizamos
            <br />
            <span>o teu jogo.</span>
          </h1>
          <p className="home-intro">
            Caneleiras, equipamentos, bandeiras e soluções gráficas para atletas, clubes e adeptos.
          </p>
          <div className="home-actions">
            <Link to="/loja" className="home-button home-button-cyan">
              Ver loja <ArrowRight size={19} aria-hidden="true" />
            </Link>
            <Link to="/portfolio" className="home-button home-button-outline">
              Ver portfólio <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="campaign-hero-baseline home-container">
          <span>Design · Personalização · Impressão</span>
          <a href="#personalizamos">
            Descobre os produtos <ArrowRight size={17} aria-hidden="true" />
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
              <p className="home-eyebrow">Feito à tua medida</p>
              <h2 id="products-title">
                Produtos
                <br />
                em destaque<span className="home-magenta">.</span>
              </h2>
            </div>
            <Link to="/loja" className="home-text-link">
              Explorar a loja <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </div>
          <div className="home-product-grid">
            {areas.map((area, i) => {
              const product = products.find((item) => item.slug === area.slug)!;
              return (
                <Link
                  key={area.slug}
                  to="/produto/$slug"
                  params={{ slug: area.slug }}
                  className={`home-product home-accent-${area.accent}`}
                >
                  <div className="home-product-top">
                    <span>0{i + 1}</span>
                    <span>Personalizável</span>
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
                      <span>Personalizar</span>
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

      {realWorks.length > 0 && (
        <section className="home-works home-section" aria-labelledby="works-title">
          <div className="home-container">
            <div className="home-section-heading">
              <h2 id="works-title">Trabalhos realizados.</h2>
              <Link to="/portfolio" className="home-text-link">
                Ver portfólio <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            </div>
            <div className="home-work-grid">
              {realWorks.map((work) => (
                <figure key={work.image}>
                  <img src={work.image} alt={work.alt} loading="lazy" />
                  <figcaption>{work.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="home-paths home-section" aria-labelledby="paths-title">
        <div className="home-container">
          <div className="home-section-heading">
            <div>
              <p className="home-eyebrow">A tua ideia é o ponto de partida</p>
              <h2 id="paths-title">
                Como queres
                <br />
                avançar?
              </h2>
            </div>
            <p className="home-heading-note">
              Com o design pronto ou só uma ideia.
              <br />
              Há espaço para os dois.
            </p>
          </div>
          <div className="home-path-grid">
            <article className="home-path home-path-ready">
              <div className="home-path-top">
                <span>01 / O teu ficheiro</span>
                <Upload size={29} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3>
                Já tens
                <br />o design?
              </h3>
              <p>Carrega o teu ficheiro e vê como pode ficar no produto.</p>
              <Link to="/personalizar" className="home-button home-button-cyan">
                Personalizar <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
              <div className="home-path-rule" aria-hidden="true" />
            </article>
            <article className="home-path home-path-help">
              <div className="home-path-top">
                <span>02 / A tua ideia</span>
                <MessageSquare size={29} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3>
                Ainda não tens
                <br />o design?
              </h3>
              <p>Envia a tua ideia ou referência e a VinilArt trata contigo da personalização.</p>
              <Link
                to="/personalizar"
                search={{ modo: "ajuda" }}
                className="home-button home-button-magenta"
              >
                Pedir ajuda <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
              <div className="home-path-rule" aria-hidden="true" />
            </article>
          </div>
        </div>
      </section>

      <section className="home-services home-section" aria-labelledby="services-title">
        <div className="home-container">
          <div className="home-section-heading">
            <div>
              <p className="home-eyebrow">Para lá do produto</p>
              <h2 id="services-title">
                Mais formas de
                <br />
                dar vida à tua ideia.
              </h2>
            </div>
            <span className="home-service-label">Serviços / Sob consulta</span>
          </div>
          <div className="home-service-grid">
            <Link
              to="/adeptos"
              search={{ artigo: undefined, cartItem: undefined }}
              className="home-service home-accent-yellow"
            >
              <Flag size={30} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3>Artigos para adeptos</h3>
                <p>Bandeiras personalizadas e outros pedidos para apoiar o teu clube.</p>
              </div>
              <span className="home-service-action">
                Explorar <ArrowUpRight size={22} aria-hidden="true" />
              </span>
            </Link>
            <Link
              to="/produto/$slug"
              params={{ slug: "estampagem" }}
              className="home-service home-accent-cyan"
            >
              <Layers size={30} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3>Estampagem</h3>
                <p>Nomes, números, emblemas e grafismos nas tuas peças desportivas.</p>
              </div>
              <span className="home-service-action">
                Pedir orçamento <ArrowUpRight size={22} aria-hidden="true" />
              </span>
            </Link>
            <Link
              to="/produto/$slug"
              params={{ slug: "impressao" }}
              className="home-service home-accent-magenta"
            >
              <Printer size={30} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3>Impressão</h3>
                <p>Envia o teu ficheiro e conta-nos o que precisas de imprimir.</p>
              </div>
              <span className="home-service-action">
                Pedir orçamento <ArrowUpRight size={22} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-contact" aria-labelledby="contact-title">
        <div className="home-container home-contact-inner">
          <div>
            <p className="home-eyebrow">Vamos dar o próximo passo?</p>
            <h2 id="contact-title">
              Tens a ideia.
              <br />
              Vamos pô-la <span>em jogo.</span>
            </h2>
            <p>Envia o teu ficheiro ou conta-nos o que tens em mente.</p>
          </div>
          <Link to="/contactos" className="home-button home-button-light">
            Falar com a VinilArt <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
