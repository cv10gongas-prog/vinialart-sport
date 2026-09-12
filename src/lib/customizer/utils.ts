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
// ID generation — imported from dedicated module
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Mathematical Core: Fit & Alignment
// ---------------------------------------------------------------------------

export interface FitArtworkResult {
  x: number;          // center X in canvas pixel space
  y: number;          // center Y in canvas pixel space
  width: number;      // rendered width in pixels
  height: number;     // rendered height in pixels
  scaleX: number;     // 1
  scaleY: number;     // 1
  rotation: number;   // 0
  topLeftX: number;   // top-left X in canvas pixel space
  topLeftY: number;   // top-left Y in canvas pixel space
  scale: number;      // aspect ratio scale factor
}

/**
 * Função matemática central única de fit para artworks no customizador:
 *
 * scale = mode === 'cover'
 *   ? max(printArea.width / imageWidth, printArea.height / imageHeight)
 *   : min(printArea.width / imageWidth, printArea.height / imageHeight);
 *
 * renderedWidth = imageWidth * scale;
 * renderedHeight = imageHeight * scale;
 *
 * topLeftX = printArea.x + (printArea.width - renderedWidth) / 2;
 * topLeftY = printArea.y + (printArea.height - renderedHeight) / 2;
 *
 * Center (Konva x,y com offsetX = renderedWidth / 2, offsetY = renderedHeight / 2):
 * centerX = printArea.x + printArea.width / 2;
 * centerY = printArea.y + printArea.height / 2;
 */
export function fitArtworkToPrintArea(
  imageWidth: number,
  imageHeight: number,
  printArea: PrintArea,
  canvasWidth: number,
  canvasHeight: number,
  mode: "contain" | "cover" = "contain",
  initialScaleFraction: number = 1.0,
): FitArtworkResult {
  const paX = printArea.xFraction * canvasWidth;
  const paY = printArea.yFraction * canvasHeight;
  const paW = printArea.widthFraction * canvasWidth;
  const paH = printArea.heightFraction * canvasHeight;

  const safeW = imageWidth > 0 ? imageWidth : paW;
  const safeH = imageHeight > 0 ? imageHeight : paH;

  const baseScale =
    mode === "cover"
      ? Math.max(paW / safeW, paH / safeH)
      : Math.min(paW / safeW, paH / safeH);

  // Apply initial scale fraction preserving proportional bounds
  const scale = baseScale * (initialScaleFraction > 0 ? initialScaleFraction : 1.0);

  const renderedWidth = safeW * scale;
  const renderedHeight = safeH * scale;

  const topLeftX = paX + (paW - renderedWidth) / 2;
  const topLeftY = paY + (paH - renderedHeight) / 2;

  // Centro geométrico exato da printArea
  const centerX = paX + paW / 2;
  const centerY = paY + paH / 2;

  return {
    x: centerX,
    y: centerY,
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
  initialScaleFraction: number = 0.50,
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
    scaleX: fit.scaleX,
    scaleY: fit.scaleY,
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
// Smart Fit (Contain & Cover) — pure aspect-ratio preserving transforms
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

// ---------------------------------------------------------------------------
// Layer sorting (by zIndex)
// ---------------------------------------------------------------------------

export function sortedLayers(layers: DesignLayer[]): DesignLayer[] {
  return [...layers].sort((a, b) => a.zIndex - b.zIndex);
}

// ---------------------------------------------------------------------------
// Maximum zIndex helper
// ---------------------------------------------------------------------------

export function nextZIndex(layers: DesignLayer[]): number {
  if (layers.length === 0) return 1;
  return Math.max(...layers.map((l) => l.zIndex)) + 1;
}

// ---------------------------------------------------------------------------
// CSS color → Konva-compatible hex or oklch string
// ---------------------------------------------------------------------------

export function toCssColor(value: string): string {
  return value;
}

// ---------------------------------------------------------------------------
// Serialization helpers
// ---------------------------------------------------------------------------

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
