/**
 * VinilArt Sport — Product Customizer Hook
 *
 * Central hook that wires together:
 *  - Reducer state management with discrete undo/redo
 *  - Layer creation helpers
 *  - Blob URL lifecycle management (revokes on unmount without breaking undo/redo)
 *  - Konva stage ref
 *  - Clean PNG export (stripping UI guides, masks and transformers)
 */

import { useReducer, useRef, useCallback, useEffect, useState } from "react";
import type Konva from "konva";
import type {
  ProductCustomizerConfig,
  SurfaceId,
  DesignLayer,
  ImageLayer,
  LayerReorderDirection,
} from "@/lib/customizer/types";
import {
  customizerReducer,
  createInitialState,
} from "@/lib/customizer/reducer";
import {
  createImageLayer,
  createTextLayer,
  smartFitLayer,
  coverFitLayer,
  nextZIndex,
} from "@/lib/customizer/utils";
import {
  saveCustomizerDraft,
  loadCustomizerDraft,
  clearCustomizerDraft,
  rehydrateStoredDesign,
  serializeCustomizerDesign,
} from "@/lib/customizer/storage/draft";
import { getImageBlob, saveImageBlob } from "@/lib/customizer/storage/db";
import { getImageProcessingProvider } from "@/lib/customizer/ai";
import { nanoid } from "@/lib/customizer/nanoid";

export type DraftSaveStatus = "idle" | "saving" | "saved";

export interface UseProductCustomizerOptions {
  initialDesignJson?: string | undefined;
}

export function useProductCustomizer(
  config: ProductCustomizerConfig,
  options?: UseProductCustomizerOptions,
) {
  const defaultSurfaceId = config.surfaces[0]?.id ?? "";

  const [state, dispatch] = useReducer(
    customizerReducer,
    undefined,
    () =>
      createInitialState(
        config.id,
        config.surfaces.map((s) => s.id),
        defaultSurfaceId,
      ),
  );

  // Ref to the Konva stage — set by the canvas component
  const stageRef = useRef<Konva.Stage | null>(null);

  // Track all local blob URLs created in this session for cleanup on unmount
  const blobUrlsRef = useRef<Set<string>>(new Set());

  // Map of fileKey -> { blob, filename } for pending IndexedDB persists
  const pendingBlobsRef = useRef<Map<string, { blob: Blob; filename: string }>>(new Map());

  // Draft persistence status: "saved" | "saving" | "idle"
  const [saveStatus, setSaveStatus] = useState<DraftSaveStatus>("idle");
  const hasInitializedDraftRef = useRef(false);

  // View Mode: "edit" (shows guides, transformer, bounds) vs "preview" (clean realistic product display)
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  // Viewport Zoom: scales the display stage without altering layer transformations (scaleX, scaleY, x, y)
  const [zoom, setZoom] = useState<number>(1);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(2.0, Math.round((z + 0.15) * 100) / 100));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(0.6, Math.round((z - 0.15) * 100) / 100));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  // ------------------------------------------------------------------
  // Rehydrate draft from storage on mount (or from cart item if provided)
  // ------------------------------------------------------------------
  useEffect(() => {
    let active = true;
    async function initDraft() {
      try {
        if (options?.initialDesignJson) {
          const parsed = JSON.parse(options.initialDesignJson);
          const result = await rehydrateStoredDesign(
            parsed,
            config.surfaces.map((s) => s.id),
          );
          if (active && result) {
            result.restoredObjectUrls.forEach((url) => blobUrlsRef.current.add(url));
            dispatch({ type: "RESTORE_DRAFT", state: result.state });
            setSaveStatus("saved");
            return;
          }
        }

        const result = await loadCustomizerDraft(
          config.id,
          config.surfaces.map((s) => s.id),
        );
        if (active && result) {
          result.restoredObjectUrls.forEach((url) => blobUrlsRef.current.add(url));
          dispatch({ type: "RESTORE_DRAFT", state: result.state });
          setSaveStatus("saved");
        }
      } catch (err) {
        console.warn("Failed to load customizer draft:", err);
      } finally {
        if (active) {
          hasInitializedDraftRef.current = true;
        }
      }
    }
    initDraft();
    return () => {
      active = false;
    };
  }, [config.id, config.surfaces, options?.initialDesignJson]);

  // ------------------------------------------------------------------
  // Auto-save debounce effect
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!hasInitializedDraftRef.current) return;

    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      try {
        await saveCustomizerDraft(config.id, state, pendingBlobsRef.current);
        pendingBlobsRef.current.clear();
        setSaveStatus("saved");
      } catch (err) {
        console.error("Auto-save failed:", err);
        setSaveStatus("idle");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [state, config.id]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    const urls = blobUrlsRef.current;
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      });
      urls.clear();
    };
  }, []);

  // ------------------------------------------------------------------
  // Computed helpers
  // ------------------------------------------------------------------

  const activeSurface =
    config.surfaces.find((s) => s.id === state.activeSurfaceId) ?? config.surfaces[0]!;

  const activeSurfaceDesign =
    state.surfaces[state.activeSurfaceId] ?? {
      surfaceId: state.activeSurfaceId,
      layers: [],
      selectedLayerId: null,
    };

  const activeLayers = activeSurfaceDesign.layers;

  const selectedLayer: DesignLayer | null =
    activeLayers.find((l) => l.id === activeSurfaceDesign.selectedLayerId) ?? null;

  const canUndo = state.undoStack.length > 0;
  const canRedo = state.redoStack.length > 0;

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------

  /** Allowed MIME types for image uploads */
  const ALLOWED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]);
  /** Maximum upload size: 20 MB */
  const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

  const setSurface = useCallback((surfaceId: SurfaceId) => {
    // Detach transformer on surface switch
    if (stageRef.current) {
      const tr = stageRef.current.findOne("Transformer") as Konva.Transformer | undefined;
      tr?.nodes([]);
    }
    dispatch({ type: "SET_ACTIVE_SURFACE", surfaceId });
  }, []);

  const addImageFromFile = useCallback(
    async (file: File, surfaceId = state.activeSurfaceId, replace = false) => {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error("Usa uma imagem PNG, JPG ou WEBP.");
      if (file.size > MAX_UPLOAD_BYTES) throw new Error("O ficheiro deve ter até 20 MB.");
      const surface = config.surfaces.find(s => s.id === surfaceId);
      if (!surface) throw new Error("Superfície indisponível.");
      const fileKey = `img_${nanoid()}`;
      await saveImageBlob(fileKey, file, file.name);
      const srcUrl = URL.createObjectURL(file);
      blobUrlsRef.current.add(srcUrl);
      const img = new window.Image();
      await new Promise<void>((resolve, reject) => { img.onload=()=>resolve(); img.onerror=()=>reject(new Error("Não foi possível ler a imagem.")); img.src=srcUrl; });
      const layer = createImageLayer(surfaceId, srcUrl, file.name, img.naturalWidth, img.naturalHeight, config.canvasWidth, config.canvasHeight, surface.printArea, 0);
      layer.fileKey=fileKey; layer.originalFileKey=fileKey; layer.originalSrcUrl=srcUrl;
      if(replace) dispatch({type:"RESET_SURFACE",surfaceId});
      dispatch({type:"SET_ACTIVE_SURFACE",surfaceId});
      dispatch({type:"ADD_IMAGE_LAYER",surfaceId,layer});
    }, [state.activeSurfaceId, config],
  );

  const syncSurface = useCallback((sourceSurfaceId: string, targetSurfaceId: string) => {
    dispatch({type:"COPY_DESIGN_TO_SURFACE",sourceSurfaceId,targetSurfaceId});
  }, []);

  const persistDesign = useCallback(async () => {
    await saveCustomizerDraft(config.id,state,pendingBlobsRef.current);
    pendingBlobsRef.current.clear();
    return serializeCustomizerDesign(state);
  },[config.id,state]);

  const addText = useCallback(
    (
      text: string,
      options?: { fill?: string; fontSize?: number; fontFamily?: string; name?: string },
    ) => {
      const layer = createTextLayer(
        state.activeSurfaceId,
        text,
        config.canvasWidth,
        config.canvasHeight,
        activeSurface.printArea,
        options?.fill ?? config.colorSwatches[0],
        options?.fontSize ?? 36,
        options?.fontFamily ?? config.fontOptions[0],
        nextZIndex(activeLayers),
        options?.name,
      );
      dispatch({
        type: "ADD_TEXT_LAYER",
        surfaceId: state.activeSurfaceId,
        layer,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.activeSurfaceId, activeSurface, config],
  );

  const updateLayer = useCallback(
    (layerId: string, changes: Partial<DesignLayer>, skipHistory = false) => {
      dispatch({
        type: "UPDATE_LAYER",
        surfaceId: state.activeSurfaceId,
        layerId,
        changes,
        skipHistory,
      });
    },
    [state.activeSurfaceId],
  );

  const deleteLayer = useCallback(
    (layerId: string) => {
      if (stageRef.current) {
        const tr = stageRef.current.findOne("Transformer") as Konva.Transformer | undefined;
        tr?.nodes([]);
      }
      dispatch({
        type: "DELETE_LAYER",
        surfaceId: state.activeSurfaceId,
        layerId,
      });
    },
    [state.activeSurfaceId],
  );

  const duplicateLayer = useCallback(
    (layerId: string) => {
      dispatch({
        type: "DUPLICATE_LAYER",
        surfaceId: state.activeSurfaceId,
        layerId,
      });
    },
    [state.activeSurfaceId],
  );

  const toggleLock = useCallback(
    (layerId: string) => {
      dispatch({
        type: "TOGGLE_LOCK_LAYER",
        surfaceId: state.activeSurfaceId,
        layerId,
      });
    },
    [state.activeSurfaceId],
  );

  const toggleVisibility = useCallback(
    (layerId: string) => {
      dispatch({
        type: "TOGGLE_VISIBILITY_LAYER",
        surfaceId: state.activeSurfaceId,
        layerId,
      });
    },
    [state.activeSurfaceId],
  );

  const reorderLayer = useCallback(
    (layerId: string, direction: LayerReorderDirection) => {
      dispatch({
        type: "REORDER_LAYER",
        surfaceId: state.activeSurfaceId,
        layerId,
        direction,
      });
    },
    [state.activeSurfaceId],
  );

  const copyDesignToOtherSurface = useCallback(
    (targetSurfaceId: SurfaceId) => {
      dispatch({
        type: "COPY_DESIGN_TO_SURFACE",
        sourceSurfaceId: state.activeSurfaceId,
        targetSurfaceId,
      });
    },
    [state.activeSurfaceId],
  );

  const selectLayer = useCallback(
    (layerId: string | null) => {
      dispatch({
        type: "SELECT_LAYER",
        surfaceId: state.activeSurfaceId,
        layerId,
      });
    },
    [state.activeSurfaceId],
  );

  const smartFit = useCallback(() => {
    if (!selectedLayer || selectedLayer.type !== "image") return;
    const changes = smartFitLayer(
      selectedLayer as ImageLayer,
      activeSurface.printArea,
      config.canvasWidth,
      config.canvasHeight,
    );
    dispatch({
      type: "UPDATE_LAYER",
      surfaceId: state.activeSurfaceId,
      layerId: selectedLayer.id,
      changes,
    });
  }, [selectedLayer, activeSurface, config, state.activeSurfaceId]);

  const coverFit = useCallback(() => {
    if (!selectedLayer || selectedLayer.type !== "image") return;
    const changes = coverFitLayer(
      selectedLayer as ImageLayer,
      activeSurface.printArea,
      config.canvasWidth,
      config.canvasHeight,
    );
    dispatch({
      type: "UPDATE_LAYER",
      surfaceId: state.activeSurfaceId,
      layerId: selectedLayer.id,
      changes,
    });
  }, [selectedLayer, activeSurface, config, state.activeSurfaceId]);

  // AI-Assisted Smart Fit (Subject Detection & Anatomical Shin Guard Fitting)
  const smartFitIntelligent = useCallback(async () => {
    if (!selectedLayer || selectedLayer.type !== "image" || selectedLayer.locked) return;
    const imgLayer = selectedLayer as ImageLayer;
    const provider = getImageProcessingProvider();

    try {
      let subjectBox = imgLayer.subjectBoundingBox;

      if (!subjectBox) {
        const fileKeyToAnalyze = imgLayer.processedFileKey || imgLayer.fileKey;
        if (fileKeyToAnalyze) {
          const record = await getImageBlob(fileKeyToAnalyze);
          if (record?.blob) {
            const analysis = await provider.analyzeSubject(record.blob);
            subjectBox = analysis.boundingBox;
          }
        }
      }

      const changes = provider.smartFit(
        imgLayer,
        activeSurface.printArea,
        config.canvasWidth,
        config.canvasHeight,
        subjectBox,
      );

      dispatch({
        type: "UPDATE_LAYER",
        surfaceId: state.activeSurfaceId,
        layerId: imgLayer.id,
        changes: {
          ...changes,
          subjectBoundingBox: subjectBox,
        },
      });
    } catch (e) {
      console.warn("Intelligent fit analysis fallback to standard:", e);
      smartFit();
    }
  }, [selectedLayer, activeSurface, config, state.activeSurfaceId, smartFit]);

  // Background Removal State & Actions
  const [bgRemovalProgress, setBgRemovalProgress] = useState<{
    layerId: string;
    percent: number;
    statusText: string;
  } | null>(null);

  const removeBackground = useCallback(
    async (layerId: string) => {
      const layer = activeLayers.find((l) => l.id === layerId) as ImageLayer | undefined;
      if (!layer || layer.type !== "image") return;

      const provider = getImageProcessingProvider();

      updateLayer(layerId, { isProcessingBg: true }, true);
      setBgRemovalProgress({ layerId, percent: 5, statusText: "A preparar imagem..." });

      try {
        let sourceBlob: Blob | null = null;
        const sourceKey = layer.originalFileKey || layer.fileKey;
        if (sourceKey) {
          const record = await getImageBlob(sourceKey);
          if (record?.blob) sourceBlob = record.blob;
        }

        if (!sourceBlob) {
          const resp = await fetch(layer.originalSrcUrl || layer.srcUrl);
          sourceBlob = await resp.blob();
        }

        const processedBlob = await provider.removeBackground(sourceBlob, {
          onProgress: (percent, statusText) => {
            setBgRemovalProgress({ layerId, percent, statusText: statusText || "A processar..." });
          },
        });

        const processedKey = `proc_${nanoid()}`;
        await saveImageBlob(processedKey, processedBlob, `nobg_${layer.filename || "image"}.png`);

        const processedUrl = URL.createObjectURL(processedBlob);
        blobUrlsRef.current.add(processedUrl);

        let subjectBox = layer.subjectBoundingBox;
        try {
          const analysis = await provider.analyzeSubject(processedBlob);
          subjectBox = analysis.boundingBox;
        } catch (e) {
          console.warn("Subject analysis after bg removal skipped:", e);
        }

        updateLayer(
          layerId,
          {
            srcUrl: processedUrl,
            fileKey: processedKey,
            processedFileKey: processedKey,
            processedSrcUrl: processedUrl,
            originalFileKey: sourceKey || layer.fileKey,
            originalSrcUrl: layer.originalSrcUrl || layer.srcUrl,
            isBackgroundRemoved: true,
            isViewingOriginal: false,
            isProcessingBg: false,
            subjectBoundingBox: subjectBox,
          },
          false,
        );
      } catch (err) {
        console.error("Background removal failed:", err);
        updateLayer(layerId, { isProcessingBg: false }, true);
      } finally {
        setBgRemovalProgress(null);
      }
    },
    [activeLayers, updateLayer],
  );

  const restoreOriginal = useCallback(
    async (layerId: string) => {
      const layer = activeLayers.find((l) => l.id === layerId) as ImageLayer | undefined;
      if (!layer || layer.type !== "image" || !layer.isBackgroundRemoved) return;

      let origUrl = layer.originalSrcUrl;
      if (!origUrl && layer.originalFileKey) {
        const record = await getImageBlob(layer.originalFileKey);
        if (record?.blob) {
          origUrl = URL.createObjectURL(record.blob);
          blobUrlsRef.current.add(origUrl);
        }
      }

      if (!origUrl) return;

      updateLayer(
        layerId,
        {
          srcUrl: origUrl,
          fileKey: layer.originalFileKey || layer.fileKey,
          isBackgroundRemoved: false,
          isViewingOriginal: false,
        },
        false,
      );
    },
    [activeLayers, updateLayer],
  );

  const toggleCompareOriginal = useCallback(
    async (layerId: string) => {
      const layer = activeLayers.find((l) => l.id === layerId) as ImageLayer | undefined;
      if (!layer || layer.type !== "image" || !layer.isBackgroundRemoved) return;

      const nextViewingOriginal = !layer.isViewingOriginal;

      let targetUrl = nextViewingOriginal ? layer.originalSrcUrl : layer.processedSrcUrl;
      const targetKey = nextViewingOriginal ? layer.originalFileKey : layer.processedFileKey;

      if (!targetUrl && targetKey) {
        try {
          const record = await getImageBlob(targetKey);
          if (record?.blob) {
            targetUrl = URL.createObjectURL(record.blob);
            blobUrlsRef.current.add(targetUrl);
          }
        } catch (e) {
          console.warn("Failed to load blob for compare toggle:", e);
        }
      }

      if (!targetUrl) return;

      updateLayer(
        layerId,
        {
          srcUrl: targetUrl,
          isViewingOriginal: nextViewingOriginal,
        },
        true,
      );
    },
    [activeLayers, updateLayer],
  );

  const resetSurface = useCallback(() => {
    if (stageRef.current) {
      const tr = stageRef.current.findOne("Transformer") as Konva.Transformer | undefined;
      tr?.nodes([]);
    }
    dispatch({ type: "RESET_SURFACE", surfaceId: state.activeSurfaceId });
  }, [state.activeSurfaceId]);

  const clearDraft = useCallback(async () => {
    if (stageRef.current) {
      const tr = stageRef.current.findOne("Transformer") as Konva.Transformer | undefined;
      tr?.nodes([]);
    }
    await clearCustomizerDraft(config.id);
    dispatch({ type: "CLEAR_ALL_SURFACES" });
    setSaveStatus("idle");
  }, [config.id]);

  const undo = useCallback(() => {
    if (stageRef.current) {
      const tr = stageRef.current.findOne("Transformer") as Konva.Transformer | undefined;
      tr?.nodes([]);
    }
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    if (stageRef.current) {
      const tr = stageRef.current.findOne("Transformer") as Konva.Transformer | undefined;
      tr?.nodes([]);
    }
    dispatch({ type: "REDO" });
  }, []);

  // ------------------------------------------------------------------
  // Keyboard Shortcuts
  // ------------------------------------------------------------------
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedLayer) {
        e.preventDefault();
        deleteLayer(selectedLayer.id);
        return;
      }

      if (e.key === "Escape" && selectedLayer) {
        e.preventDefault();
        selectLayer(null);
        return;
      }

      if (cmdOrCtrl && (e.key === "d" || e.key === "D") && selectedLayer) {
        e.preventDefault();
        duplicateLayer(selectedLayer.id);
        return;
      }

      if (
        (cmdOrCtrl && e.shiftKey && (e.key === "z" || e.key === "Z")) ||
        (cmdOrCtrl && (e.key === "y" || e.key === "Y"))
      ) {
        e.preventDefault();
        if (canRedo) redo();
        return;
      }

      if (cmdOrCtrl && !e.shiftKey && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (canUndo) undo();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLayer, canUndo, canRedo, deleteLayer, duplicateLayer, selectLayer, undo, redo]);

  // ------------------------------------------------------------------
  // Clean Export Preview PNG (Without UI guides, masks or transformers)
  // ------------------------------------------------------------------

  const exportCustomerPreview = useCallback((): string | null => {
    const stage = stageRef.current;
    if (!stage) return null;

    const guideLayer = stage.findOne(".guide-layer") as Konva.Layer | undefined;
    const transformer = stage.findOne("Transformer") as Konva.Transformer | undefined;

    const guideWasVisible = guideLayer ? guideLayer.visible() : true;
    const trWasVisible = transformer ? transformer.visible() : true;

    guideLayer?.hide();
    transformer?.hide();
    stage.draw();

    const dataUrl = stage.toDataURL({
      pixelRatio: 2,
      mimeType: "image/png",
    });

    if (guideWasVisible) guideLayer?.show();
    if (trWasVisible) transformer?.show();
    stage.draw();

    return dataUrl;
  }, []);

  const exportProductionArt = useCallback((): string | null => {
    const stage = stageRef.current;
    if (!stage) return null;

    const mockupLayer = stage.findOne(".mockup-layer") as Konva.Layer | undefined;
    const overlayLayer = stage.findOne(".overlay-layer") as Konva.Layer | undefined;
    const guideLayer = stage.findOne(".guide-layer") as Konva.Layer | undefined;
    const transformer = stage.findOne("Transformer") as Konva.Transformer | undefined;

    const mockupWasVisible = mockupLayer ? mockupLayer.visible() : true;
    const overlayWasVisible = overlayLayer ? overlayLayer.visible() : true;
    const guideWasVisible = guideLayer ? guideLayer.visible() : true;
    const trWasVisible = transformer ? transformer.visible() : true;

    if (mockupLayer) mockupLayer.visible(false);
    if (overlayLayer) overlayLayer.visible(false);
    if (guideLayer) guideLayer.visible(false);
    if (transformer) transformer.visible(false);
    stage.draw();

    const pa = activeSurface.printArea;
    const cropX = Math.round(pa.xFraction * config.canvasWidth);
    const cropY = Math.round(pa.yFraction * config.canvasHeight);
    const cropW = Math.round(pa.widthFraction * config.canvasWidth);
    const cropH = Math.round(pa.heightFraction * config.canvasHeight);

    const dataUrl = stage.toDataURL({
      x: cropX,
      y: cropY,
      width: cropW,
      height: cropH,
      pixelRatio: 2,
      mimeType: "image/png",
    });

    if (mockupLayer && mockupWasVisible) mockupLayer.visible(true);
    if (overlayLayer && overlayWasVisible) overlayLayer.visible(true);
    if (guideLayer && guideWasVisible) guideLayer.visible(true);
    if (transformer && trWasVisible) transformer.visible(true);
    stage.draw();

    return dataUrl;
  }, [activeSurface.printArea, config.canvasWidth, config.canvasHeight]);

  const downloadPreview = useCallback(() => {
    const dataUrl = exportCustomerPreview();
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = `vinilart-preview-${state.activeSurfaceId.toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
  }, [exportCustomerPreview, state.activeSurfaceId]);

  const downloadProductionArt = useCallback(() => {
    const dataUrl = exportProductionArt();
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = `vinilart-arte-producao-${state.activeSurfaceId.toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
  }, [exportProductionArt, state.activeSurfaceId]);

  // ------------------------------------------------------------------
  // Layer manipulation helpers (nudge / flip / align / opacity)
  // ------------------------------------------------------------------

  const addImagesFromFiles = useCallback(
    (files: FileList | File[]) => {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          addImageFromFile(file);
        }
      });
    },
    [addImageFromFile],
  );

  const nudgeSelected = useCallback(
    (dx: number, dy: number) => {
      if (!selectedLayer || selectedLayer.locked) return;
      updateLayer(selectedLayer.id, {
        x: selectedLayer.x + dx,
        y: selectedLayer.y + dy,
      });
    },
    [selectedLayer, updateLayer],
  );

  const flipSelected = useCallback(
    (axis: "x" | "y") => {
      if (!selectedLayer || selectedLayer.locked) return;
      updateLayer(
        selectedLayer.id,
        axis === "x"
          ? { scaleX: -selectedLayer.scaleX }
          : { scaleY: -selectedLayer.scaleY },
      );
    },
    [selectedLayer, updateLayer],
  );

  const alignSelected = useCallback(
    (mode: "horizontal" | "vertical" | "both") => {
      if (!selectedLayer || selectedLayer.locked) return;

      const pa = activeSurface.printArea;
      const centerX =
        (pa.xFraction + pa.widthFraction / 2) * config.canvasWidth;
      const centerY =
        (pa.yFraction + pa.heightFraction / 2) * config.canvasHeight;

      const isImage = selectedLayer.type === "image";
      const widthPx =
        selectedLayer.width * Math.abs(selectedLayer.scaleX || 1);
      const heightPx = isImage
        ? (selectedLayer as ImageLayer).height *
          Math.abs(selectedLayer.scaleY || 1)
        : selectedLayer.fontSize * Math.abs(selectedLayer.scaleY || 1);

      const nextX = isImage ? centerX : centerX - widthPx / 2;
      const nextY = isImage ? centerY : centerY - heightPx / 2;

      const changes: Partial<DesignLayer> = {};
      if (mode === "horizontal" || mode === "both") changes.x = nextX;
      if (mode === "vertical" || mode === "both") changes.y = nextY;

      updateLayer(selectedLayer.id, changes);
    },
    [selectedLayer, updateLayer, activeSurface, config],
  );

  const setSelectedOpacity = useCallback(
    (opacity: number) => {
      if (!selectedLayer) return;
      updateLayer(
        selectedLayer.id,
        { opacity: Math.min(1, Math.max(0.05, opacity)) },
        true,
      );
    },
    [selectedLayer, updateLayer],
  );

  const rotateSelected = useCallback(
    (delta: number) => {
      if (!selectedLayer || selectedLayer.locked) return;
      updateLayer(selectedLayer.id, {
        rotation: Math.round(selectedLayer.rotation + delta),
      });
    },
    [selectedLayer, updateLayer],
  );

  // Arrow-key nudging
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (!selectedLayer) return;

      const step = e.shiftKey ? 10 : 1;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          nudgeSelected(-step, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          nudgeSelected(step, 0);
          break;
        case "ArrowUp":
          e.preventDefault();
          nudgeSelected(0, -step);
          break;
        case "ArrowDown":
          e.preventDefault();
          nudgeSelected(0, step);
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedLayer, nudgeSelected]);

  // Paste images directly from the clipboard
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const files = e.clipboardData?.files;
      if (files && files.length > 0) {
        addImagesFromFiles(files);
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) addImageFromFile(file);
        }
      }
    }

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addImageFromFile, addImagesFromFiles]);

  const serializeDesign = useCallback((): string => {
    return serializeCustomizerDesign(state);
  }, [state]);

  /**
   * Production-ready description of the design, independent of screen size.
   * Every placement is normalised (0..1) against the print area so the same
   * numbers can drive print output from WooCommerce/WordPress later on.
   */
  const buildProductionSpec = useCallback(() => {
    return {
      productId: config.id,
      productName: config.name,
      generatedAt: new Date().toISOString(),
      canvas: {
        width: config.canvasWidth,
        height: config.canvasHeight,
      },
      surfaces: config.surfaces.map((surface) => {
        const pa = surface.printArea;
        const paX = pa.xFraction * config.canvasWidth;
        const paY = pa.yFraction * config.canvasHeight;
        const paW = pa.widthFraction * config.canvasWidth;
        const paH = pa.heightFraction * config.canvasHeight;

        const layers = state.surfaces[surface.id]?.layers ?? [];

        return {
          surfaceId: surface.id,
          label: surface.label,
          printArea: { x: paX, y: paY, width: paW, height: paH },
          layers: layers.map((layer) => {
            const common = {
              id: layer.id,
              type: layer.type,
              zIndex: layer.zIndex,
              visible: layer.visible,
              rotation: layer.rotation,
              opacity: 1,
              /** Position in canvas pixels */
              positionPx: { x: layer.x, y: layer.y },
              /** Position relative to the print area (0..1) */
              positionRelative: {
                x: paW > 0 ? (layer.x - paX) / paW : 0,
                y: paH > 0 ? (layer.y - paY) / paH : 0,
              },
              scale: { x: layer.scaleX, y: layer.scaleY },
            };

            if (layer.type === "image") {
              return {
                ...common,
                blendMode: "normal",
                source: {
                  filename: layer.filename,
                  /** IndexedDB key of the original high-resolution upload */
                  originalFileKey:
                    layer.originalFileKey ?? layer.fileKey ?? null,
                  activeFileKey: layer.fileKey ?? null,
                  backgroundRemoved: Boolean(layer.isBackgroundRemoved),
                  naturalWidth: layer.naturalWidth,
                  naturalHeight: layer.naturalHeight,
                },
                renderedSizePx: {
                  width: layer.width * layer.scaleX,
                  height: layer.height * layer.scaleY,
                },
                renderedSizeRelative: {
                  width: paW > 0 ? (layer.width * layer.scaleX) / paW : 0,
                  height: paH > 0 ? (layer.height * layer.scaleY) / paH : 0,
                },
              };
            }

            return {
              ...common,
              text: layer.text,
              fontFamily: layer.fontFamily,
              fontSize: layer.fontSize,
              fontStyle: layer.fontStyle,
              fill: layer.fill,
              align: layer.align,
            };
          }),
        };
      }),
    };
  }, [config, state]);

  return {
    config,
    state,
    activeSurface,
    activeSurfaceDesign,
    activeLayers,
    selectedLayer,
    canUndo,
    canRedo,
    saveStatus,
    viewMode,
    zoom,
    stageRef,
    setViewMode,
    zoomIn,
    zoomOut,
    resetZoom,
    setSurface,
    addImageFromFile,
    addImagesFromFiles,
    addText,
    nudgeSelected,
    flipSelected,
    alignSelected,
    setSelectedOpacity,
    rotateSelected,
    updateLayer,
    deleteLayer,
    duplicateLayer,
    toggleLock,
    toggleVisibility,
    reorderLayer,
    copyDesignToOtherSurface,
    syncSurface,
    persistDesign,
    selectLayer,
    smartFit,
    coverFit,
    smartFitIntelligent,
    removeBackground,
    restoreOriginal,
    toggleCompareOriginal,
    bgRemovalProgress,
    resetSurface,
    clearDraft,
    undo,
    redo,
    exportPreview: exportCustomerPreview,
    exportCustomerPreview,
    exportProductionArt,
    downloadPreview,
    downloadProductionArt,
    serializeDesign,
    buildProductionSpec,
    dispatch,
  };
}

export type ProductCustomizerHandle = ReturnType<typeof useProductCustomizer>;
