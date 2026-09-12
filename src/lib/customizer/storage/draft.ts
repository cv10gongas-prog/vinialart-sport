/**
 * VinilArt Sport — Local Draft Persistence
 *
 * Saves and restores the complete customizer state using:
 *  - localStorage for the JSON state tree (with schema versioning)
 *  - IndexedDB for binary image blobs (so uploaded photos survive reload)
 */

import type { CustomizerState, DesignLayer, ImageLayer, TextLayer, SurfaceDesign } from "../types";
import { getImageBlob, saveImageBlob, deleteImageBlob } from "./db";

export const DRAFT_SCHEMA_VERSION = 1;
const DRAFT_STORAGE_PREFIX = "vinilart_sport_draft_v1_";
const CART_STORAGE_KEY = "vinilart_sport_cart_v1";

export interface StoredImageLayer extends Omit<ImageLayer, "srcUrl"> {
  srcUrl?: string;
}

export interface StoredDraftMeta {
  version: number;
  productId: string;
  activeSurfaceId: string;
  savedAt: number;
  surfaces: Record<
    string,
    {
      surfaceId: string;
      selectedLayerId: string | null;
      layers: (StoredImageLayer | TextLayer)[];
    }
  >;
}

function getStorageKey(productId: string): string {
  return `${DRAFT_STORAGE_PREFIX}${productId}`;
}

/**
 * Extracts all file keys referenced across any saved cart items.
 */
function getCartReferencedFileKeys(): Set<string> {
  const keys = new Set<string>();
  if (typeof window === "undefined") return keys;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return keys;
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) return keys;

    for (const item of items) {
      if (!item.customizerDesign) continue;
      try {
        const design: StoredDraftMeta = JSON.parse(item.customizerDesign);
        if (!design.surfaces) continue;
        for (const surf of Object.values(design.surfaces)) {
          for (const layer of surf.layers) {
            if (layer.type === "image") {
              const img = layer as StoredImageLayer;
              if (img.fileKey) keys.add(img.fileKey);
              if (img.originalFileKey) keys.add(img.originalFileKey);
              if (img.processedFileKey) keys.add(img.processedFileKey);
            }
          }
        }
      } catch {
        // Skip invalid item
      }
    }
  } catch {
    // Ignore error
  }
  return keys;
}

/**
 * Persists customizer state to localStorage and ensures all ImageLayers have their blobs in IndexedDB.
 */
export async function saveCustomizerDraft(
  productId: string,
  state: CustomizerState,
  imageBlobsMap?: Map<string, { blob: Blob; filename: string }>,
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    // If any new image blobs were passed in, ensure they are stored in IndexedDB
    if (imageBlobsMap && imageBlobsMap.size > 0) {
      for (const [fileKey, item] of imageBlobsMap.entries()) {
        try {
          await saveImageBlob(fileKey, item.blob, item.filename);
        } catch (e) {
          console.warn("Failed to persist image blob to IndexedDB:", e);
        }
      }
    }

    // Build serializable draft (exclude transient object URLs to avoid stale references)
    const surfacesPayload: StoredDraftMeta["surfaces"] = {};

    for (const [surfaceId, surface] of Object.entries(state.surfaces)) {
      surfacesPayload[surfaceId] = {
        surfaceId,
        selectedLayerId: surface.selectedLayerId,
        layers: surface.layers.map((layer) => {
          if (layer.type === "image") {
            const { srcUrl: _, ...rest } = layer;
            return rest as StoredImageLayer;
          }
          return layer;
        }),
      };
    }

    const payload: StoredDraftMeta = {
      version: DRAFT_SCHEMA_VERSION,
      productId,
      activeSurfaceId: state.activeSurfaceId,
      savedAt: Date.now(),
      surfaces: surfacesPayload,
    };

    window.localStorage.setItem(getStorageKey(productId), JSON.stringify(payload));
  } catch (err) {
    console.error("Error saving customizer draft to storage:", err);
    throw err;
  }
}

/**
 * Serializes customizer state into a clean, portable JSON string for cart storage.
 */
export function serializeCustomizerDesign(state: CustomizerState): string {
  const surfacesPayload: StoredDraftMeta["surfaces"] = {};

  for (const [surfaceId, surface] of Object.entries(state.surfaces)) {
    surfacesPayload[surfaceId] = {
      surfaceId,
      selectedLayerId: surface.selectedLayerId,
      layers: surface.layers.map((layer) => {
        if (layer.type === "image") {
          const { srcUrl: _, ...rest } = layer;
          return rest as StoredImageLayer;
        }
        return layer;
      }),
    };
  }

  const payload: StoredDraftMeta = {
    version: DRAFT_SCHEMA_VERSION,
    productId: state.productId,
    activeSurfaceId: state.activeSurfaceId,
    savedAt: Date.now(),
    surfaces: surfacesPayload,
  };

  return JSON.stringify(payload);
}

/**
 * Rehydrates a CustomizerState from a stored meta payload (from draft or CartItem).
 */
export async function rehydrateStoredDesign(
  meta: StoredDraftMeta,
  defaultSurfaceIds: string[],
): Promise<{ state: CustomizerState; restoredObjectUrls: string[] }> {
  const rehydratedSurfaces: Record<string, SurfaceDesign> = {};
  const createdUrls: string[] = [];

  for (const surfaceId of defaultSurfaceIds) {
    const storedSurface = meta.surfaces[surfaceId];
    if (!storedSurface) {
      rehydratedSurfaces[surfaceId] = {
        surfaceId,
        layers: [],
        selectedLayerId: null,
      };
      continue;
    }

    const rehydratedLayers: DesignLayer[] = [];

    for (const rawLayer of storedSurface.layers) {
      if (rawLayer.type === "image") {
        const imgLayer = rawLayer as StoredImageLayer;
        let blobUrl = "";

        if (imgLayer.fileKey) {
          try {
            const record = await getImageBlob(imgLayer.fileKey);
            if (record && record.blob) {
              blobUrl = URL.createObjectURL(record.blob);
              createdUrls.push(blobUrl);
            }
          } catch (err) {
            console.warn(
              "Failed to load image blob from IndexedDB for key:",
              imgLayer.fileKey,
              err,
            );
          }
        }

        if (!blobUrl) {
          blobUrl =
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
              <rect width="200" height="200" fill="#222" />
              <text x="50%" y="50%" fill="#888" font-size="14" text-anchor="middle" dy=".3em">Imagem</text>
            </svg>
          `);
        }

        const restoredImg: ImageLayer = {
          ...imgLayer,
          srcUrl: blobUrl,
          visible: imgLayer.visible !== false,
          locked: Boolean(imgLayer.locked),
          isBackgroundRemoved: Boolean(imgLayer.isBackgroundRemoved),
          isViewingOriginal: false,
          isProcessingBg: false,
        };

        if (imgLayer.originalFileKey && imgLayer.originalFileKey !== imgLayer.fileKey) {
          try {
            const origRecord = await getImageBlob(imgLayer.originalFileKey);
            if (origRecord && origRecord.blob) {
              const origUrl = URL.createObjectURL(origRecord.blob);
              createdUrls.push(origUrl);
              restoredImg.originalSrcUrl = origUrl;
            }
          } catch (e) {
            console.warn("Failed to load original image blob:", e);
          }
        } else if (imgLayer.originalFileKey === imgLayer.fileKey) {
          restoredImg.originalSrcUrl = blobUrl;
        }

        if (imgLayer.processedFileKey) {
          try {
            const procRecord = await getImageBlob(imgLayer.processedFileKey);
            if (procRecord && procRecord.blob) {
              const procUrl = URL.createObjectURL(procRecord.blob);
              createdUrls.push(procUrl);
              restoredImg.processedSrcUrl = procUrl;
            }
          } catch (e) {
            console.warn("Failed to load processed image blob:", e);
          }
        }

        rehydratedLayers.push(restoredImg);
      } else {
        const textLayer = rawLayer as TextLayer;
        const restoredText: TextLayer = {
          ...textLayer,
          visible: textLayer.visible !== false,
          locked: Boolean(textLayer.locked),
        };
        rehydratedLayers.push(restoredText);
      }
    }

    rehydratedSurfaces[surfaceId] = {
      surfaceId,
      layers: rehydratedLayers,
      selectedLayerId: null,
    };
  }

  const defaultSurfaceId = defaultSurfaceIds[0] ?? "";
  const activeSurfaceId = meta.activeSurfaceId || defaultSurfaceId;

  const restoredState: CustomizerState = {
    productId: meta.productId,
    activeSurfaceId,
    surfaces: rehydratedSurfaces,
    undoStack: [],
    redoStack: [],
  };

  return { state: restoredState, restoredObjectUrls: createdUrls };
}

/**
 * Loads and rehydrates draft state from localStorage + IndexedDB.
 */
export async function loadCustomizerDraft(
  productId: string,
  defaultSurfaceIds: string[],
): Promise<{ state: CustomizerState; restoredObjectUrls: string[] } | null> {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(getStorageKey(productId));
    if (!raw) return null;

    const parsed: StoredDraftMeta = JSON.parse(raw);
    if (!parsed || parsed.version !== DRAFT_SCHEMA_VERSION || parsed.productId !== productId) {
      return null;
    }

    return rehydrateStoredDesign(parsed, defaultSurfaceIds);
  } catch (err) {
    console.error("Error loading customizer draft from storage:", err);
    return null;
  }
}

/**
 * Removes local draft for the product and safely purges only unreferenced IndexedDB images.
 * Protects images referenced by cart items so the cart never suffers broken images.
 */
export async function clearCustomizerDraft(productId: string): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(getStorageKey(productId));
    window.localStorage.removeItem(getStorageKey(productId));

    if (raw) {
      try {
        const parsed: StoredDraftMeta = JSON.parse(raw);
        const protectedKeys = getCartReferencedFileKeys();

        // Check each image in the draft
        if (parsed.surfaces) {
          for (const surf of Object.values(parsed.surfaces)) {
            for (const layer of surf.layers) {
              if (layer.type === "image") {
                const img = layer as StoredImageLayer;
                const keysToCheck = [img.fileKey, img.originalFileKey, img.processedFileKey].filter(
                  Boolean,
                ) as string[];
                for (const k of keysToCheck) {
                  // Only delete if NOT referenced by any item in the cart!
                  if (!protectedKeys.has(k)) {
                    await deleteImageBlob(k);
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        console.warn("Failed to selectively clean draft images:", e);
      }
    }
  } catch (err) {
    console.error("Error clearing customizer draft:", err);
  }
}
