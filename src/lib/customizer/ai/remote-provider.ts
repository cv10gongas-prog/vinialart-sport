/**
 * VinilArt Sport — Remote Image Processing Provider
 *
 * Calls server-side API endpoints for Premium background removal and subject analysis.
 * Falls back automatically to BrowserImageProcessingProvider when:
 *  - The server endpoint returns 503 (no API key configured)
 *  - Network error occurs
 *  - Any unexpected failure
 *
 * API keys are NEVER exposed to the client bundle.
 * See src/server/api/image-processing/remove-background.ts for the server endpoint.
 */

import type {
  ImageProcessingProvider,
  RemoveBackgroundOptions,
  SubjectAnalysisResult,
} from "./provider";
import type { ImageLayer, PrintArea, SubjectBoundingBox } from "../types";
import { BrowserImageProcessingProvider } from "./browser-provider";

/** Maximum file size accepted by the server endpoint: 10 MB */
const MAX_FILE_BYTES = 10 * 1024 * 1024;

/** MIME types accepted by the server endpoint */
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export class RemoteImageProcessingProvider implements ImageProcessingProvider {
  readonly id = "remote-api";
  readonly name = "Processamento Remoto (Cloud AI / Local Fallback)";
  readonly isLocal = false;

  private readonly fallback = new BrowserImageProcessingProvider();
  /** Whether a previous remote call has already confirmed the endpoint is unavailable */
  private remoteUnavailable = false;

  async removeBackground(
    imageBlob: Blob,
    options?: RemoveBackgroundOptions,
  ): Promise<Blob> {
    if (this.remoteUnavailable || !ACCEPTED_TYPES.has(imageBlob.type) || imageBlob.size > MAX_FILE_BYTES) {
      return this.fallback.removeBackground(imageBlob, options);
    }

    try {
      options?.onProgress?.(10, "A enviar imagem…");

      const form = new FormData();
      form.append("file", imageBlob, "image");

      const response = await fetch("/api/image-processing/remove-background", {
        method: "POST",
        body: form,
      });

      if (response.status === 503) {
        // Server endpoint not configured — silently switch to local processing
        this.remoteUnavailable = true;
        return this.fallback.removeBackground(imageBlob, options);
      }

      if (!response.ok) {
        throw new Error(`Servidor retornou ${response.status}`);
      }

      options?.onProgress?.(80, "A processar…");
      const resultBlob = await response.blob();
      options?.onProgress?.(100, "Concluído");
      return resultBlob;
    } catch {
      // Network error or unexpected failure — fall back to local processing
      return this.fallback.removeBackground(imageBlob, options);
    }
  }

  async analyzeSubject(imageBlob: Blob): Promise<SubjectAnalysisResult> {
    // Subject analysis currently always uses local heuristics.
    return this.fallback.analyzeSubject(imageBlob);
  }

  smartFit(
    layer: ImageLayer,
    printArea: PrintArea,
    canvasWidth: number,
    canvasHeight: number,
    subjectBox?: SubjectBoundingBox,
  ): Partial<ImageLayer> {
    return this.fallback.smartFit(layer, printArea, canvasWidth, canvasHeight, subjectBox);
  }

  /** Returns true if the remote endpoint appears to be configured and reachable. */
  get isRemoteAvailable(): boolean {
    return !this.remoteUnavailable;
  }
}
