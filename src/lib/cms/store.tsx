/**
 * VinilArt Sport — Estado de conteúdo (CMS) partilhado por todo o site.
 *
 * O frontend público e a área administrativa leem daqui.
 * A persistência acontece atrás do ContentRepository (ver repository.ts).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { defaultContent } from "./defaults";
import { getContentRepository } from "./repository";
import type {
  CmsCategory,
  CmsContactChannel,
  CmsContent,
  CmsHomeSection,
  CmsNavLink,
  CmsPortfolioItem,
  CmsProduct,
  CmsSettings,
} from "./types";

type CmsContextValue = {
  content: CmsContent;
  ready: boolean;
  saving: boolean;
  update: (updater: (current: CmsContent) => CmsContent) => void;
  reset: () => void;
};

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<CmsContent>(() => defaultContent());
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    getContentRepository()
      .load()
      .then((loaded) => {
        if (active) {
          setContent(loaded);
          setReady(true);
        }
      })
      .catch(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback((next: CmsContent) => {
    setSaving(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void getContentRepository()
        .save(next)
        .finally(() => setSaving(false));
    }, 250);
  }, []);

  const update = useCallback(
    (updater: (current: CmsContent) => CmsContent) => {
      setContent((current) => {
        const next = updater(current);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const reset = useCallback(() => {
    const fresh = defaultContent();
    setContent(fresh);
    void getContentRepository().clear();
  }, []);

  const value = useMemo<CmsContextValue>(
    () => ({ content, ready, saving, update, reset }),
    [content, ready, saving, update, reset],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

function useCmsContext(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (ctx) return ctx;
  // Fora do provider (ex.: testes) devolve conteúdo por omissão, somente leitura.
  return {
    content: defaultContent(),
    ready: true,
    saving: false,
    update: () => undefined,
    reset: () => undefined,
  };
}

export function useCms() {
  return useCmsContext();
}

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function useCmsSettings(): CmsSettings {
  return useCmsContext().content.settings;
}

export function useCmsCategories(options?: { onlyActive?: boolean }): CmsCategory[] {
  const { content } = useCmsContext();
  return useMemo(() => {
    const list = sortByOrder(content.categories);
    return options?.onlyActive ? list.filter((c) => c.active) : list;
  }, [content.categories, options?.onlyActive]);
}

export function useCmsProducts(options?: {
  onlyPublished?: boolean;
  inShop?: boolean;
  inHome?: boolean;
  featured?: boolean;
}): CmsProduct[] {
  const { content } = useCmsContext();
  return useMemo(() => {
    let list = sortByOrder(content.products);
    if (options?.onlyPublished) list = list.filter((p) => p.status === "published");
    if (options?.inShop) list = list.filter((p) => p.showInShop);
    if (options?.inHome) list = list.filter((p) => p.showInHome);
    if (options?.featured) list = list.filter((p) => p.featured);
    return list;
  }, [
    content.products,
    options?.onlyPublished,
    options?.inShop,
    options?.inHome,
    options?.featured,
  ]);
}

export function useCmsPortfolio(options?: { onlyVisible?: boolean }): CmsPortfolioItem[] {
  const { content } = useCmsContext();
  return useMemo(() => {
    const list = sortByOrder(content.portfolio);
    return options?.onlyVisible ? list.filter((item) => item.visible) : list;
  }, [content.portfolio, options?.onlyVisible]);
}

export function useCmsContacts(options?: { onlyVisible?: boolean }): CmsContactChannel[] {
  const { content } = useCmsContext();
  return useMemo(() => {
    const list = sortByOrder(content.contacts);
    return options?.onlyVisible
      ? list.filter((channel) => channel.visible && channel.value.trim() !== "")
      : list;
  }, [content.contacts, options?.onlyVisible]);
}

export function useCmsHomeSections(options?: { onlyVisible?: boolean }): CmsHomeSection[] {
  const { content } = useCmsContext();
  return useMemo(() => {
    const list = sortByOrder(content.homeSections);
    return options?.onlyVisible ? list.filter((s) => s.visible) : list;
  }, [content.homeSections, options?.onlyVisible]);
}

export function useCmsNav(area: "header" | "footer"): CmsNavLink[] {
  const { content } = useCmsContext();
  return useMemo(() => {
    const list = area === "header" ? content.headerLinks : content.footerLinks;
    return sortByOrder(list).filter((link) => link.visible);
  }, [area, content.headerLinks, content.footerLinks]);
}

export function useCmsCategoryName(categoryId: string): string {
  const { content } = useCmsContext();
  return content.categories.find((c) => c.id === categoryId)?.name ?? "";
}
