/**
 * VinilArt Sport — Subject Detection & Intelligent Fitting
 *
 * Real subject saliency detection running client-side using HTML5 Canvas & ImageData.
 * Works natively on any image format (JPG, PNG, WEBP) without downloading heavy weights.
 *
 * Algorithm:
 * 1. Downsamples image to an analysis grid (max 256x256)
 * 2. If alpha channel has variations (PNG/WEBP transparent), builds bounding box directly from non-zero alpha pixels.
 * 3. If image is opaque (JPG/PNG without alpha):
 *    - Samples peripheral border pixels (top, bottom, left, right edges) to estimate background color distribution.
 *    - Computes color difference (Euclidean deltaE in RGB/Luma space) for every pixel.
 *    - Discards background-like regions and computes the bounding box and centroid of the foreground subject.
 *    - Detects vertical visual weight to estimate face/head versus body for portrait images.
 * 4. Smart fit adapts scale and position to the anatomical shin guard print area:
 *    - Caneleiras are wider at the top and narrow at the ankle.
 *    - High-vertical subjects (people) are scaled so the head/upper body stays safely in the upper-mid area.
 *    - Logos/graphics are centered with safe padding to prevent clipping.
 */

import type { ImageLayer, PrintArea, SubjectBoundingBox } from "../types";
import type { SubjectAnalysisResult } from "./provider";

export async function analyzeImageBlob(imageBlob: Blob): Promise<SubjectAnalysisResult> {
  const img = await loadImageElement(imageBlob);
  const { naturalWidth: origW, naturalHeight: origH } = img;

  // Downsample to max 256 for fast, non-blocking analysis
  const maxDim = 256;
  const scale = Math.min(1, maxDim / Math.max(origW, origH));
  const w = Math.max(16, Math.round(origW * scale));
  const h = Math.max(16, Math.round(origH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return fallbackResult();
  }

  ctx.drawImage(img, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // 1. Check if image already has meaningful alpha transparency (e.g. PNG / WEBP)
  let hasTransparentPixels = false;
  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  let alphaCount = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const a = data[idx + 3] ?? 255;
      if (a < 240) {
        hasTransparentPixels = true;
      }
      if (a > 20) {
        alphaCount++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (hasTransparentPixels && alphaCount > 10 && minX <= maxX && minY <= maxY) {
    const box: SubjectBoundingBox = {
      x: minX / w,
      y: minY / h,
      width: (maxX - minX + 1) / w,
      height: (maxY - minY + 1) / h,
      focusPoint: {
        x: (minX + maxX) / (2 * w),
        y: (minY + maxY) / (2 * h),
      },
    };
    return {
      boundingBox: box,
      hasAlpha: true,
      confidence: 0.95,
    };
  }

  // 2. Opaque image: estimate background from border sampling
  // Sample 4 border strips (3 pixels deep)
  let bgR = 0, bgG = 0, bgB = 0, sampleCount = 0;
  function samplePixel(px: number, py: number) {
    const idx = (py * w + px) * 4;
    bgR += data[idx] ?? 0;
    bgG += data[idx + 1] ?? 0;
    bgB += data[idx + 2] ?? 0;
    sampleCount++;
  }

  for (let x = 0; x < w; x++) {
    samplePixel(x, 0);
    samplePixel(x, h - 1);
    if (h > 4) {
      samplePixel(x, 1);
      samplePixel(x, h - 2);
    }
  }
  for (let y = 0; y < h; y++) {
    samplePixel(0, y);
    samplePixel(w - 1, y);
    if (w > 4) {
      samplePixel(1, y);
      samplePixel(w - 2, y);
    }
  }

  bgR = sampleCount > 0 ? bgR / sampleCount : 255;
  bgG = sampleCount > 0 ? bgG / sampleCount : 255;
  bgB = sampleCount > 0 ? bgB / sampleCount : 255;

  // Foreground mask via color distance threshold
  const threshold = 38; // Distance threshold in RGB
  let fgMinX = w;
  let fgMinY = h;
  let fgMaxX = 0;
  let fgMaxY = 0;
  let fgCount = 0;

  let sumX = 0;
  let sumY = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx] ?? 0;
      const g = data[idx + 1] ?? 0;
      const b = data[idx + 2] ?? 0;

      const diff = Math.hypot(r - bgR, g - bgG, b - bgB);
      if (diff > threshold) {
        fgCount++;
        sumX += x;
        sumY += y;
        if (x < fgMinX) fgMinX = x;
        if (x > fgMaxX) fgMaxX = x;
        if (y < fgMinY) fgMinY = y;
        if (y > fgMaxY) fgMaxY = y;
      }
    }
  }

  // If foreground detected with reasonable density
  const totalPixels = w * h;
  const fgRatio = fgCount / totalPixels;

  if (fgRatio > 0.05 && fgRatio < 0.95 && fgMinX <= fgMaxX && fgMinY <= fgMaxY) {
    const focusX = fgCount > 0 ? sumX / fgCount / w : 0.5;
    const focusY = fgCount > 0 ? sumY / fgCount / h : 0.5;

    // For vertical portrait images, head/face is typically in the upper 35% of the foreground box
    const boxH = (fgMaxY - fgMinY + 1) / h;
    const boxY = fgMinY / h;
    const estimatedFaceY = boxH > 0.4 ? boxY + boxH * 0.25 : focusY;

    return {
      boundingBox: {
        x: Math.max(0, fgMinX / w),
        y: Math.max(0, fgMinY / h),
        width: Math.min(1, (fgMaxX - fgMinX + 1) / w),
        height: Math.min(1, (fgMaxY - fgMinY + 1) / h),
        focusPoint: {
          x: focusX,
          y: estimatedFaceY,
        },
      },
      hasAlpha: false,
      confidence: 0.85,
    };
  }

  return fallbackResult();
}

function fallbackResult(): SubjectAnalysisResult {
  return {
    boundingBox: {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      focusPoint: { x: 0.5, y: 0.5 },
    },
    hasAlpha: false,
    confidence: 0.5,
  };
}

/**
 * Intelligent fitting algorithm.
 * Adapts position and scale specifically to the shin guard print area.
 */
export function computeIntelligentFit(
  layer: ImageLayer,
  printArea: PrintArea,
  canvasWidth: number,
  canvasHeight: number,
  subjectBox?: SubjectBoundingBox,
): Partial<ImageLayer> {
  const areaW = printArea.widthFraction * canvasWidth;
  const areaH = printArea.heightFraction * canvasHeight;
  const areaX = printArea.xFraction * canvasWidth;
  const areaY = printArea.yFraction * canvasHeight;

  const natW = layer.naturalWidth > 0 ? layer.naturalWidth : layer.width;
  const natH = layer.naturalHeight > 0 ? layer.naturalHeight : layer.height;
  const aspectRatio = natW / natH;

  const box = subjectBox ?? layer.subjectBoundingBox ?? {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    focusPoint: { x: 0.5, y: 0.5 },
  };

  // Subject dimensions in natural pixels
  const subjectW = Math.max(10, box.width * natW);
  const subjectH = Math.max(10, box.height * natH);
  const isPortrait = natH > natW * 1.15;

  let finalScale: number;
  let targetX: number;
  let targetY: number;

  if (isPortrait) {
    // 1. Portrait / Person photo:
    // Scale so the subject fills ~85% of the print area height or fits safely within area width.
    const scaleByH = (areaH * 0.90) / natH;
    const scaleBySubjectW = (areaW * 0.88) / subjectW;
    finalScale = Math.min(scaleByH, scaleBySubjectW);

    const fittedW = natW * finalScale;
    const fittedH = natH * finalScale;

    // Horizontal: center the subject focus point in the horizontal center of the print area
    const focusNormX = box.focusPoint?.x ?? 0.5;
    const subjectCenterXOnCanvas = areaX + areaW / 2;
    // Calculate layer origin so that (layer.x - fittedW/2) + focusNormX * fittedW == subjectCenterXOnCanvas
    targetX = subjectCenterXOnCanvas + (0.5 - focusNormX) * fittedW;

    // Vertical: place the head/face in the top 28% of the print area (shin guard is wide at the top)
    const focusNormY = box.focusPoint?.y ?? 0.35;
    const desirableHeadY = areaY + areaH * 0.28;
    targetY = desirableHeadY + (0.5 - focusNormY) * fittedH;

    // Clamp vertical position so the top of the subject does not get clipped outside the print area
    const topSubjectY = targetY - fittedH / 2 + box.y * fittedH;
    if (topSubjectY < areaY + 8) {
      targetY += (areaY + 8 - topSubjectY);
    }
  } else {
    // 2. Landscape or square image / Logo / Graphic:
    // Scale so entire subject fits safely with 10% breathing room
    const scaleW = (areaW * 0.88) / subjectW;
    const scaleH = (areaH * 0.88) / subjectH;
    finalScale = Math.min(scaleW, scaleH);

    const fittedW = natW * finalScale;
    const fittedH = natH * finalScale;

    // Center in the upper-middle zone of the shin guard for optimal balance
    targetX = areaX + areaW / 2;
    targetY = areaY + areaH * 0.46;
  }

  const fittedW = natW * finalScale;
  const fittedH = natH * finalScale;

  return {
    x: Math.round(targetX),
    y: Math.round(targetY),
    width: Math.round(fittedW),
    height: Math.round(fittedH),
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
  };
}

function loadImageElement(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for subject analysis"));
    };
    img.src = url;
  });
}
