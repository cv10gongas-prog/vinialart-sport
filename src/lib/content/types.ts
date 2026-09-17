/**
 * VinilArt Sport — Modelo de conteúdo administrável (CMS)
 *
 * Regra: CONTEÚDO DO SITE = editável aqui. LÓGICA INTERNA = código.
 * Todos os itens têm um `id` estável: mudar nome/slug nunca perde configuração.
 */

export type PriceMode = "quote" | "price";
export type PublishStatus = "published" | "draft";

export type CmsCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string | undefined;
  order: number;
  active: boolean;
};

export type CmsProductVariants = {
  sizes: string[];
  colors: string[];
};

export type CmsProduct = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  shortDescription: string;
  longDescription: string;
  image: string;
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

export type CmsPortfolioItem = {
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

export type CmsContactChannel = {
  id: string;
  type: ContactChannelType;
  label: string;
  value: string;
  order: number;
  visible: boolean;
};

export type CmsNavLink = {
  id: string;
  label: string;
  to: string;
  order: number;
  visible: boolean;
};

export type CmsHomeSection = {
  id: string;
  /** chave interna usada pelo código para saber que layout renderizar */
  key: string;
  label: string;
  title: string;
  subtitle: string;
  order: number;
  visible: boolean;
};

export type CmsSettings = {
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

export type CmsContent = {
  schemaVersion: number;
  categories: CmsCategory[];
  products: CmsProduct[];
  portfolio: CmsPortfolioItem[];
  contacts: CmsContactChannel[];
  headerLinks: CmsNavLink[];
  footerLinks: CmsNavLink[];
  homeSections: CmsHomeSection[];
  settings: CmsSettings;
};

export const CMS_SCHEMA_VERSION = 1;
