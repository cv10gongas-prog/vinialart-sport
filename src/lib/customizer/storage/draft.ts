/**
 * VinilArt Sport — Local Draft Persistence
 *
 * Saves and restores the complete customizer state using:
 *  - localStorage for the JSON state tree (with schema versioning)
 *  - IndexedDB for binary image blobs (so uploaded photos survive reload)
 */

import type { CustomizerState, DesignLayer, ImageLayer, TextLayer, SurfaceDesign } from "../types";
import { getImageBlob, saveImageBlob, clearAllImageBlobs } from "./db";

export const DRAFT_SCHEMA_VERSION = 1;
const DRAFT_STORAGE_PREFIX = "vinilart_sport_draft_v1_";

export interface StoredImageLayer extends Omit<ImageLayer, "srcUrl"> {
  srcUrl?: string;
}

export interface StoredDraftMeta {
  version: number;
  productId: string;
  activeSurfaceId: string;
  savedAt: number;
  surfaces: Record<string, {
    surfaceId: string;
    selectedLayerId: string | null;
    layers: (StoredImageLayer | TextLayer)[];
  }>;
}

function getStorageKey(productId: string): string {
  return `${DRAFT_STORAGE_PREFIX}${productId}`;
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
  }
}

/**
 * Loads and rehydrates draft state from localStorage + IndexedDB.
 * Creates fresh object URLs for restored images.
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

    const rehydratedSurfaces: Record<string, SurfaceDesign> = {};
    const createdUrls: string[] = [];

    for (const surfaceId of defaultSurfaceIds) {
      const storedSurface = parsed.surfaces[surfaceId];
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

          // Fetch blob from IndexedDB if fileKey exists
          if (imgLayer.fileKey) {
            try {
              const record = await getImageBlob(imgLayer.fileKey);
              if (record && record.blob) {
                blobUrl = URL.createObjectURL(record.blob);
                createdUrls.push(blobUrl);
              }
            } catch (err) {
              console.warn("Failed to load image blob from IndexedDB for key:", imgLayer.fileKey, err);
            }
          }

          if (!blobUrl) {
            // Placeholder SVG fallback so the layer isn't broken
            blobUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
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

          // Also rehydrate originalSrcUrl if originalFileKey exists
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

          // Also rehydrate processedSrcUrl if processedFileKey exists
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
        selectedLayerId: null, // Start with no selection for clean UI
      };
    }

    const defaultSurfaceId = defaultSurfaceIds[0] ?? "";
    const activeSurfaceId = parsed.activeSurfaceId || defaultSurfaceId;

    const restoredState: CustomizerState = {
      productId,
      activeSurfaceId,
      surfaces: rehydratedSurfaces,
      undoStack: [],
      redoStack: [],
    };

    return { state: restoredState, restoredObjectUrls: createdUrls };
  } catch (err) {
    console.error("Error loading customizer draft from storage:", err);
    return null;
  }
}

/**
 * Removes local draft for the product and purges IndexedDB images.
 */
export async function clearCustomizerDraft(productId: string): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(getStorageKey(productId));
    await clearAllImageBlobs();
  } catch (err) {
    console.error("Error clearing customizer draft:", err);
  }
}
