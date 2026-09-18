/**
 * VinilArt Sport — Resolver de assets (mockups / overlays).
 *
 * Os componentes e as configurações nunca devem importar `mockups.ts`
 * diretamente: pedem o asset por chave estável a este resolver. Quando as
 * imagens passarem a vir da Media Library do WordPress, basta implementar
 * `AssetSource` e trocar o resolver — nenhum componente muda.
 */

import {
  bottleShadeOverlay,
  capShadeOverlay,
  flagShadeOverlay,
  flagWhite,
  jerseyBackWhite,
  jerseyFrontWhite,
  jerseyShadeOverlay,
  mochilaShadeOverlay,
  printSurfaceWhite,
  sacoShadeOverlay,
  shinGuardBackWhite,
  shinGuardPairWhite,
  shinGuardShadeOverlay,
  shinGuardSingleWhite,
  shortsShadeOverlay,
  supporterItemWhite,
} from "@/lib/customizer/mockups";

/** Chaves estáveis dos mockups base (nunca dependem do nome do produto). */
export type MockupAssetKey =
  | "shin-guard-pair"
  | "shin-guard-single"
  | "shin-guard-back"
  | "jersey-front"
  | "jersey-back"
  | "flag"
  | "supporter-item"
  | "print-surface";

/** Chaves estáveis dos overlays de sombra/textura aplicados acima do design. */
export type OverlayAssetKey =
  | "shin-guard-shade"
  | "jersey-shade"
  | "flag-shade"
  | "bottle-shade"
  | "cap-shade"
  | "saco-shade"
  | "mochila-shade"
  | "shorts-shade";

export interface AssetSource {
  readonly id: string;
  mockup(key: MockupAssetKey): string;
  overlay(key: OverlayAssetKey): string;
}

const localMockups: Record<MockupAssetKey, string> = {
  "shin-guard-pair": shinGuardPairWhite,
  "shin-guard-single": shinGuardSingleWhite,
  "shin-guard-back": shinGuardBackWhite,
  "jersey-front": jerseyFrontWhite,
  "jersey-back": jerseyBackWhite,
  flag: flagWhite,
  "supporter-item": supporterItemWhite,
  "print-surface": printSurfaceWhite,
};

const localOverlays: Record<OverlayAssetKey, string> = {
  "shin-guard-shade": shinGuardShadeOverlay,
  "jersey-shade": jerseyShadeOverlay,
  "flag-shade": flagShadeOverlay,
  "bottle-shade": bottleShadeOverlay,
  "cap-shade": capShadeOverlay,
  "saco-shade": sacoShadeOverlay,
  "mochila-shade": mochilaShadeOverlay,
  "shorts-shade": shortsShadeOverlay,
};

export const localAssetSource: AssetSource = {
  id: "local-mockups",
  mockup: (key) => localMockups[key],
  overlay: (key) => localOverlays[key],
};

let assetSource: AssetSource = localAssetSource;

export function getAssetSource(): AssetSource {
  return assetSource;
}

/** Ponto único de troca para a futura Media Library do WordPress. */
export function setAssetSource(next: AssetSource): void {
  assetSource = next;
}

export function resolveMockupAsset(key: MockupAssetKey): string {
  return assetSource.mockup(key);
}

export function resolveOverlayAsset(
  key: OverlayAssetKey | undefined,
): string | undefined {
  return key ? assetSource.overlay(key) : undefined;
}
