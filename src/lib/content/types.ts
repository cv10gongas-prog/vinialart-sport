/**
 * VinilArt Sport — Modelo de conteúdo administrável (CMS)
 *
 * Regra: CONTEÚDO DO SITE = editável aqui. LÓGICA INTERNA = código.
 * Todos os itens têm um `id` estável: mudar nome/slug nunca perde configuração.
 */

export type PriceMode = "quote" | "price";
export type PublishStatus = "published" | "draft";

export type SiteCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string | undefined;
  order: number;
  active: boolean;
};

export type SiteProductVariants = {
  sizes: string[];
  colors: string[];
};

export type SiteProduct = {
  id: string;
  slug: string;
  name: string;
  /** Nome curto usado nas grelhas de catálogo. */
  shortName: string;
  categoryId: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  /** Como a imagem preenche o cartão: fotografia real (cover) ou mockup (contain). */
  imageFit: "cover" | "contain";
  gallery: string[];
  priceMode: PriceMode;
  price: string;
  badge: string;
  featured: boolean;
  order: number;
  status: PublishStatus;
  showInShop: boolean;
  showInHome: boolean;
  customizable: boolean;
  /** Identificador da configuração do personalizador (estável, independente do nome). */
  customizerConfigId: string;
};

export type SitePortfolioItem = {
  id: string;
  title: string;
  categoryName: string;
  description: string;
  image: string;
  gallery: string[];
  featured: boolean;
  order: number;
  visible: boolean;
};

export type ContactChannelType =
  | "telefone"
  | "email"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "linkedin"
  | "youtube"
  | "website"
  | "endereco"
  | "custom";

export type SiteContactChannel = {
  id: string;
  type: ContactChannelType;
  label: string;
  value: string;
  order: number;
  visible: boolean;
};

export type SiteNavLink = {
  id: string;
  label: string;
  to: string;
  order: number;
  visible: boolean;
};

export type SiteHomeSection = {
  id: string;
  /** chave interna usada pelo código para saber que layout renderizar */
  key: string;
  label: string;
  title: string;
  subtitle: string;
  order: number;
  visible: boolean;
};

export type SiteSettings = {
  brandName: string;
  tagline: string;
  logo: string;
  favicon: string;
  currency: string;
  mainSiteUrl: string;
  mainSiteLabel: string;
  cartNote: string;
  footerText: string;
};

export type SiteContent = {
  schemaVersion: number;
  categories: SiteCategory[];
  products: SiteProduct[];
  portfolio: SitePortfolioItem[];
  contacts: SiteContactChannel[];
  headerLinks: SiteNavLink[];
  footerLinks: SiteNavLink[];
  homeSections: SiteHomeSection[];
  settings: SiteSettings;
};

export const CONTENT_SCHEMA_VERSION = 1;
