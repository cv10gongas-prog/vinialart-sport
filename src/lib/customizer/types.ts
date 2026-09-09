/**
 * VinilArt Sport — Customizer Architecture Types
 *
 * Core data types for the product customizer engine.
 * Designed to be product-agnostic: caneleiras, camisolas, bandeiras, etc.
 *
 * Principles:
 *  - All state is serialisable to JSON (no class instances in state)
 *  - Surfaces (LEFT / RIGHT / FRONT / BACK) hold independent design state
 *  - Layers are typed discriminated unions for clean rendering
 *  - PrintArea defines the safe printing zone per surface
 *  - ProductCustomizerConfig is the single source of truth per product
 */

// ---------------------------------------------------------------------------
// Print Area & Clip Shapes
// ---------------------------------------------------------------------------

export type ClipShapeType = "rect" | "rounded" | "contour" | "svg-path";

export interface ClipShape {
  type: ClipShapeType;
  /** Corner radius in pixels if type === "rounded" */
  cornerRadius?: number | number[] | undefined;
  /** Array of normalized points [x0, y0, x1, y1...] (0..1 relative to printArea) if type === "contour" */
  points?: number[] | undefined;
  /** SVG path d string if type === "svg-path" */
  svgPath?: string | undefined;
}

/** Bounding box within the mockup image coordinate space. */
export interface PrintArea {
  /** Left offset as fraction of canvas width (0–1) */
  xFraction: number;
  /** Top offset as fraction of canvas height (0–1) */
  yFraction: number;
  /** Width as fraction of canvas width (0–1) */
  widthFraction: number;
  /** Height as fraction of canvas height (0–1) */
  heightFraction: number;
  /** Custom clipping shape (replaces plain rectangle) */
  shape?: ClipShape | undefined;
}

// ---------------------------------------------------------------------------
// Surfaces / Views
// ---------------------------------------------------------------------------

export type SurfaceId = string; // e.g. "LEFT" | "RIGHT" | "FRONT" | "BACK"

export interface SurfaceMockup {
  /** Base product image */
  baseSrc: string;
  /** Optional surface shading / glossy highlight overlay image */
  overlaySrc?: string | undefined;
  /** Sub-rectangle of the source image to focus on (for multi-item assets) */
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | undefined;
}

export interface Surface {
  id: SurfaceId;
  label: string;
  /** Path/URL to the product mockup image for this surface */
  mockupSrc: string;
  /** Extended mockup configuration for layered realism */
  mockup?: SurfaceMockup | undefined;
  /** Area within the mockup where design elements can be placed */
  printArea: PrintArea;
}

// ---------------------------------------------------------------------------
// Layer types
// ---------------------------------------------------------------------------

export type LayerId = string;

export interface BaseLayer {
  id: LayerId;
  /** Which surface this layer belongs to */
  surfaceId: SurfaceId;
  /** Optional user-facing label or automatic title */
  name?: string | undefined;
  /** X position in canvas pixels */
  x: number;
  /** Y position in canvas pixels */
  y: number;
  /** Uniform scale factor */
  scaleX: number;
  scaleY: number;
  /** Rotation in degrees */
  rotation: number;
  /** Stack order (higher = on top) */
  zIndex: number;
  /** Visibility toggle (false = hidden on canvas and export) */
  visible: boolean;
  /** Lock toggle (true = cannot be dragged, resized or rotated) */
  locked: boolean;
}

export interface ImageLayer extends BaseLayer {
  type: "image";
  /** Object URL (blob:) created from local file upload */
  srcUrl: string;
  /** Key used to store/retrieve the image blob in IndexedDB */
  fileKey?: string | undefined;
  /** Original filename for display */
  filename: string;
  /** Natural dimensions of the source image */
  naturalWidth: number;
  naturalHeight: number;
  /** Rendered width/height on canvas (before scale) */
  width: number;
  height: number;
}

export interface TextLayer extends BaseLayer {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  fontStyle: "normal" | "bold" | "italic";
  align: "left" | "center" | "right";
  /** Rendered width (text wrapping) */
  width: number;
}

export type DesignLayer = ImageLayer | TextLayer;

// ---------------------------------------------------------------------------
// Surface Design State
// ---------------------------------------------------------------------------

export interface SurfaceDesign {
  surfaceId: SurfaceId;
  layers: DesignLayer[];
  /** ID of currently selected layer */
  selectedLayerId: LayerId | null;
}

// ---------------------------------------------------------------------------
// Product Customizer Config
// ---------------------------------------------------------------------------

export type AllowedTool =
  | "upload-image"
  | "add-text"
  | "smart-fit"
  | "move"
  | "resize"
  | "rotate"
  | "delete"
  | "duplicate"
  | "lock"
  | "reorder"
  | "undo"
  | "redo"
  | "reset"
  | "export-preview"
  | "remove-bg-future"
  | "ai-adjust-future";

export interface ProductCustomizerConfig {
  /** Matches product slug in sport-data.ts */
  id: string;
  name: string;
  /** Available surfaces/views for this product */
  surfaces: Surface[];
  /** Tools available in the editor for this product */
  allowedTools: AllowedTool[];
  /** Default canvas dimensions (display) */
  canvasWidth: number;
  canvasHeight: number;
  /** Brand accent colour suggestions shown as swatches */
  colorSwatches: string[];
  /** Default font options for text layers */
  fontOptions: string[];
  /**
   * Human-readable note for developers.
   * Use to document where production mockups should be swapped in.
   */
  mockupNote?: string;
}

// ---------------------------------------------------------------------------
// Customizer State (full editor state for one product session)
// ---------------------------------------------------------------------------

export interface CustomizerState {
  productId: string;
  activeSurfaceId: SurfaceId;
  surfaces: Record<SurfaceId, SurfaceDesign>;
  /** History stack for undo (each entry is a snapshot of `surfaces`) */
  undoStack: Record<SurfaceId, SurfaceDesign>[];
  /** Redo stack */
  redoStack: Record<SurfaceId, SurfaceDesign>[];
}

// ---------------------------------------------------------------------------
// Action types for the reducer
// ---------------------------------------------------------------------------

export type LayerReorderDirection = "up" | "down" | "top" | "bottom";

export type CustomizerAction =
  | { type: "SET_ACTIVE_SURFACE"; surfaceId: SurfaceId }
  | { type: "ADD_IMAGE_LAYER"; surfaceId: SurfaceId; layer: ImageLayer }
  | { type: "ADD_TEXT_LAYER"; surfaceId: SurfaceId; layer: TextLayer }
  | {
      type: "UPDATE_LAYER";
      surfaceId: SurfaceId;
      layerId: LayerId;
      changes: Partial<DesignLayer>;
      skipHistory?: boolean | undefined;
    }
  | { type: "DELETE_LAYER"; surfaceId: SurfaceId; layerId: LayerId }
  | { type: "DUPLICATE_LAYER"; surfaceId: SurfaceId; layerId: LayerId }
  | { type: "TOGGLE_LOCK_LAYER"; surfaceId: SurfaceId; layerId: LayerId }
  | { type: "TOGGLE_VISIBILITY_LAYER"; surfaceId: SurfaceId; layerId: LayerId }
  | {
      type: "REORDER_LAYER";
      surfaceId: SurfaceId;
      layerId: LayerId;
      direction: LayerReorderDirection;
    }
  | {
      type: "COPY_DESIGN_TO_SURFACE";
      sourceSurfaceId: SurfaceId;
      targetSurfaceId: SurfaceId;
    }
  | { type: "SELECT_LAYER"; surfaceId: SurfaceId; layerId: LayerId | null }
  | { type: "RESET_SURFACE"; surfaceId: SurfaceId }
  | { type: "RESTORE_DRAFT"; state: CustomizerState }
  | { type: "CLEAR_ALL_SURFACES" }
  | { type: "UNDO" }
  | { type: "REDO" };
