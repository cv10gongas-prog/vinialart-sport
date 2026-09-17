/**
 * VinilArt Sport — Camada de dados (repositories / adapters).
 *
 * A UI nunca lê arrays hardcoded: pede os dados a estes repositories.
 * Hoje a origem é local (`LocalContentSource`, alimentada por src/lib/content/seed.ts).
 * Mais tarde basta implementar `ContentSource` com a WordPress REST API — o frontend
 * e a lógica não mudam.
 */

import { seedContent } from "./seed";
import type {
  SiteCategory,
  SiteContactChannel,
  SiteContent,
  SiteHomeSection,
  SiteNavLink,
  SitePortfolioItem,
  SiteProduct,
  SiteSettings,
} from "./types";

/** Origem de conteúdo. Uma implementação = uma fonte (local, WordPress, …). */
export interface ContentSource {
  readonly id: string;
  /** Leitura imediata, usada no servidor e no primeiro render. */
  snapshot(): SiteContent;
  /** Leitura assíncrona, usada quando a origem é remota. */
  fetch(): Promise<SiteContent>;
}

export class LocalContentSource implements ContentSource {
  readonly id = "local-seed";
  private readonly content: SiteContent = seedContent();

  snapshot(): SiteContent {
    return this.content;
  }

  async fetch(): Promise<SiteContent> {
    return this.content;
  }
}

let source: ContentSource = new LocalContentSource();

export function getContentSource(): ContentSource {
  return source;
}

/** Ponto único de troca para a futura implementação WordPress. */
export function setContentSource(next: ContentSource): void {
  source = next;
}

function sortByOrder<T extends { order: number }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export interface ProductRepository {
  list(options?: {
    onlyPublished?: boolean;
    inShop?: boolean;
    inHome?: boolean;
    featured?: boolean;
    categoryId?: string;
  }): SiteProduct[];
  /** ID estável: nunca depende do nome nem do slug. */
  getById(id: string): SiteProduct | undefined;
  getBySlug(slug: string): SiteProduct | undefined;
  getByCustomizerConfigId(configId: string): SiteProduct | undefined;
}

export interface CategoryRepository {
  list(options?: { onlyActive?: boolean }): SiteCategory[];
  getById(id: string): SiteCategory | undefined;
  getBySlug(slug: string): SiteCategory | undefined;
  nameOf(categoryId: string): string;
}

export interface PortfolioRepository {
  list(options?: { onlyVisible?: boolean; featured?: boolean }): SitePortfolioItem[];
  getById(id: string): SitePortfolioItem | undefined;
}

export interface SiteSettingsRepository {
  get(): SiteSettings;
  contacts(options?: { onlyVisible?: boolean }): SiteContactChannel[];
  nav(area: "header" | "footer"): SiteNavLink[];
  homeSections(options?: { onlyVisible?: boolean }): SiteHomeSection[];
}

export type ContentRepositories = {
  products: ProductRepository;
  categories: CategoryRepository;
  portfolio: PortfolioRepository;
  settings: SiteSettingsRepository;
};

/** Cria os repositories sobre um snapshot de conteúdo (puro, sem estado global). */
export function createRepositories(content: SiteContent): ContentRepositories {
  const products: ProductRepository = {
    list(options) {
      let list = sortByOrder(content.products);
      if (options?.onlyPublished) list = list.filter((p) => p.status === "published");
      if (options?.inShop) list = list.filter((p) => p.showInShop);
      if (options?.inHome) list = list.filter((p) => p.showInHome);
      if (options?.featured) list = list.filter((p) => p.featured);
      if (options?.categoryId) list = list.filter((p) => p.categoryId === options.categoryId);
      return list;
    },
    getById: (id) => content.products.find((p) => p.id === id),
    getBySlug: (slug) => content.products.find((p) => p.slug === slug),
    getByCustomizerConfigId: (configId) =>
      content.products.find((p) => p.customizerConfigId === configId),
  };

  const categories: CategoryRepository = {
    list(options) {
      const list = sortByOrder(content.categories);
      return options?.onlyActive ? list.filter((c) => c.active) : list;
    },
    getById: (id) => content.categories.find((c) => c.id === id),
    getBySlug: (slug) => content.categories.find((c) => c.slug === slug),
    nameOf: (categoryId) => content.categories.find((c) => c.id === categoryId)?.name ?? "",
  };

  const portfolio: PortfolioRepository = {
    list(options) {
      let list = sortByOrder(content.portfolio);
      if (options?.onlyVisible) list = list.filter((item) => item.visible);
      if (options?.featured) list = list.filter((item) => item.featured);
      return list;
    },
    getById: (id) => content.portfolio.find((item) => item.id === id),
  };

  const settings: SiteSettingsRepository = {
    get: () => content.settings,
    contacts(options) {
      const list = sortByOrder(content.contacts);
      return options?.onlyVisible
        ? list.filter((channel) => channel.visible && channel.value.trim() !== "")
        : list;
    },
    nav: (area) =>
      sortByOrder(area === "header" ? content.headerLinks : content.footerLinks).filter(
        (link) => link.visible,
      ),
    homeSections(options) {
      const list = sortByOrder(content.homeSections);
      return options?.onlyVisible ? list.filter((section) => section.visible) : list;
    },
  };

  return { products, categories, portfolio, settings };
}

/** Repositories sobre a origem ativa. Seguro em servidor e cliente. */
export function getRepositories(): ContentRepositories {
  return createRepositories(getContentSource().snapshot());
}
