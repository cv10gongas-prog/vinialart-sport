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
import { insetMask, isMaskEmpty, type AreaMask } from "./geometry/mask";

export interface ProductView {
  id: SurfaceId;
  label: string;
  order: number;
  surface: Surface;
  /** Limite real da personalização (contorno = recorte = validação). */
  maximumMask: AreaMask;
  /** Zona aconselhada, quando configurada. */
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

/** Máscara recomendada, se configurada. */
export function viewRecommendedMask(surface: Surface): AreaMask | undefined {
  if (surface.recommendedArea && !isMaskEmpty(surface.recommendedArea)) {
    return surface.recommendedArea;
  }
  return undefined;
}

/** Sugestão de zona recomendada a partir do limite máximo (para o futuro editor). */
export function suggestRecommendedMask(maximum: AreaMask, inset = 0.06): AreaMask {
  return insetMask(maximum, inset);
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
      recommendedMask: viewRecommendedMask(surface),
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
