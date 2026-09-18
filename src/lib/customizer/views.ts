/**
 * VinilArt Sport — Resolução de vistas do personalizador.
 *
 * O personalizador é universal: não sabe se está a tratar de um boné, de uma
 * caneleira ou de um equipamento. Tudo o que precisa vem da configuração do
 * produto (ProductCustomizerConfig) através deste módulo.
 */

import type {
  CustomizerPreviewLayout,
  ProductCustomizerConfig,
  Surface,
  SurfaceId,
} from "./types";
import { printAreaToMask } from "./geometry/legacy";
import { insetMask, isMaskEmpty, isMaskSubset, EMPTY_MASK, type AreaMask } from "./geometry/mask";

export interface ProductView {
  id: SurfaceId;
  label: string;
  order: number;
  surface: Surface;
  /** Limite real da personalização (contorno = recorte = validação). */
  maximumMask: AreaMask;
  /** Zona aconselhada, quando configurada e estritamente contida em maximumMask. */
  recommendedMask: AreaMask | undefined;
}

export const CUSTOMIZER_SCHEMA_VERSION = 1;

/** Máscara máxima de uma vista, derivada da configuração sem recalibrar nada. */
export function viewMaximumMask(
  surface: Surface,
  canvasWidth: number,
  canvasHeight: number,
): AreaMask {
  if (surface.maximumArea && !isMaskEmpty(surface.maximumArea)) {
    return surface.maximumArea;
  }
  return printAreaToMask(surface.printArea, canvasWidth, canvasHeight);
}

/**
 * Máscara recomendada da vista.
 * REGRA ABSOLUTA: recommendedArea ⊆ maximumArea.
 * Se uma zona recomendada configurada violar os limites máximos, é descartada
 * com segurança (retorna undefined) para não apresentar guias inválidas.
 */
export function viewRecommendedMask(
  surface: Surface,
  canvasWidth = 480,
  canvasHeight = 480,
): AreaMask | undefined {
  if (surface.recommendedArea && !isMaskEmpty(surface.recommendedArea)) {
    const maximum = viewMaximumMask(surface, canvasWidth, canvasHeight);
    if (isMaskSubset(surface.recommendedArea, maximum, canvasWidth, canvasHeight)) {
      return surface.recommendedArea;
    }
    return undefined;
  }
  return undefined;
}

/**
 * Sugestão de zona recomendada a partir do limite máximo (apoio ao futuro
 * editor de zonas no WordPress).
 *
 * REGRA ABSOLUTA: recommendedArea ⊆ maximumArea.
 * Qualquer ponto considerado válido pela zona recomendada tem obrigatoriamente
 * de ser válido em maximumArea. Se a geometria for demasiado complexa ou
 * côncava para garantir contenção segura 100%, devolve EMPTY_MASK (sem recomendada)
 * em vez de criar uma área inválida. maximumArea é soberana.
 */
export function suggestRecommendedMask(
  maximum: AreaMask,
  inset = 0.06,
  canvasWidth = 800,
  canvasHeight = 800,
): AreaMask {
  if (isMaskEmpty(maximum)) return EMPTY_MASK;
  const candidate = insetMask(maximum, inset);
  if (isMaskEmpty(candidate)) return EMPTY_MASK;

  if (!isMaskSubset(candidate, maximum, canvasWidth, canvasHeight)) {
    return EMPTY_MASK;
  }

  return candidate;
}

/** Vistas do produto, ordenadas pela configuração. */
export function resolveProductViews(config: ProductCustomizerConfig): ProductView[] {
  return config.surfaces
    .map((surface, index) => ({
      id: surface.id,
      label: surface.label,
      order: surface.order ?? index + 1,
      surface,
      maximumMask: viewMaximumMask(surface, config.canvasWidth, config.canvasHeight),
      recommendedMask: viewRecommendedMask(surface, config.canvasWidth, config.canvasHeight),
    }))
    .sort((a, b) => a.order - b.order);
}

export function findProductView(
  config: ProductCustomizerConfig,
  surfaceId: SurfaceId,
): ProductView | undefined {
  return resolveProductViews(config).find((view) => view.id === surfaceId);
}

/** Tamanhos disponíveis — configuração, nunca condições por nome de produto. */
export function getSizeOptions(config: ProductCustomizerConfig): string[] {
  const options = config.sizeOptions;
  if (options && options.length > 0) return options;
  return ["Tamanho Único"];
}

/** Cor base inicial — configuração por produto. */
export function getDefaultColor(config: ProductCustomizerConfig): string {
  return config.defaultColor ?? config.colorSwatches?.[0] ?? "#ffffff";
}

/** Composição da pré-visualização final. */
export function getPreviewLayout(
  config: ProductCustomizerConfig,
): CustomizerPreviewLayout {
  if (config.previewLayout) return config.previewLayout;
  if (config.surfaces.length >= 2) return "front-back";
  return "single";
}

export function isCustomizationEnabled(config: ProductCustomizerConfig): boolean {
  return config.enabled !== false && config.surfaces.length > 0;
}
