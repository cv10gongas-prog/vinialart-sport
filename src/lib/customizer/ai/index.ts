/**
 * VinilArt Sport — AI / Image Processing Entry Point
 *
 * Exposes active provider instance and factory methods.
 */

import { BrowserImageProcessingProvider } from "./browser-provider";
import type { ImageProcessingProvider } from "./provider";

export * from "./provider";
export * from "./subject-analysis";
export * from "./browser-provider";

let defaultProvider: ImageProcessingProvider | null = null;

export function getImageProcessingProvider(): ImageProcessingProvider {
  if (!defaultProvider) {
    defaultProvider = new BrowserImageProcessingProvider();
  }
  return defaultProvider;
}

/**
 * Allows swapping the provider in the future (e.g. for RemoteApiImageProcessingProvider)
 */
export function setImageProcessingProvider(provider: ImageProcessingProvider): void {
  defaultProvider = provider;
}
