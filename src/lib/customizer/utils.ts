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
): ImageLayer {
  // Start the image at the print area centre, fitting comfortably inside with ~12% margin/padding
  const areaW = printArea.widthFraction * canvasWidth;
  const areaH = printArea.heightFraction * canvasHeight;
  const areaX = printArea.xFraction * canvasWidth;
  const areaY = printArea.yFraction * canvasHeight;

  // Use 86% of the available printable bounding box so new uploads don't abruptly touch edges
  const maxW = areaW * 0.86;
  const maxH = areaH * 0.86;

  // Fit within print area preserving aspect ratio
  const scale = Math.min(maxW / naturalWidth, maxH / naturalHeight, 1);
  const w = naturalWidth * scale;
  const h = naturalHeight * scale;

  // Centre in print area (Konva x = centre when offsetX = w/2)
  const x = areaX + areaW / 2;
  const y = areaY + areaH / 2;

  return {
    id: nanoid(),
    type: "image",
    surfaceId,
    name: filename || "Imagem",
    x,
    y,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
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
    width: w,
    height: h,
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

  // Initial estimate to place text comfortably near the center of the print area
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

/**
 * Ajustar à área: escala e centraliza preservando a proporção para caber 100% dentro da área útil.
 */
export function smartFitLayer(
  layer: ImageLayer,
  printArea: PrintArea,
  canvasWidth: number,
  canvasHeight: number,
): Partial<ImageLayer> {
  const areaW = printArea.widthFraction * canvasWidth;
  const areaH = printArea.heightFraction * canvasHeight;
  const areaX = printArea.xFraction * canvasWidth;
  const areaY = printArea.yFraction * canvasHeight;

  // Use natural source dimensions to guarantee true aspect ratio
  const natW = layer.naturalWidth > 0 ? layer.naturalWidth : layer.width;
  const natH = layer.naturalHeight > 0 ? layer.naturalHeight : layer.height;

  // Fit inside full print area preserving aspect ratio
  const fitScale = Math.min(areaW / natW, areaH / natH);
  const fittedW = natW * fitScale;
  const fittedH = natH * fitScale;

  // Place center of image exactly at center of print area
  const newX = areaX + areaW / 2;
  const newY = areaY + areaH / 2;

  return {
    x: newX,
    y: newY,
    width: fittedW,
    height: fittedH,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
  };
}

/**
 * Preencher área: expande a imagem mantendo a proporção para cobrir toda a área imprimível.
 */
export function coverFitLayer(
  layer: ImageLayer,
  printArea: PrintArea,
  canvasWidth: number,
  canvasHeight: number,
): Partial<ImageLayer> {
  const areaW = printArea.widthFraction * canvasWidth;
  const areaH = printArea.heightFraction * canvasHeight;
  const areaX = printArea.xFraction * canvasWidth;
  const areaY = printArea.yFraction * canvasHeight;

  const natW = layer.naturalWidth > 0 ? layer.naturalWidth : layer.width;
  const natH = layer.naturalHeight > 0 ? layer.naturalHeight : layer.height;

  // Cover entire area: Math.max ensures entire printArea is covered
  const coverScale = Math.max(areaW / natW, areaH / natH);
  const coveredW = natW * coverScale;
  const coveredH = natH * coverScale;

  const newX = areaX + areaW / 2;
  const newY = areaY + areaH / 2;

  return {
    x: newX,
    y: newY,
    width: coveredW,
    height: coveredH,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
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

/**
 * Konva uses canvas fillStyle which supports modern CSS colors including oklch.
 * We pass the oklch values directly — modern browsers handle it fine.
 */
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
        // image-specific
        srcUrl?: string;
        filename?: string;
        naturalWidth?: number;
        naturalHeight?: number;
        width?: number;
        height?: number;
        // text-specific
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

/**
 * Export a human-readable JSON snapshot of the design.
 * Note: srcUrl contains blob: URLs that are session-only.
 * For persistent storage, replace srcUrl with a server upload URL first.
 */
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
