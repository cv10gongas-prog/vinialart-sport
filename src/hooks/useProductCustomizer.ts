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
  nextZIndex,
} from "@/lib/customizer/utils";
import {
  saveCustomizerDraft,
  loadCustomizerDraft,
  clearCustomizerDraft,
} from "@/lib/customizer/storage/draft";
import { nanoid } from "@/lib/customizer/nanoid";

export type DraftSaveStatus = "idle" | "saving" | "saved";

export function useProductCustomizer(config: ProductCustomizerConfig) {
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
  // Rehydrate draft from storage on mount
  // ------------------------------------------------------------------
  useEffect(() => {
    let active = true;
    async function initDraft() {
      try {
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
  }, [config.id, config.surfaces]);

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
  // Derived helpers
  // ------------------------------------------------------------------

  const activeSurface = config.surfaces.find(
    (s) => s.id === state.activeSurfaceId,
  )!;

  const activeSurfaceDesign = state.surfaces[state.activeSurfaceId];
  const activeLayers = activeSurfaceDesign?.layers ?? [];

  const selectedLayer =
    activeLayers.find(
      (l) => l.id === activeSurfaceDesign?.selectedLayerId,
    ) ?? null;

  const canUndo = state.undoStack.length > 0;
  const canRedo = state.redoStack.length > 0;

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------

  const setSurface = useCallback((surfaceId: SurfaceId) => {
    // Detach transformer on surface switch
    if (stageRef.current) {
      const tr = stageRef.current.findOne("Transformer") as Konva.Transformer | undefined;
      tr?.nodes([]);
    }
    dispatch({ type: "SET_ACTIVE_SURFACE", surfaceId });
  }, []);

  const addImageFromFile = useCallback(
    (file: File) => {
      const fileKey = `img_${nanoid()}`;
      const srcUrl = URL.createObjectURL(file);
      blobUrlsRef.current.add(srcUrl);

      // Queue for IndexedDB persistence
      pendingBlobsRef.current.set(fileKey, { blob: file, filename: file.name });

      const img = new window.Image();
      img.onload = () => {
        const layer = createImageLayer(
          state.activeSurfaceId,
          srcUrl,
          file.name,
          img.naturalWidth,
          img.naturalHeight,
          config.canvasWidth,
          config.canvasHeight,
          activeSurface.printArea,
          nextZIndex(activeLayers),
        );
        layer.fileKey = fileKey;

        dispatch({
          type: "ADD_IMAGE_LAYER",
          surfaceId: state.activeSurfaceId,
          layer,
        });
      };
      img.src = srcUrl;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.activeSurfaceId, activeSurface, config],
  );

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
    (layerId: string, changes: Partial<DesignLayer>, skipHistory?: boolean) => {
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
      // Detach transformer immediately before removing node to prevent phantom boxes
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
      // If currently selected, detach transformer so handles disappear when locked
      if (selectedLayer?.id === layerId && stageRef.current) {
        const tr = stageRef.current.findOne("Transformer") as Konva.Transformer | undefined;
        tr?.nodes([]);
      }
      dispatch({
        type: "TOGGLE_LOCK_LAYER",
        surfaceId: state.activeSurfaceId,
        layerId,
      });
    },
    [selectedLayer, state.activeSurfaceId],
  );

  const toggleVisibility = useCallback(
    (layerId: string) => {
      if (selectedLayer?.id === layerId && stageRef.current) {
        const tr = stageRef.current.findOne("Transformer") as Konva.Transformer | undefined;
        tr?.nodes([]);
      }
      dispatch({
        type: "TOGGLE_VISIBILITY_LAYER",
        surfaceId: state.activeSurfaceId,
        layerId,
      });
    },
    [selectedLayer, state.activeSurfaceId],
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
      if (stageRef.current) {
        const tr = stageRef.current.findOne("Transformer") as Konva.Transformer | undefined;
        tr?.nodes([]);
      }
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
  // Keyboard Shortcuts (Safe: Ignored when in input/textarea/editable)
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

      // Delete / Backspace: delete selected layer
      if ((e.key === "Delete" || e.key === "Backspace") && selectedLayer) {
        e.preventDefault();
        deleteLayer(selectedLayer.id);
        return;
      }

      // Escape: deselect
      if (e.key === "Escape" && selectedLayer) {
        e.preventDefault();
        selectLayer(null);
        return;
      }

      // Ctrl/Cmd + D: duplicate selected layer
      if (cmdOrCtrl && (e.key === "d" || e.key === "D") && selectedLayer) {
        e.preventDefault();
        duplicateLayer(selectedLayer.id);
        return;
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: redo
      if (
        (cmdOrCtrl && e.shiftKey && (e.key === "z" || e.key === "Z")) ||
        (cmdOrCtrl && (e.key === "y" || e.key === "Y"))
      ) {
        e.preventDefault();
        if (canRedo) redo();
        return;
      }

      // Ctrl/Cmd + Z: undo
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

  // ------------------------------------------------------------------
  // Dual Export Functions:
  // 1) Customer Preview: Full product mockup + clipped design + specular shine (high-res PNG)
  // 2) Production Art: Isolated customer design within the print area, transparent PNG, zero UI
  // ------------------------------------------------------------------

  const exportCustomerPreview = useCallback((): string | null => {
    const stage = stageRef.current;
    if (!stage) return null;

    const guideLayer = stage.findOne(".guide-layer") as Konva.Layer | undefined;
    const transformer = stage.findOne("Transformer") as Konva.Transformer | undefined;

    const guideWasVisible = guideLayer ? guideLayer.visible() : true;
    const trWasVisible = transformer ? transformer.visible() : true;

    // Hide editing guides & selection transformer
    if (guideLayer) guideLayer.visible(false);
    if (transformer) transformer.visible(false);
    stage.draw();

    const dataUrl = stage.toDataURL({
      mimeType: "image/png",
      pixelRatio: 2,
    });

    // Restore visibility
    if (guideLayer) guideLayer.visible(guideWasVisible);
    if (transformer) transformer.visible(trWasVisible);
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

    // Hide mockup, overlays, guides and transformer to leave ONLY customer artwork
    if (mockupLayer) mockupLayer.visible(false);
    if (overlayLayer) overlayLayer.visible(false);
    if (guideLayer) guideLayer.visible(false);
    if (transformer) transformer.visible(false);
    stage.draw();

    // Export bounding box of the print area
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
      mimeType: "image/png",
      pixelRatio: 3, // High-res print resolution
    });

    // Restore previous state
    if (mockupLayer) mockupLayer.visible(mockupWasVisible);
    if (overlayLayer) overlayLayer.visible(overlayWasVisible);
    if (guideLayer) guideLayer.visible(guideWasVisible);
    if (transformer) transformer.visible(trWasVisible);
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

  return {
    // Config
    config,
    // State
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
    // Refs
    stageRef,
    // Actions
    setViewMode,
    zoomIn,
    zoomOut,
    resetZoom,
    setSurface,
    addImageFromFile,
    addText,
    updateLayer,
    deleteLayer,
    duplicateLayer,
    toggleLock,
    toggleVisibility,
    reorderLayer,
    copyDesignToOtherSurface,
    selectLayer,
    smartFit,
    resetSurface,
    clearDraft,
    undo,
    redo,
    exportPreview: exportCustomerPreview,
    exportCustomerPreview,
    exportProductionArt,
    downloadPreview,
    downloadProductionArt,
    dispatch,
  };
}

export type ProductCustomizerHandle = ReturnType<typeof useProductCustomizer>;
