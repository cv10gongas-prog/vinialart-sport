/**
 * VinilArt Sport — Acesso ao conteúdo dentro do React.
 *
 * Só leitura: não existe interface de edição nesta fase.
 * Quando a origem passar a ser a WordPress REST API, o provider troca de
 * ContentSource e nenhum componente precisa de mudar.
 */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  createRepositories,
  getContentSource,
  type ContentRepositories,
} from "./repository";
import type { SiteContent } from "./types";

type ContentContextValue = {
  content: SiteContent;
  repositories: ContentRepositories;
  ready: boolean;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const source = getContentSource();
  const [content, setContent] = useState<SiteContent>(() => source.snapshot());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    source
      .fetch()
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
  }, [source]);

  const value = useMemo<ContentContextValue>(
    () => ({ content, repositories: createRepositories(content), ready }),
    [content, ready],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

function useContentContext(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (ctx) return ctx;
  const content = getContentSource().snapshot();
  return { content, repositories: createRepositories(content), ready: true };
}

export function useSiteContent(): SiteContent {
  return useContentContext().content;
}

export function useRepositories(): ContentRepositories {
  return useContentContext().repositories;
}

export function useProducts(options?: Parameters<ContentRepositories["products"]["list"]>[0]) {
  const { products } = useRepositories();
  return useMemo(() => products.list(options), [products, options]);
}

export function useCategories(options?: { onlyActive?: boolean }) {
  const { categories } = useRepositories();
  return useMemo(() => categories.list(options), [categories, options]);
}

export function usePortfolio(options?: { onlyVisible?: boolean; featured?: boolean }) {
  const { portfolio } = useRepositories();
  return useMemo(() => portfolio.list(options), [portfolio, options]);
}

export function useSiteSettings() {
  return useRepositories().settings.get();
}

export function useContactChannels(options?: { onlyVisible?: boolean }) {
  const { settings } = useRepositories();
  return useMemo(() => settings.contacts(options), [settings, options]);
}

export function useNavLinks(area: "header" | "footer") {
  const { settings } = useRepositories();
  return useMemo(() => settings.nav(area), [settings, area]);
}

export function useHomeContent() {
  return useRepositories().settings.home();
}

export function useHomeSections(options?: { onlyVisible?: boolean }) {
  const { settings } = useRepositories();
  return useMemo(() => settings.homeSections(options), [settings, options]);
}
