/**
 * VinilArt Sport — Máscaras de personalização (fonte única de verdade).
 *
 * Uma máscara descreve a zona personalizável de uma vista do produto.
 * Regras da arquitetura:
 *  - Toda a geometria é NORMALIZADA (0..1) em relação à vista, nunca em
 *    coordenadas de ecrã. A mesma configuração funciona em desktop e mobile.
 *  - Uma máscara pode ter várias zonas separadas e formas livres/irregulares.
 *  - A MESMA máscara é usada para o contorno visível, para o recorte do design,
 *    para validar limites e para centrar/ajustar. Nunca há duas geometrias.
 *  - Tudo é serializável em JSON (pronto para a WordPress REST API).
 */

export type MaskOperation = "add" | "subtract";

export interface MaskRect {
  kind: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  /** Raio dos cantos como fração do lado menor da forma (0..0.5). */
  cornerRadius?: number | undefined;
  operation?: MaskOperation | undefined;
}

export interface MaskEllipse {
  kind: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  operation?: MaskOperation | undefined;
}

/** Polígono, forma livre ou traço de pincel fechado: pares [x0,y0,x1,y1,...]. */
export interface MaskPolygon {
  kind: "polygon";
  points: number[];
  operation?: MaskOperation | undefined;
}

/** Caminho SVG com o seu viewBox de referência (independente da resolução). */
export interface MaskPath {
  kind: "path";
  d: string;
  viewBox: { width: number; height: number };
  operation?: MaskOperation | undefined;
}

export type MaskShape = MaskRect | MaskEllipse | MaskPolygon | MaskPath;

export interface AreaMask {
  shapes: MaskShape[];
}

export interface PixelBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const EMPTY_MASK: AreaMask = { shapes: [] };

export function isMaskEmpty(mask: AreaMask | undefined): boolean {
  return !mask || mask.shapes.length === 0;
}

export function maskFromRect(
  x: number,
  y: number,
  width: number,
  height: number,
  cornerRadius?: number,
): AreaMask {
  return {
    shapes: [
      {
        kind: "rect",
        x,
        y,
        width,
        height,
        ...(cornerRadius ? { cornerRadius } : {}),
      },
    ],
  };
}

function additiveShapes(mask: AreaMask): MaskShape[] {
  return mask.shapes.filter((s) => (s.operation ?? "add") === "add");
}

export function hasSubtractShapes(mask: AreaMask): boolean {
  return mask.shapes.some((s) => s.operation === "subtract");
}

// ---------------------------------------------------------------------------
// Limites (bounding box) — apenas para centrar/ajustar, nunca substitui a forma
// ---------------------------------------------------------------------------

function shapeBounds(shape: MaskShape): PixelBox {
  switch (shape.kind) {
    case "rect":
      return { x: shape.x, y: shape.y, width: shape.width, height: shape.height };
    case "ellipse":
      return {
        x: shape.cx - shape.rx,
        y: shape.cy - shape.ry,
        width: shape.rx * 2,
        height: shape.ry * 2,
      };
    case "polygon": {
      const xs: number[] = [];
      const ys: number[] = [];
      for (let i = 0; i < shape.points.length; i += 2) {
        xs.push(shape.points[i] ?? 0);
        ys.push(shape.points[i + 1] ?? 0);
      }
      if (xs.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      return {
        x: minX,
        y: minY,
        width: Math.max(...xs) - minX,
        height: Math.max(...ys) - minY,
      };
    }
    case "path":
    default:
      // Um caminho SVG cobre, por convenção, todo o viewBox da vista.
      return { x: 0, y: 0, width: 1, height: 1 };
  }
}

/** Caixa envolvente normalizada de todas as zonas aditivas da máscara. */
export function maskBounds(mask: AreaMask): PixelBox {
  const shapes = additiveShapes(mask);
  if (shapes.length === 0) return { x: 0, y: 0, width: 1, height: 1 };

  const boxes = shapes.map(shapeBounds);
  const minX = Math.min(...boxes.map((b) => b.x));
  const minY = Math.min(...boxes.map((b) => b.y));
  const maxX = Math.max(...boxes.map((b) => b.x + b.width));
  const maxY = Math.max(...boxes.map((b) => b.y + b.height));

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/** Caixa envolvente em pixéis da tela de edição. */
export function maskPixelBounds(
  mask: AreaMask,
  canvasWidth: number,
  canvasHeight: number,
): PixelBox {
  const b = maskBounds(mask);
  return {
    x: b.x * canvasWidth,
    y: b.y * canvasHeight,
    width: b.width * canvasWidth,
    height: b.height * canvasHeight,
  };
}

// ---------------------------------------------------------------------------
// Conversão para geometria de desenho (contorno + recorte usam esta função)
// ---------------------------------------------------------------------------

export interface PixelShapeRect {
  kind: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  cornerRadius: number;
  operation: MaskOperation;
}

export interface PixelShapeEllipse {
  kind: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  operation: MaskOperation;
}

export interface PixelShapePolygon {
  kind: "polygon";
  points: number[];
  operation: MaskOperation;
}

export interface PixelShapePath {
  kind: "path";
  d: string;
  scaleX: number;
  scaleY: number;
  operation: MaskOperation;
}

export type PixelShape =
  | PixelShapeRect
  | PixelShapeEllipse
  | PixelShapePolygon
  | PixelShapePath;

/**
 * Converte a máscara normalizada para formas em pixéis da tela.
 * O contorno tracejado e o recorte do design consomem exatamente este
 * resultado — é por isso que a área visível é sempre o limite real.
 */
export function maskToPixelShapes(
  mask: AreaMask,
  canvasWidth: number,
  canvasHeight: number,
): PixelShape[] {
  return mask.shapes.map((shape): PixelShape => {
    const operation: MaskOperation = shape.operation ?? "add";

    switch (shape.kind) {
      case "rect": {
        const width = shape.width * canvasWidth;
        const height = shape.height * canvasHeight;
        return {
          kind: "rect",
          x: shape.x * canvasWidth,
          y: shape.y * canvasHeight,
          width,
          height,
          cornerRadius: (shape.cornerRadius ?? 0) * Math.min(width, height),
          operation,
        };
      }
      case "ellipse":
        return {
          kind: "ellipse",
          cx: shape.cx * canvasWidth,
          cy: shape.cy * canvasHeight,
          rx: shape.rx * canvasWidth,
          ry: shape.ry * canvasHeight,
          operation,
        };
      case "polygon": {
        const points: number[] = [];
        for (let i = 0; i < shape.points.length; i += 2) {
          points.push((shape.points[i] ?? 0) * canvasWidth);
          points.push((shape.points[i + 1] ?? 0) * canvasHeight);
        }
        return { kind: "polygon", points, operation };
      }
      case "path":
      default:
        return {
          kind: "path",
          d: shape.d,
          scaleX: canvasWidth / shape.viewBox.width,
          scaleY: canvasHeight / shape.viewBox.height,
          operation,
        };
    }
  });
}

function addPixelShapeToPath(path: Path2D, shape: PixelShape): void {
  switch (shape.kind) {
    case "rect": {
      if (shape.cornerRadius > 0 && typeof path.roundRect === "function") {
        path.roundRect(shape.x, shape.y, shape.width, shape.height, shape.cornerRadius);
      } else {
        path.rect(shape.x, shape.y, shape.width, shape.height);
      }
      return;
    }
    case "ellipse": {
      path.ellipse(shape.cx, shape.cy, shape.rx, shape.ry, 0, 0, Math.PI * 2);
      return;
    }
    case "polygon": {
      if (shape.points.length < 6) return;
      path.moveTo(shape.points[0] ?? 0, shape.points[1] ?? 0);
      for (let i = 2; i < shape.points.length; i += 2) {
        path.lineTo(shape.points[i] ?? 0, shape.points[i + 1] ?? 0);
      }
      path.closePath();
      return;
    }
    case "path":
    default: {
      const scaled = new Path2D();
      scaled.addPath(new Path2D(shape.d), new DOMMatrix().scale(shape.scaleX, shape.scaleY));
      path.addPath(scaled);
      return;
    }
  }
}

/**
 * Constrói o caminho de recorte da máscara.
 * Devolve `null` quando o ambiente não suporta Path2D (ex.: SSR).
 */
export function maskToPath2D(
  mask: AreaMask,
  canvasWidth: number,
  canvasHeight: number,
): { path: Path2D; fillRule: CanvasFillRule } | null {
  if (typeof Path2D === "undefined" || typeof DOMMatrix === "undefined") return null;
  if (isMaskEmpty(mask)) return null;

  try {
    const path = new Path2D();
    for (const shape of maskToPixelShapes(mask, canvasWidth, canvasHeight)) {
      addPixelShapeToPath(path, shape);
    }
    return {
      path,
      fillRule: hasSubtractShapes(mask) ? "evenodd" : "nonzero",
    };
  } catch {
    return null;
  }
}

/** Verifica se um ponto (em pixéis da tela) está dentro da zona personalizável. */
export function isPointInMask(
  mask: AreaMask,
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number,
): boolean {
  const built = maskToPath2D(mask, canvasWidth, canvasHeight);

  if (built && typeof document !== "undefined") {
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) return ctx.isPointInPath(built.path, x, y, built.fillRule);
  }

  const box = maskPixelBounds(mask, canvasWidth, canvasHeight);
  return (
    x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height
  );
}

/** Centro geométrico da zona personalizável (usado por "Centrar"). */
export function maskCenter(
  mask: AreaMask,
  canvasWidth: number,
  canvasHeight: number,
): { x: number; y: number } {
  const box = maskPixelBounds(mask, canvasWidth, canvasHeight);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/** Reduz uma máscara para dentro (usado para gerar áreas recomendadas). */
export function insetMask(mask: AreaMask, inset: number): AreaMask {
  const b = maskBounds(mask);
  const cx = b.x + b.width / 2;
  const cy = b.y + b.height / 2;
  const factor = Math.max(0, 1 - inset * 2);

  const scalePoint = (x: number, y: number): [number, number] => [
    cx + (x - cx) * factor,
    cy + (y - cy) * factor,
  ];

  return {
    shapes: mask.shapes.map((shape): MaskShape => {
      switch (shape.kind) {
        case "rect": {
          const [x, y] = scalePoint(shape.x, shape.y);
          return {
            ...shape,
            x,
            y,
            width: shape.width * factor,
            height: shape.height * factor,
          };
        }
        case "ellipse": {
          const [x, y] = scalePoint(shape.cx, shape.cy);
          return { ...shape, cx: x, cy: y, rx: shape.rx * factor, ry: shape.ry * factor };
        }
        case "polygon": {
          const points: number[] = [];
          for (let i = 0; i < shape.points.length; i += 2) {
            const [x, y] = scalePoint(shape.points[i] ?? 0, shape.points[i + 1] ?? 0);
            points.push(x, y);
          }
          return { ...shape, points };
        }
        case "path":
        default:
          return shape;
      }
    }),
  };
}
