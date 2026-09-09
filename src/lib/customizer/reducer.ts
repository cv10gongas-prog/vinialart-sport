/**
 * VinilArt Sport — Customizer Reducer
 *
 * Pure reducer that drives all customizer state transitions.
 * No side-effects, no DOM access — safe to test in isolation.
 *
 * History (undo/redo) strategy:
 *   - Before every destructive action, push current surfaces snapshot to undoStack
 *   - Max history depth: 30 steps
 *   - undo/redo just swap snapshots
 */

import type {
  CustomizerState,
  CustomizerAction,
  SurfaceDesign,
  SurfaceId,
  DesignLayer,
} from "./types";
import { nanoid } from "./nanoid";

const MAX_HISTORY = 30;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cloneSurfaces(
  surfaces: Record<SurfaceId, SurfaceDesign>,
): Record<SurfaceId, SurfaceDesign> {
  const out: Record<SurfaceId, SurfaceDesign> = {};
  for (const [id, surface] of Object.entries(surfaces)) {
    out[id] = {
      ...surface,
      layers: surface.layers.map((l) => ({ ...l })),
    };
  }
  return out;
}

function pushHistory(
  state: CustomizerState,
): Pick<CustomizerState, "undoStack" | "redoStack"> {
  const snapshot = cloneSurfaces(state.surfaces);
  return {
    undoStack: [...state.undoStack, snapshot].slice(-MAX_HISTORY),
    redoStack: [], // Clear redo on new action
  };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function customizerReducer(
  state: CustomizerState,
  action: CustomizerAction,
): CustomizerState {
  switch (action.type) {
    // -- Surface switch -------------------------------------------------------
    case "SET_ACTIVE_SURFACE": {
      if (action.surfaceId === state.activeSurfaceId) return state;
      // Clear selection when switching surfaces so the user starts clean
      const cleanedSurfaces: Record<SurfaceId, SurfaceDesign> = {};
      for (const [id, s] of Object.entries(state.surfaces)) {
        cleanedSurfaces[id] = { ...s, selectedLayerId: null };
      }
      return {
        ...state,
        activeSurfaceId: action.surfaceId,
        surfaces: cleanedSurfaces,
      };
    }

    // -- Add Image Layer -------------------------------------------------------
    case "ADD_IMAGE_LAYER": {
      const surface = state.surfaces[action.surfaceId];
      if (!surface) return state;

      const updatedSurface: SurfaceDesign = {
        ...surface,
        layers: [...surface.layers, action.layer],
        selectedLayerId: action.layer.id,
      };

      return {
        ...state,
        ...pushHistory(state),
        surfaces: {
          ...state.surfaces,
          [action.surfaceId]: updatedSurface,
        },
      };
    }

    // -- Add Text Layer -------------------------------------------------------
    case "ADD_TEXT_LAYER": {
      const surface = state.surfaces[action.surfaceId];
      if (!surface) return state;

      const updatedSurface: SurfaceDesign = {
        ...surface,
        layers: [...surface.layers, action.layer],
        selectedLayerId: action.layer.id,
      };

      return {
        ...state,
        ...pushHistory(state),
        surfaces: {
          ...state.surfaces,
          [action.surfaceId]: updatedSurface,
        },
      };
    }

    // -- Update Layer ---------------------------------------------------------
    case "UPDATE_LAYER": {
      const surface = state.surfaces[action.surfaceId];
      if (!surface) return state;

      const updatedLayers = surface.layers.map((l) => {
        if (l.id !== action.layerId) return l;
        return { ...l, ...action.changes } as typeof l;
      });

      // Push history for completed discrete changes (unless explicitly skipped, e.g. continuous slider tick)
      const historyUpdate = action.skipHistory ? {} : pushHistory(state);

      return {
        ...state,
        ...historyUpdate,
        surfaces: {
          ...state.surfaces,
          [action.surfaceId]: { ...surface, layers: updatedLayers },
        },
      };
    }

    // -- Delete Layer ---------------------------------------------------------
    case "DELETE_LAYER": {
      const surface = state.surfaces[action.surfaceId];
      if (!surface) return state;

      const remainingLayers = surface.layers.filter(
        (l) => l.id !== action.layerId,
      );
      const selectedLayerId =
        surface.selectedLayerId === action.layerId
          ? null
          : surface.selectedLayerId;

      return {
        ...state,
        ...pushHistory(state),
        surfaces: {
          ...state.surfaces,
          [action.surfaceId]: {
            ...surface,
            layers: remainingLayers,
            selectedLayerId,
          },
        },
      };
    }

    // -- Select Layer ---------------------------------------------------------
    case "SELECT_LAYER": {
      const surface = state.surfaces[action.surfaceId];
      if (!surface) return state;

      // Selection doesn't push history
      return {
        ...state,
        surfaces: {
          ...state.surfaces,
          [action.surfaceId]: {
            ...surface,
            selectedLayerId: action.layerId,
          },
        },
      };
    }

    // -- Duplicate Layer -----------------------------------------------------
    case "DUPLICATE_LAYER": {
      const surface = state.surfaces[action.surfaceId];
      if (!surface) return state;

      const layerToDuplicate = surface.layers.find((l) => l.id === action.layerId);
      if (!layerToDuplicate) return state;

      const newId = nanoid();
      const duplicatedLayer: DesignLayer = {
        ...layerToDuplicate,
        id: newId,
        name: layerToDuplicate.name ? `${layerToDuplicate.name} (cópia)` : undefined,
        x: layerToDuplicate.x + 15,
        y: layerToDuplicate.y + 15,
        zIndex: surface.layers.length,
      };

      return {
        ...state,
        ...pushHistory(state),
        surfaces: {
          ...state.surfaces,
          [action.surfaceId]: {
            ...surface,
            layers: [...surface.layers, duplicatedLayer],
            selectedLayerId: newId,
          },
        },
      };
    }

    // -- Toggle Lock Layer ----------------------------------------------------
    case "TOGGLE_LOCK_LAYER": {
      const surface = state.surfaces[action.surfaceId];
      if (!surface) return state;

      const updatedLayers = surface.layers.map((l) => {
        if (l.id !== action.layerId) return l;
        return { ...l, locked: !l.locked } as typeof l;
      });

      return {
        ...state,
        ...pushHistory(state),
        surfaces: {
          ...state.surfaces,
          [action.surfaceId]: {
            ...surface,
            layers: updatedLayers,
          },
        },
      };
    }

    // -- Toggle Visibility Layer ----------------------------------------------
    case "TOGGLE_VISIBILITY_LAYER": {
      const surface = state.surfaces[action.surfaceId];
      if (!surface) return state;

      const updatedLayers = surface.layers.map((l) => {
        if (l.id !== action.layerId) return l;
        const newVisible = !l.visible;
        return { ...l, visible: newVisible } as typeof l;
      });

      // If hiding the currently selected layer, deselect it
      const targetLayer = surface.layers.find((l) => l.id === action.layerId);
      const isCurrentlySelected = surface.selectedLayerId === action.layerId;
      const willBeHidden = targetLayer ? targetLayer.visible : false;

      return {
        ...state,
        ...pushHistory(state),
        surfaces: {
          ...state.surfaces,
          [action.surfaceId]: {
            ...surface,
            layers: updatedLayers,
            selectedLayerId: isCurrentlySelected && willBeHidden ? null : surface.selectedLayerId,
          },
        },
      };
    }

    // -- Reorder Layer --------------------------------------------------------
    case "REORDER_LAYER": {
      const surface = state.surfaces[action.surfaceId];
      if (!surface) return state;

      const currentIndex = surface.layers.findIndex((l) => l.id === action.layerId);
      if (currentIndex === -1) return state;

      const layersCopy = [...surface.layers];
      const [movedLayer] = layersCopy.splice(currentIndex, 1);
      if (!movedLayer) return state;

      let targetIndex = currentIndex;
      switch (action.direction) {
        case "up":
          // Bring forward (higher z-index, later in array)
          targetIndex = Math.min(layersCopy.length, currentIndex + 1);
          break;
        case "down":
          // Send backward (lower z-index, earlier in array)
          targetIndex = Math.max(0, currentIndex - 1);
          break;
        case "top":
          // Bring to front
          targetIndex = layersCopy.length;
          break;
        case "bottom":
          // Send to back
          targetIndex = 0;
          break;
      }

      layersCopy.splice(targetIndex, 0, movedLayer);

      // Re-normalize zIndex values
      const reindexed = layersCopy.map((l, idx) => ({ ...l, zIndex: idx }));

      return {
        ...state,
        ...pushHistory(state),
        surfaces: {
          ...state.surfaces,
          [action.surfaceId]: {
            ...surface,
            layers: reindexed,
          },
        },
      };
    }

    // -- Copy Design To Surface -----------------------------------------------
    case "COPY_DESIGN_TO_SURFACE": {
      const sourceSurface = state.surfaces[action.sourceSurfaceId];
      const targetSurface = state.surfaces[action.targetSurfaceId];
      if (!sourceSurface || !targetSurface) return state;

      // Deep copy all layers with fresh unique IDs
      const copiedLayers: DesignLayer[] = sourceSurface.layers.map((layer, idx) => ({
        ...layer,
        id: nanoid(),
        surfaceId: action.targetSurfaceId,
        zIndex: idx,
      }));

      return {
        ...state,
        ...pushHistory(state),
        surfaces: {
          ...state.surfaces,
          [action.targetSurfaceId]: {
            ...targetSurface,
            layers: copiedLayers,
            selectedLayerId: null,
          },
        },
      };
    }

    // -- Restore Draft --------------------------------------------------------
    case "RESTORE_DRAFT": {
      return {
        ...action.state,
        undoStack: [],
        redoStack: [],
      };
    }

    // -- Clear All Surfaces ---------------------------------------------------
    case "CLEAR_ALL_SURFACES": {
      const emptySurfaces: Record<SurfaceId, SurfaceDesign> = {};
      for (const [id, s] of Object.entries(state.surfaces)) {
        emptySurfaces[id] = {
          ...s,
          layers: [],
          selectedLayerId: null,
        };
      }
      return {
        ...state,
        ...pushHistory(state),
        surfaces: emptySurfaces,
      };
    }

    // -- Reset Surface --------------------------------------------------------
    case "RESET_SURFACE": {
      const surface = state.surfaces[action.surfaceId];
      if (!surface) return state;

      return {
        ...state,
        ...pushHistory(state),
        surfaces: {
          ...state.surfaces,
          [action.surfaceId]: {
            surfaceId: action.surfaceId,
            layers: [],
            selectedLayerId: null,
          },
        },
      };
    }

    // -- Undo -----------------------------------------------------------------
    case "UNDO": {
      const previousSurfaces = state.undoStack[state.undoStack.length - 1];
      if (!previousSurfaces) return state;

      const currentSnapshot = cloneSurfaces(state.surfaces);

      return {
        ...state,
        surfaces: previousSurfaces,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, currentSnapshot],
      };
    }

    // -- Redo -----------------------------------------------------------------
    case "REDO": {
      const nextSurfaces = state.redoStack[state.redoStack.length - 1];
      if (!nextSurfaces) return state;

      const currentSnapshot = cloneSurfaces(state.surfaces);

      return {
        ...state,
        surfaces: nextSurfaces,
        redoStack: state.redoStack.slice(0, -1),
        undoStack: [...state.undoStack, currentSnapshot],
      };
    }

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Initial state factory
// ---------------------------------------------------------------------------

export function createInitialState(
  productId: string,
  surfaceIds: string[],
  defaultSurfaceId: string,
): CustomizerState {
  const surfaces: Record<string, SurfaceDesign> = {};
  for (const id of surfaceIds) {
    surfaces[id] = {
      surfaceId: id,
      layers: [],
      selectedLayerId: null,
    };
  }

  return {
    productId,
    activeSurfaceId: defaultSurfaceId,
    surfaces,
    undoStack: [],
    redoStack: [],
  };
}
