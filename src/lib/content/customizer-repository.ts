/**
 * VinilArt Sport — Repositório das configurações do personalizador.
 *
 * A interface é a mesma quer os dados venham dos ficheiros locais (agora) quer
 * venham da WordPress REST API (mais tarde). O React nunca fala diretamente com
 * a origem dos dados.
 */

import {
  getProductCustomizerConfig,
  productCustomizerConfigs,
} from "@/lib/customizer/configs";
import type { ProductCustomizerConfig } from "@/lib/customizer/types";
import {
  parseCustomizerConfig,
  serializeCustomizerConfig,
  type CustomizerConfigPayload,
} from "@/lib/customizer/wp/config-schema";

export interface CustomizerRepository {
  /** Todas as configurações disponíveis. */
  list(): ProductCustomizerConfig[];
  /** Configuração de um produto (identificador estável do produto). */
  getByProductId(productId: string): ProductCustomizerConfig | undefined;
  /** Payload JSON pronto para leitura/escrita pela WordPress REST API. */
  exportPayload(productId: string): CustomizerConfigPayload | undefined;
  /** Aceita um payload externo (WordPress) e devolve a configuração interna. */
  importPayload(payload: unknown): ProductCustomizerConfig;
}

export const localCustomizerRepository: CustomizerRepository = {
  list() {
    return Object.values(productCustomizerConfigs);
  },
  getByProductId(productId) {
    return getProductCustomizerConfig(productId);
  },
  exportPayload(productId) {
    const config = getProductCustomizerConfig(productId);
    return config ? serializeCustomizerConfig(config) : undefined;
  },
  importPayload(payload) {
    return parseCustomizerConfig(payload);
  },
};

let activeRepository: CustomizerRepository = localCustomizerRepository;

export function getCustomizerRepository(): CustomizerRepository {
  return activeRepository;
}

/** Ponto único de troca para o adaptador WordPress. */
export function setCustomizerRepository(repository: CustomizerRepository): void {
  activeRepository = repository;
}
