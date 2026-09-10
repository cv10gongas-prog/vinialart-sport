/**
 * VinilArt Sport — Image Processing Provider Abstraction
 *
 * Decoupled contract for background removal, subject detection, and intelligent fitting.
 * Enables zero frontend API keys now, local browser processing, and future seamless
 * plug-in of remote/cloud API providers without modifying customizer components.
 */

import type { ImageLayer, PrintArea, SubjectBoundingBox } from "../types";

export interface ProgressCallback {
  (percent: number, statusText?: string): void;
}

export interface RemoveBackgroundOptions {
  onProgress?: ProgressCallback;
}

export interface SubjectAnalysisResult {
  boundingBox: SubjectBoundingBox;
  hasAlpha: boolean;
  confidence: number;
}

export interface ImageProcessingProvider {
  readonly id: string;
  readonly name: string;
  readonly isLocal: boolean;

  /**
   * Removes background from the provided image Blob.
   * Returns a transparent PNG Blob.
   */
  removeBackground(
    imageBlob: Blob,
    options?: RemoveBackgroundOptions,
  ): Promise<Blob>;

  /**
   * Analyzes the image to detect the primary subject bounding box (foreground).
   */
  analyzeSubject(imageBlob: Blob): Promise<SubjectAnalysisResult>;

  /**
   * Computes intelligent positioning and scale adapted to the shin guard print area.
   */
  smartFit(
    layer: ImageLayer,
    printArea: PrintArea,
    canvasWidth: number,
    canvasHeight: number,
    subjectBox?: SubjectBoundingBox,
  ): Partial<ImageLayer>;
}
