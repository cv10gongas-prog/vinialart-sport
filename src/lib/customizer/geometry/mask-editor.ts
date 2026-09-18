/**
 * VinilArt Sport — Motor do editor de áreas (sem interface).
 *
 * A interface final do editor será construída mais tarde no WordPress. Aqui
 * fica apenas o MOTOR reutilizável: estado, ferramentas, histórico e navegação
 * (zoom/pan). Tudo em coordenadas normalizadas (0..1) da vista do produto, para
 * que o resultado seja independente da resolução e possa ser guardado/lido pela
 * WordPress REST API.
 *
 * Ferramentas suportadas: seleção, pincel (forma livre), retângulo, elipse,
 * polígono, edição de pontos, borracha, desfazer, refazer, zoom, pan, limpar,
 * restaurar.
 */

import type { AreaMask, MaskShape } from "./mask";

export type MaskTool =
  | "select"
  | "brush"
  | "rect"
  | "ellipse"
  | "polygon"
  | "edit-points"
  | "eraser";

export interface Viewport {
  zoom: number;
  panX: number;
  panY: number;
}

export interface MaskEditorState {
  tool: MaskTool;
  shapes: MaskShape[];
  selectedIndex: number | null;
  /** Forma em construção (pincel/retângulo/elipse/polígono). */
  draft: MaskShape | null;
  viewport: Viewport;
  undoStack: MaskShape[][];
  redoStack: MaskShape[][];
  /** Máscara inicial, usada por "restaurar". */
  initialShapes: MaskShape[];
}

export interface Point {
  x: number;
  y: number;
}

const MAX_HISTORY = 50;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function createMaskEditorState(mask?: AreaMask): MaskEditorState {
  const shapes = mask ? mask.shapes.map((s) => ({ ...s })) : [];
  return {
    tool: "select",
    shapes,
    selectedIndex: null,
    draft: null,
    viewport: { zoom: 1, panX: 0, panY: 0 },
    undoStack: [],
    redoStack: [],
    initialShapes: shapes.map((s) => ({ ...s })),
  };
}

export function toAreaMask(state: MaskEditorState): AreaMask {
  return { shapes: state.shapes.map((s) => ({ ...s })) };
}

function pushHistory(state: MaskEditorState): MaskEditorState {
  return {
    ...state,
    undoStack: [...state.undoStack, state.shapes.map((s) => ({ ...s }))].slice(-MAX_HISTORY),
    redoStack: [],
  };
}

// ---------------------------------------------------------------------------
// Ferramentas
// ---------------------------------------------------------------------------

export function setTool(state: MaskEditorState, tool: MaskTool): MaskEditorState {
  return { ...state, tool, draft: null };
}

export function selectShape(
  state: MaskEditorState,
  index: number | null,
): MaskEditorState {
  return { ...state, selectedIndex: index };
}

/** Início de um traço/forma. Devolve o estado com a forma provisória. */
export function beginShape(state: MaskEditorState, point: Point): MaskEditorState {
  const p = { x: clamp01(point.x), y: clamp01(point.y) };
  const operation = state.tool === "eraser" ? "subtract" : "add";

  switch (state.tool) {
    case "brush":
    case "eraser":
      return {
        ...state,
        draft: { kind: "polygon", points: [p.x, p.y], operation },
      };
    case "rect":
      return {
        ...state,
        draft: { kind: "rect", x: p.x, y: p.y, width: 0, height: 0, operation },
      };
    case "ellipse":
      return {
        ...state,
        draft: { kind: "ellipse", cx: p.x, cy: p.y, rx: 0, ry: 0, operation },
      };
    case "polygon": {
      const draft = state.draft;
      if (draft && draft.kind === "polygon") {
        return { ...state, draft: { ...draft, points: [...draft.points, p.x, p.y] } };
      }
      return { ...state, draft: { kind: "polygon", points: [p.x, p.y], operation } };
    }
    default:
      return state;
  }
}

/** Movimento do ponteiro durante a construção da forma. */
export function updateShape(state: MaskEditorState, point: Point): MaskEditorState {
  const draft = state.draft;
  if (!draft) return state;

  const p = { x: clamp01(point.x), y: clamp01(point.y) };

  if (draft.kind === "polygon" && (state.tool === "brush" || state.tool === "eraser")) {
    const last = draft.points.slice(-2);
    const dx = p.x - (last[0] ?? 0);
    const dy = p.y - (last[1] ?? 0);
    // Amostragem mínima para não gerar milhares de pontos.
    if (Math.hypot(dx, dy) < 0.004) return state;
    return { ...state, draft: { ...draft, points: [...draft.points, p.x, p.y] } };
  }

  if (draft.kind === "rect") {
    return {
      ...state,
      draft: {
        ...draft,
        x: Math.min(draft.x, p.x),
        y: Math.min(draft.y, p.y),
        width: Math.abs(p.x - draft.x),
        height: Math.abs(p.y - draft.y),
      },
    };
  }

  if (draft.kind === "ellipse") {
    return {
      ...state,
      draft: {
        ...draft,
        rx: Math.abs(p.x - draft.cx),
        ry: Math.abs(p.y - draft.cy),
      },
    };
  }

  return state;
}

/** Fecha a forma em construção e junta-a à máscara. */
export function commitShape(state: MaskEditorState): MaskEditorState {
  const draft = state.draft;
  if (!draft) return state;

  if (draft.kind === "polygon" && draft.points.length < 6) {
    return { ...state, draft: null };
  }
  if (draft.kind === "rect" && (draft.width < 0.005 || draft.height < 0.005)) {
    return { ...state, draft: null };
  }
  if (draft.kind === "ellipse" && (draft.rx < 0.005 || draft.ry < 0.005)) {
    return { ...state, draft: null };
  }

  const next = pushHistory(state);
  return {
    ...next,
    shapes: [...next.shapes, draft],
    draft: null,
    selectedIndex: next.shapes.length,
  };
}

export function cancelShape(state: MaskEditorState): MaskEditorState {
  return { ...state, draft: null };
}

/** Move um ponto de um polígono (ferramenta "edição de pontos"). */
export function moveShapePoint(
  state: MaskEditorState,
  shapeIndex: number,
  pointIndex: number,
  point: Point,
): MaskEditorState {
  const shape = state.shapes[shapeIndex];
  if (!shape || shape.kind !== "polygon") return state;

  const points = [...shape.points];
  points[pointIndex * 2] = clamp01(point.x);
  points[pointIndex * 2 + 1] = clamp01(point.y);

  const next = pushHistory(state);
  const shapes = [...next.shapes];
  shapes[shapeIndex] = { ...shape, points };
  return { ...next, shapes };
}

export function deleteShape(state: MaskEditorState, shapeIndex: number): MaskEditorState {
  if (!state.shapes[shapeIndex]) return state;
  const next = pushHistory(state);
  return {
    ...next,
    shapes: next.shapes.filter((_, index) => index !== shapeIndex),
    selectedIndex: null,
  };
}

// ---------------------------------------------------------------------------
// Histórico e limpeza
// ---------------------------------------------------------------------------

export function undo(state: MaskEditorState): MaskEditorState {
  const previous = state.undoStack[state.undoStack.length - 1];
  if (!previous) return state;
  return {
    ...state,
    shapes: previous,
    undoStack: state.undoStack.slice(0, -1),
    redoStack: [...state.redoStack, state.shapes.map((s) => ({ ...s }))],
    draft: null,
    selectedIndex: null,
  };
}

export function redo(state: MaskEditorState): MaskEditorState {
  const next = state.redoStack[state.redoStack.length - 1];
  if (!next) return state;
  return {
    ...state,
    shapes: next,
    redoStack: state.redoStack.slice(0, -1),
    undoStack: [...state.undoStack, state.shapes.map((s) => ({ ...s }))],
    draft: null,
    selectedIndex: null,
  };
}

export function clearMask(state: MaskEditorState): MaskEditorState {
  const next = pushHistory(state);
  return { ...next, shapes: [], draft: null, selectedIndex: null };
}

export function resetMask(state: MaskEditorState): MaskEditorState {
  const next = pushHistory(state);
  return {
    ...next,
    shapes: next.initialShapes.map((s) => ({ ...s })),
    draft: null,
    selectedIndex: null,
  };
}

// ---------------------------------------------------------------------------
// Zoom / Pan e conversão de coordenadas
// ---------------------------------------------------------------------------

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 8;

export function zoomBy(
  state: MaskEditorState,
  factor: number,
  focus: Point = { x: 0.5, y: 0.5 },
): MaskEditorState {
  const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, state.viewport.zoom * factor));
  const ratio = zoom / state.viewport.zoom;
  return {
    ...state,
    viewport: {
      zoom,
      panX: focus.x - (focus.x - state.viewport.panX) * ratio,
      panY: focus.y - (focus.y - state.viewport.panY) * ratio,
    },
  };
}

export function panBy(state: MaskEditorState, dx: number, dy: number): MaskEditorState {
  return {
    ...state,
    viewport: {
      ...state.viewport,
      panX: state.viewport.panX + dx,
      panY: state.viewport.panY + dy,
    },
  };
}

export function resetViewport(state: MaskEditorState): MaskEditorState {
  return { ...state, viewport: { zoom: 1, panX: 0, panY: 0 } };
}

/** Converte pixéis do elemento visível em coordenadas normalizadas da vista. */
export function screenToNormalized(
  viewport: Viewport,
  point: Point,
  elementWidth: number,
  elementHeight: number,
): Point {
  const x = point.x / (elementWidth || 1);
  const y = point.y / (elementHeight || 1);
  return {
    x: (x - viewport.panX) / viewport.zoom,
    y: (y - viewport.panY) / viewport.zoom,
  };
}

/** Converte coordenadas normalizadas em pixéis do elemento visível. */
export function normalizedToScreen(
  viewport: Viewport,
  point: Point,
  elementWidth: number,
  elementHeight: number,
): Point {
  return {
    x: (point.x * viewport.zoom + viewport.panX) * elementWidth,
    y: (point.y * viewport.zoom + viewport.panY) * elementHeight,
  };
}
