/**
 * VinilArt Sport — AI / Image Processing Entry Point
 *
 * Exposes active provider instance and factory methods.
 *
 * Provider selection:
 *   - If VITE_USE_REMOTE_IMAGE_PROCESSING=true, uses RemoteImageProcessingProvider
 *     which calls the server endpoint and falls back to local processing automatically.
 *   - Otherwise uses BrowserImageProcessingProvider (local heuristic processing).
 *
 * IMPORTANT:
 *   BrowserImageProcessingProvider is a LOCAL HEURISTIC fallback.
 *   It does NOT use neural segmentation or ML models.
 *   "Remover fundo" via this provider uses canvas perimeter color sampling.
 *   A future Premium ML provider will be separate.
 */

import { BrowserImageProcessingProvider } from "./browser-provider";
import type { ImageProcessingProvider } from "./provider";

export * from "./provider";
export * from "./subject-analysis";
export * from "./browser-provider";

let defaultProvider: ImageProcessingProvider | null = null;

export function getImageProcessingProvider(): ImageProcessingProvider {
  if (!defaultProvider) {
    const useRemote =
      typeof import.meta !== "undefined" &&
      (import.meta as unknown as { env?: Record<string, string> }).env?.["VITE_USE_REMOTE_IMAGE_PROCESSING"] === "true";

    if (useRemote) {
      import("./remote-provider")
        .then(({ RemoteImageProcessingProvider }) => {
          defaultProvider = new RemoteImageProcessingProvider();
        })
        .catch(() => {
          defaultProvider = new BrowserImageProcessingProvider();
        });
    }

    defaultProvider = new BrowserImageProcessingProvider();
  }
  return defaultProvider;
}

export function setImageProcessingProvider(provider: ImageProcessingProvider): void {
  defaultProvider = provider;
}
