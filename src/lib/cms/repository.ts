/**
 * VinilArt Sport — Persistência de conteúdo atrás de um repositório.
 *
 * A UI e a lógica nunca falam diretamente com o localStorage.
 * Para ligar mais tarde ao WordPress REST API basta criar outra implementação
 * de `ContentRepository` — o frontend não muda.
 */

import { CMS_SCHEMA_VERSION, type CmsContent } from "./types";
import { defaultContent } from "./defaults";

export interface ContentRepository {
  readonly id: string;
  load(): Promise<CmsContent>;
  save(content: CmsContent): Promise<void>;
  clear(): Promise<void>;
}

const STORAGE_KEY = `vinilart-sport:cms:v${CMS_SCHEMA_VERSION}`;

/** Junta o conteúdo guardado com os valores por omissão (migração suave). */
function normalize(raw: unknown): CmsContent {
  const base = defaultContent();
  if (!raw || typeof raw !== "object") return base;
  const stored = raw as Partial<CmsContent>;

  return {
    schemaVersion: CMS_SCHEMA_VERSION,
    categories: stored.categories ?? base.categories,
    products: stored.products ?? base.products,
    portfolio: stored.portfolio ?? base.portfolio,
    contacts: stored.contacts ?? base.contacts,
    headerLinks: stored.headerLinks ?? base.headerLinks,
    footerLinks: stored.footerLinks ?? base.footerLinks,
    homeSections: stored.homeSections ?? base.homeSections,
    settings: { ...base.settings, ...(stored.settings ?? {}) },
  };
}

export class LocalContentRepository implements ContentRepository {
  readonly id = "local-storage";

  async load(): Promise<CmsContent> {
    if (typeof window === "undefined") return defaultContent();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultContent();
      return normalize(JSON.parse(raw));
    } catch {
      return defaultContent();
    }
  }

  async save(content: CmsContent): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // quota ou modo privado — ignorado de propósito
    }
  }

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

let repository: ContentRepository = new LocalContentRepository();

export function getContentRepository(): ContentRepository {
  return repository;
}

export function setContentRepository(next: ContentRepository): void {
  repository = next;
}
