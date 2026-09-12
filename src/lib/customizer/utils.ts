/**
 * VinilArt Sport — Customizer Utilities
 *
 * Pure helper functions used by the editor components.
 * No DOM or canvas access — pure math and data transforms.
 */

import type {
  DesignLayer,
  ImageLayer,
  TextLayer,
  PrintArea,
  LayerId,
} from "./types";
import { nanoid } from "./nanoid";

// ---------------------------------------------------------------------------
// Mathematical Core: Fit & Alignment
// ---------------------------------------------------------------------------

export interface FitArtworkResult {
  x: number;          // top-left X
  y: number;          // top-left Y
  width: number;      // rendered width
  height: number;     // rendered height
  scaleX: number;     // 1
  scaleY: number;     // 1
  rotation: number;   // 0
  topLeftX: number;   // top-left X
  topLeftY: number;   // top-left Y
  scale: number;      // aspect ratio scale
}

export const DEFAULT_CONTAIN_SCALE = 0.85;

export function fitArtworkToPrintArea(
  imageWidth: number,
  imageHeight: number,
  printArea: PrintArea,
  canvasWidth: number,
  canvasHeight: number,
  mode: "contain" | "cover" = "contain",
  initialScaleFraction: number = DEFAULT_CONTAIN_SCALE,
): FitArtworkResult {
  const paX = printArea.xFraction * canvasWidth;
  const paY = printArea.yFraction * canvasHeight;
  const paW = printArea.widthFraction * canvasWidth;
  const paH = printArea.heightFraction * canvasHeight;

  // Se a largura/altura forem desconhecidas, assume SEMPRE 1:1 quadrado
  // NUNCA usar paW e paH como dimensões de imagem para não esticar logótipos
  const safeW = imageWidth > 0 ? imageWidth : (imageHeight > 0 ? imageHeight : 500);
  const safeH = imageHeight > 0 ? imageHeight : (imageWidth > 0 ? imageWidth : 500);

  const baseScale =
    mode === "cover"
      ? Math.max(paW / safeW, paH / safeH)
      : Math.min(paW / safeW, paH / safeH);

  const scale = baseScale * (initialScaleFraction > 0 ? initialScaleFraction : DEFAULT_CONTAIN_SCALE);

  const renderedWidth = safeW * scale;
  const renderedHeight = safeH * scale;

  const topLeftX = paX + (paW - renderedWidth) / 2;
  const topLeftY = paY + (paH - renderedHeight) / 2;

  return {
    x: topLeftX,
    y: topLeftY,
    width: renderedWidth,
    height: renderedHeight,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    topLeftX,
    topLeftY,
    scale,
  };
}

// ---------------------------------------------------------------------------
// Layer factories
// ---------------------------------------------------------------------------

export function createImageLayer(
  surfaceId: string,
  srcUrl: string,
  filename: string,
  naturalWidth: number,
  naturalHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  printArea: PrintArea,
  zIndex: number,
  initialScaleFraction: number = DEFAULT_CONTAIN_SCALE,
): ImageLayer {
  const fit = fitArtworkToPrintArea(
    naturalWidth,
    naturalHeight,
    printArea,
    canvasWidth,
    canvasHeight,
    "contain",
    initialScaleFraction,
  );

  return {
    id: nanoid(),
    type: "image",
    surfaceId,
    name: filename || "Imagem",
    x: fit.x,
    y: fit.y,
    scaleX: 1,
    scaleY: 1,
    rotation: fit.rotation,
    zIndex,
    visible: true,
    locked: false,
    srcUrl,
    filename,
    originalSrcUrl: srcUrl,
    isBackgroundRemoved: false,
    isViewingOriginal: false,
    isProcessingBg: false,
    naturalWidth,
    naturalHeight,
    width: fit.width,
    height: fit.height,
  };
}

export function createTextLayer(
  surfaceId: string,
  text: string,
  canvasWidth: number,
  canvasHeight: number,
  printArea: PrintArea,
  fill: string = "oklch(0.985 0 0)",
  fontSize: number = 36,
  fontFamily: string = "Archivo Black",
  zIndex: number = 10,
  customName?: string,
): TextLayer {
  const areaX = printArea.xFraction * canvasWidth;
  const areaY = printArea.yFraction * canvasHeight;
  const areaW = printArea.widthFraction * canvasWidth;
  const areaH = printArea.heightFraction * canvasHeight;

  const approxWidth = text.length * fontSize * 0.55;
  const x = Math.max(areaX + 10, areaX + (areaW - approxWidth) / 2);
  const y = areaY + (areaH - fontSize) / 2;

  return {
    id: nanoid(),
    type: "text",
    surfaceId,
    name: customName || text || "Texto",
    x,
    y,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    zIndex,
    visible: true,
    locked: false,
    text,
    fontSize,
    fontFamily,
    fill,
    fontStyle: "bold",
    align: "center",
    width: 0,
  };
}

// ---------------------------------------------------------------------------
// Smart Fit (Contain & Cover)
// ---------------------------------------------------------------------------

export function smartFitLayer(
  layer: ImageLayer,
  printArea: PrintArea,
  canvasWidth: number,
  canvasHeight: number,
): Partial<ImageLayer> {
  const natW = layer.naturalWidth > 0 ? layer.naturalWidth : layer.width;
  const natH = layer.naturalHeight > 0 ? layer.naturalHeight : layer.height;

  const fit = fitArtworkToPrintArea(
    natW,
    natH,
    printArea,
    canvasWidth,
    canvasHeight,
    "contain",
    DEFAULT_CONTAIN_SCALE,
  );

  return {
    x: fit.x,
    y: fit.y,
    width: fit.width,
    height: fit.height,
    scaleX: fit.scaleX,
    scaleY: fit.scaleY,
    rotation: fit.rotation,
  };
}

export function coverFitLayer(
  layer: ImageLayer,
  printArea: PrintArea,
  canvasWidth: number,
  canvasHeight: number,
): Partial<ImageLayer> {
  const natW = layer.naturalWidth > 0 ? layer.naturalWidth : layer.width;
  const natH = layer.naturalHeight > 0 ? layer.naturalHeight : layer.height;

  const fit = fitArtworkToPrintArea(
    natW,
    natH,
    printArea,
    canvasWidth,
    canvasHeight,
    "cover",
  );

  return {
    x: fit.x,
    y: fit.y,
    width: fit.width,
    height: fit.height,
    scaleX: fit.scaleX,
    scaleY: fit.scaleY,
    rotation: fit.rotation,
  };
}

export function sortedLayers(layers: DesignLayer[]): DesignLayer[] {
  return [...layers].sort((a, b) => a.zIndex - b.zIndex);
}

export function nextZIndex(layers: DesignLayer[]): number {
  if (layers.length === 0) return 1;
  return Math.max(...layers.map((l) => l.zIndex)) + 1;
}

export function toCssColor(value: string): string {
  return value;
}

export type SerializedDesign = {
  productId: string;
  surfaces: Record<
    string,
    {
      layers: Array<{
        type: "image" | "text";
        id: LayerId;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        zIndex: number;
        visible: boolean;
        srcUrl?: string;
        filename?: string;
        naturalWidth?: number;
        naturalHeight?: number;
        width?: number;
        height?: number;
        text?: string;
        fontSize?: number;
        fontFamily?: string;
        fill?: string;
        fontStyle?: string;
        align?: string;
      }>;
    }
  >;
};

export function serializeDesign(
  productId: string,
  surfaces: Record<string, { layers: DesignLayer[] }>,
): SerializedDesign {
  const out: SerializedDesign = { productId, surfaces: {} };
  for (const [id, surface] of Object.entries(surfaces)) {
    out.surfaces[id] = {
      layers: surface.layers.map((l) => ({
        type: l.type,
        id: l.id,
        x: l.x,
        y: l.y,
        scaleX: l.scaleX,
        scaleY: l.scaleY,
        rotation: l.rotation,
        zIndex: l.zIndex,
        visible: l.visible,
        ...(l.type === "image"
          ? {
              srcUrl: l.srcUrl,
              filename: l.filename,
              naturalWidth: l.naturalWidth,
              naturalHeight: l.naturalHeight,
              width: l.width,
              height: l.height,
            }
          : {
              text: l.text,
              fontSize: l.fontSize,
              fontFamily: l.fontFamily,
              fill: l.fill,
              fontStyle: l.fontStyle,
              align: l.align,
              width: l.width,
            }),
      })),
    };
  }
  return out;
}
