/**
 * VinilArt Sport — Conteúdo inicial (migração dos dados atuais).
 *
 * Os produtos, categorias, portefólio e contactos atuais são convertidos para o
 * modelo administrável através de adaptadores. Nada é recalibrado: as imagens,
 * textos e configurações do personalizador aprovadas são preservadas.
 */

import { products as coreProducts, type Product } from "@/lib/sport-data";
import { supporterProducts } from "@/lib/supporter-products";
import { catalogExamples } from "@/lib/catalog-examples";
import { VINILART_MAIN_URL } from "@/lib/config";
import { productPriceBadge, QUOTE_PRICE_LABEL } from "@/lib/content/pricing";

import {
  CONTENT_SCHEMA_VERSION,
  type SiteCategory,
  type SiteContactChannel,
  type SiteContent,
  type SiteHomeSection,
  type SiteNavLink,
  type SitePortfolioItem,
  type SiteProduct,
} from "./types";

const legacyCategories: { id: string; name: string; slug: string }[] = [
  { id: "cat-caneleiras", name: "Caneleiras", slug: "caneleiras" },
  { id: "cat-equipamentos", name: "Equipamentos", slug: "equipamentos" },
  { id: "cat-bandeiras", name: "Bandeiras", slug: "bandeiras" },
  { id: "cat-adeptos", name: "Artigos para Adeptos", slug: "adeptos" },
  { id: "cat-estampagem", name: "Estampagem", slug: "estampagem" },
  { id: "cat-impressao", name: "Impressão", slug: "impressao" },
];

function categoryIdForName(name: string): string {
  const found = legacyCategories.find((c) => c.name === name);
  return found ? found.id : "cat-adeptos";
}

/** Produtos apresentados com fotografia real (imagem a preencher o cartão). */
const legacyPhotoSlugs = new Set([
  "caneleiras-personalizadas",
  "equipamento-personalizado",
  "estampagem",
  "artigos-adeptos",
]);

/** Nomes curtos e imagens usados hoje na grelha de catálogo. */
const catalogPresentation = new Map(
  catalogExamples.map((example) => [
    `${example.id}-personalizado`,
    example,
  ]),
);

/** Converte um produto legacy (array hardcoded) para o modelo centralizado. */
export function normalizeLegacyProduct(
  product: Product,
  order: number,
  featured: boolean,
): SiteProduct {
  const presentation = catalogPresentation.get(product.slug);
  const badge = productPriceBadge(product);
  const hasPrice = badge !== QUOTE_PRICE_LABEL;
  const isPhoto = presentation
    ? presentation.kind === "Fotografia de trabalho"
    : legacyPhotoSlugs.has(product.slug);

  return {
    id: `prod-${product.slug}`,
    slug: product.slug,
    name: product.name,
    shortName: presentation?.name ?? product.name,
    categoryId: categoryIdForName(product.category),
    shortDescription: product.description,
    longDescription: product.description,
    image: presentation?.image ?? product.catalogImage ?? product.image,
    imageFit: isPhoto ? "cover" : "contain",
    gallery: product.catalogGallery ?? product.gallery ?? [],
    priceMode: hasPrice ? "price" : "quote",
    price: hasPrice ? badge : "",
    badge: product.badges[0] ?? "",
    featured,
    order,
    status: "published",
    shelf: featured ? "principal" : "catalogo",
    showInShop: featured || Boolean(presentation),
    showInHome: featured,
    customizable: product.isCustomizable,
    customizerConfigId: product.slug,
  };
}

const FEATURED_SLUGS = new Set([
  "caneleiras-personalizadas",
  "equipamento-personalizado",
  "bandeira-personalizada",
  "estampagem",
]);

function defaultProducts(): SiteProduct[] {
  const all = [...coreProducts, ...supporterProducts];
  return all.map((product, index) =>
    normalizeLegacyProduct(product, index + 1, FEATURED_SLUGS.has(product.slug)),
  );
}

function defaultCategories(): SiteCategory[] {
  return legacyCategories.map((category, index) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: "",
    image: undefined,
    order: index + 1,
    active: true,
  }));
}

const legacyPortfolio: { title: string; categoryName: string; image: string }[] = [
  { title: "Caneleiras personalizadas", categoryName: "Caneleiras", image: "/catalog/caneleiras-clube.jpg" },
  { title: "Equipamentos personalizados", categoryName: "Equipamentos", image: "/catalog/equipamento-azul.jpg" },
  { title: "Personalização de equipamentos", categoryName: "Equipamentos", image: "/catalog/equipamento-vermelho.jpg" },
  { title: "Estampagem desportiva", categoryName: "Estampagem", image: "/catalog/estampagem-producao.jpg" },
  { title: "Design aplicado ao produto", categoryName: "Caneleiras", image: "/catalog/caneleiras-cores.jpg" },
  { title: "Bonés personalizados", categoryName: "Acessórios", image: "/catalog/bone-personalizado.jpg" },
  { title: "Braçadeiras personalizadas", categoryName: "Acessórios", image: "/catalog/bracadeira-em-uso.jpg" },
  { title: "Personalização de braçadeiras", categoryName: "Acessórios", image: "/catalog/bracadeira.jpg" },
  { title: "Grafismo integral", categoryName: "Acessórios", image: "/catalog/bracadeira-aberta.jpg" },
  { title: "Personalização à medida", categoryName: "Caneleiras", image: "/catalog/caneleiras-amarelas.jpg" },
  { title: "Acabamento personalizado", categoryName: "Caneleiras", image: "/catalog/caneleiras-azuis.jpg" },
];

function defaultPortfolio(): SitePortfolioItem[] {
  return legacyPortfolio.map((item, index) => ({
    id: `port-${index + 1}`,
    title: item.title,
    categoryName: item.categoryName,
    description: "",
    image: item.image,
    gallery: [],
    featured: index < 2,
    order: index + 1,
    visible: true,
  }));
}

function defaultContacts(): SiteContactChannel[] {
  // Sem dados inventados: os canais ficam vazios até serem preenchidos no admin.
  return [
    { id: "ch-telefone", type: "telefone", label: "Telefone", value: "", order: 1, visible: false },
    { id: "ch-email", type: "email", label: "Email", value: "", order: 2, visible: false },
    { id: "ch-instagram", type: "instagram", label: "Instagram", value: "", order: 3, visible: false },
    { id: "ch-whatsapp", type: "whatsapp", label: "WhatsApp", value: "", order: 4, visible: false },
    { id: "ch-endereco", type: "endereco", label: "Endereço", value: "", order: 5, visible: false },
  ];
}

function defaultHeaderLinks(): SiteNavLink[] {
  return [
    { id: "nav-inicio", label: "Início", to: "/", order: 1, visible: true },
    { id: "nav-loja", label: "Loja", to: "/loja", order: 2, visible: true },
    { id: "nav-portfolio", label: "Portfólio", to: "/portfolio", order: 3, visible: true },
    { id: "nav-contactos", label: "Contactos", to: "/contactos", order: 4, visible: true },
  ];
}

function defaultFooterLinks(): SiteNavLink[] {
  return [
    { id: "foot-loja", label: "Loja", to: "/loja", order: 1, visible: true },
    { id: "foot-personalizar", label: "Personalizar", to: "/personalizar", order: 2, visible: false },
    { id: "foot-portfolio", label: "Portfólio", to: "/portfolio", order: 3, visible: true },
    { id: "foot-contactos", label: "Contactos", to: "/contactos", order: 4, visible: true },
  ];
}

function defaultHomeSections(): SiteHomeSection[] {
  return [
    { id: "home-hero", key: "hero", label: "Destaque inicial", title: "", subtitle: "", order: 1, visible: true },
    { id: "home-areas", key: "areas", label: "O que personalizamos", title: "", subtitle: "", order: 2, visible: true },
    { id: "home-trabalhos", key: "trabalhos", label: "Trabalhos realizados", title: "", subtitle: "", order: 3, visible: true },
    { id: "home-avancar", key: "avancar", label: "Como queres avançar?", title: "", subtitle: "", order: 4, visible: true },
    { id: "home-servicos", key: "servicos", label: "Serviços", title: "", subtitle: "", order: 5, visible: true },
    { id: "home-contacto", key: "contacto", label: "Contacto final", title: "", subtitle: "", order: 6, visible: true },
  ];
}

export function seedContent(): SiteContent {
  return {
    schemaVersion: CONTENT_SCHEMA_VERSION,
    categories: defaultCategories(),
    products: defaultProducts(),
    portfolio: defaultPortfolio(),
    contacts: defaultContacts(),
    headerLinks: defaultHeaderLinks(),
    footerLinks: defaultFooterLinks(),
    homeSections: defaultHomeSections(),
    settings: {
      brandName: "VinilArt Sport",
      tagline: "Personalização desportiva",
      logo: "/brand/vinilart-sport-logo-horizontal.png",
      favicon: "/favicon.ico",
      currency: "EUR",
      mainSiteUrl: VINILART_MAIN_URL,
      mainSiteLabel: "Voltar à VinilArt",
      cartNote: "Os pedidos são confirmados pela VinilArt Sport antes da produção.",
      footerText: "Design, personalização e impressão. A identidade do teu desporto.",
    },
  };
}
