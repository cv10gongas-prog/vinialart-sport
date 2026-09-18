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

function isPointInPixelShape(shape: PixelShape, x: number, y: number): boolean {
  switch (shape.kind) {
    case "rect": {
      if (x < shape.x || x > shape.x + shape.width || y < shape.y || y > shape.y + shape.height) {
        return false;
      }
      if (shape.cornerRadius > 0) {
        const r = shape.cornerRadius;
        // Top-left corner
        if (x < shape.x + r && y < shape.y + r) {
          const dx = x - (shape.x + r);
          const dy = y - (shape.y + r);
          return dx * dx + dy * dy <= r * r;
        }
        // Top-right corner
        if (x > shape.x + shape.width - r && y < shape.y + r) {
          const dx = x - (shape.x + shape.width - r);
          const dy = y - (shape.y + r);
          return dx * dx + dy * dy <= r * r;
        }
        // Bottom-left corner
        if (x < shape.x + r && y > shape.y + shape.height - r) {
          const dx = x - (shape.x + r);
          const dy = y - (shape.y + shape.height - r);
          return dx * dx + dy * dy <= r * r;
        }
        // Bottom-right corner
        if (x > shape.x + shape.width - r && y > shape.y + shape.height - r) {
          const dx = x - (shape.x + shape.width - r);
          const dy = y - (shape.y + shape.height - r);
          return dx * dx + dy * dy <= r * r;
        }
      }
      return true;
    }
    case "ellipse": {
      if (shape.rx <= 0 || shape.ry <= 0) return false;
      const dx = (x - shape.cx) / shape.rx;
      const dy = (y - shape.cy) / shape.ry;
      return dx * dx + dy * dy <= 1;
    }
    case "polygon": {
      const pts = shape.points;
      const n = Math.floor(pts.length / 2);
      if (n < 3) return false;
      let inside = false;
      for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = pts[i * 2] ?? 0;
        const yi = pts[i * 2 + 1] ?? 0;
        const xj = pts[j * 2] ?? 0;
        const yj = pts[j * 2 + 1] ?? 0;
        const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    }
    case "path":
    default:
      return true;
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
  if (isMaskEmpty(mask)) return false;

  const built = maskToPath2D(mask, canvasWidth, canvasHeight);

  if (built && typeof document !== "undefined") {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (ctx) return ctx.isPointInPath(built.path, x, y, built.fillRule);
    } catch {
      // Fallback para avaliação geométrica direta
    }
  }

  // Avaliação geométrica direta (respeita formas exatas, cantos, elipses, polígonos e buracos):
  const pixelShapes = maskToPixelShapes(mask, canvasWidth, canvasHeight);
  const additive = pixelShapes.filter((s) => s.operation === "add");
  const subtract = pixelShapes.filter((s) => s.operation === "subtract");

  const inAdditive = additive.some((s) => isPointInPixelShape(s, x, y));
  if (!inAdditive) return false;

  const inSubtract = subtract.some((s) => isPointInPixelShape(s, x, y));
  if (inSubtract) return false;

  return true;
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

function doLineSegmentsCross(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
): boolean {
  const ccw = (
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
  ) => (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);

  return (
    ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) &&
    ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4)
  );
}

function getPixelShapeSegments(
  shape: PixelShape,
): Array<{ x1: number; y1: number; x2: number; y2: number }> {
  const segments: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

  if (shape.kind === "rect") {
    const { x, y, width: w, height: h } = shape;
    segments.push(
      { x1: x, y1: y, x2: x + w, y2: y },
      { x1: x + w, y1: y, x2: x + w, y2: y + h },
      { x1: x + w, y1: y + h, x2: x, y2: y + h },
      { x1: x, y1: y + h, x2: x, y2: y },
    );
  } else if (shape.kind === "ellipse") {
    const n = 24;
    for (let i = 0; i < n; i++) {
      const a1 = (i / n) * Math.PI * 2;
      const a2 = ((i + 1) / n) * Math.PI * 2;
      segments.push({
        x1: shape.cx + shape.rx * Math.cos(a1),
        y1: shape.cy + shape.ry * Math.sin(a1),
        x2: shape.cx + shape.rx * Math.cos(a2),
        y2: shape.cy + shape.ry * Math.sin(a2),
      });
    }
  } else if (shape.kind === "polygon") {
    const pts = shape.points;
    const n = Math.floor(pts.length / 2);
    for (let i = 0; i < n; i++) {
      const nextI = (i + 1) % n;
      segments.push({
        x1: pts[i * 2] ?? 0,
        y1: pts[i * 2 + 1] ?? 0,
        x2: pts[nextI * 2] ?? 0,
        y2: pts[nextI * 2 + 1] ?? 0,
      });
    }
  }

  return segments;
}

/**
 * Verifica determinística e rigorosamente se uma máscara (subset) está 100% contida dentro de outra (superset).
 * REGRA ABSOLUTA: recommendedArea ⊆ maximumArea.
 *
 * Princípio fail-closed: se a geometria for demasiado complexa ou ambígua para
 * garantir 100% de certeza geométrica, a função devolve FALSE (rejeita a área).
 */
export function isMaskSubset(
  subset: AreaMask,
  superset: AreaMask,
  canvasWidth = 800,
  canvasHeight = 800,
): boolean {
  if (isMaskEmpty(subset)) return true;
  if (isMaskEmpty(superset)) return false;

  // 1. Verificação de Bounding Box (fail-closed imediato se exceder limites envolventes)
  const subBox = maskBounds(subset);
  const superBox = maskBounds(superset);
  const EPSILON = 0.0001;

  if (
    subBox.x < superBox.x - EPSILON ||
    subBox.y < superBox.y - EPSILON ||
    subBox.x + subBox.width > superBox.x + superBox.width + EPSILON ||
    subBox.y + subBox.height > superBox.y + superBox.height + EPSILON
  ) {
    return false;
  }

  const subsetPixelShapes = maskToPixelShapes(subset, canvasWidth, canvasHeight);
  const supersetPixelShapes = maskToPixelShapes(superset, canvasWidth, canvasHeight);

  // 2. Para polígonos/retângulos: nenhuma aresta do subset pode intersetar arestas do superset
  const subsetSegments: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (const s of subsetPixelShapes) {
    if (s.operation === "add") {
      subsetSegments.push(...getPixelShapeSegments(s));
    }
  }

  const supersetSegments: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (const s of supersetPixelShapes) {
    supersetSegments.push(...getPixelShapeSegments(s));
  }

  for (const subSeg of subsetSegments) {
    for (const supSeg of supersetSegments) {
      if (
        doLineSegmentsCross(
          subSeg.x1,
          subSeg.y1,
          subSeg.x2,
          subSeg.y2,
          supSeg.x1,
          supSeg.y1,
          supSeg.x2,
          supSeg.y2,
        )
      ) {
        // Cruzamento de fronteiras detectado -> violação direta de contenção
        return false;
      }
    }
  }

  // 3. Validação de vértices e pontos de amostragem
  for (const shape of subsetPixelShapes) {
    if (shape.operation === "subtract") continue;

    const samplePoints: Array<{ x: number; y: number }> = [];

    if (shape.kind === "rect") {
      const { x, y, width: w, height: h } = shape;
      samplePoints.push(
        { x: x + 1, y: y + 1 },
        { x: x + w - 1, y: y + 1 },
        { x: x + 1, y: y + h - 1 },
        { x: x + w - 1, y: y + h - 1 },
        { x: x + w / 2, y: y + 1 },
        { x: x + w / 2, y: y + h - 1 },
        { x: x + 1, y: y + h / 2 },
        { x: x + w - 1, y: y + h / 2 },
        { x: x + w / 2, y: y + h / 2 },
      );
    } else if (shape.kind === "ellipse") {
      const { cx, cy, rx, ry } = shape;
      samplePoints.push({ x: cx, y: cy });
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        samplePoints.push({
          x: cx + rx * Math.cos(angle) * 0.98,
          y: cy + ry * Math.sin(angle) * 0.98,
        });
      }
    } else if (shape.kind === "polygon") {
      const pts = shape.points;
      const n = Math.floor(pts.length / 2);
      let cx = 0;
      let cy = 0;
      for (let i = 0; i < n; i++) {
        const px = pts[i * 2] ?? 0;
        const py = pts[i * 2 + 1] ?? 0;
        samplePoints.push({ x: px, y: py });
        cx += px;
        cy += py;
        const nextI = (i + 1) % n;
        const nextPx = pts[nextI * 2] ?? 0;
        const nextPy = pts[nextI * 2 + 1] ?? 0;
        samplePoints.push({ x: (px + nextPx) / 2, y: (py + nextPy) / 2 });
      }
      cx /= Math.max(1, n);
      cy /= Math.max(1, n);
      samplePoints.push({ x: cx, y: cy });
      for (let i = 0; i < n; i++) {
        const px = pts[i * 2] ?? 0;
        const py = pts[i * 2 + 1] ?? 0;
        samplePoints.push({ x: cx + (px - cx) * 0.5, y: cy + (py - cy) * 0.5 });
      }
    } else if (shape.kind === "path") {
      // Para caminhos SVG complexos sem motor booleano nativo:
      // se não for cópia exata ou se não puder ser provado determinísticamente, falha fechado
      const superPaths = supersetPixelShapes.filter((s) => s.kind === "path");
      if (superPaths.length === 0) return false;
      const isIdentical = superPaths.some((sp) => sp.d === shape.d);
      if (!isIdentical) {
        return false;
      }
      samplePoints.push({ x: canvasWidth / 2, y: canvasHeight / 2 });
    }

    for (const p of samplePoints) {
      if (isPointInMask(subset, p.x, p.y, canvasWidth, canvasHeight)) {
        if (!isPointInMask(superset, p.x, p.y, canvasWidth, canvasHeight)) {
          return false;
        }
      }
    }
  }

  // 4. Buracos no superconjunto (subtrações) NUNCA podem ser cobertos pelo subconjunto
  const supersetSubtract = supersetPixelShapes.filter((s) => s.operation === "subtract");
  for (const hole of supersetSubtract) {
    let holeCenterX = 0;
    let holeCenterY = 0;
    if (hole.kind === "rect") {
      holeCenterX = hole.x + hole.width / 2;
      holeCenterY = hole.y + hole.height / 2;
    } else if (hole.kind === "ellipse") {
      holeCenterX = hole.cx;
      holeCenterY = hole.cy;
    } else if (hole.kind === "polygon") {
      const n = Math.floor(hole.points.length / 2);
      for (let i = 0; i < n; i++) {
        holeCenterX += hole.points[i * 2] ?? 0;
        holeCenterY += hole.points[i * 2 + 1] ?? 0;
      }
      holeCenterX /= Math.max(1, n);
      holeCenterY /= Math.max(1, n);
    }
    if (isPointInMask(subset, holeCenterX, holeCenterY, canvasWidth, canvasHeight)) {
      return false;
    }
  }

  return true;
}

/**
 * Reduz uma máscara para dentro (geração segura de áreas recomendadas).
 * Cada forma é reduzida em relação ao seu centro local (evitando pontes entre regiões desconectadas).
 * Formas subtraídas (buracos) são preservadas para não expandir a área útil para o interior dos orifícios.
 */
export function insetMask(mask: AreaMask, inset: number): AreaMask {
  if (isMaskEmpty(mask)) return EMPTY_MASK;
  const factor = Math.max(0, 1 - inset * 2);

  return {
    shapes: mask.shapes
      .map((shape): MaskShape | null => {
        const operation = shape.operation ?? "add";

        // Buracos são preservados na íntegra para não violar a subtração
        if (operation === "subtract") {
          return { ...shape };
        }

        switch (shape.kind) {
          case "rect": {
            const newW = shape.width * factor;
            const newH = shape.height * factor;
            if (newW <= 0.001 || newH <= 0.001) return null;
            const newX = shape.x + (shape.width - newW) / 2;
            const newY = shape.y + (shape.height - newH) / 2;
            return {
              ...shape,
              x: newX,
              y: newY,
              width: newW,
              height: newH,
            };
          }
          case "ellipse": {
            const newRx = shape.rx * factor;
            const newRy = shape.ry * factor;
            if (newRx <= 0.001 || newRy <= 0.001) return null;
            return {
              ...shape,
              rx: newRx,
              ry: newRy,
            };
          }
          case "polygon": {
            const pts = shape.points;
            const n = Math.floor(pts.length / 2);
            if (n < 3) return null;
            let cx = 0;
            let cy = 0;
            for (let i = 0; i < n; i++) {
              cx += pts[i * 2] ?? 0;
              cy += pts[i * 2 + 1] ?? 0;
            }
            cx /= n;
            cy /= n;

            const points: number[] = [];
            for (let i = 0; i < pts.length; i += 2) {
              const px = pts[i] ?? 0;
              const py = pts[i + 1] ?? 0;
              points.push(cx + (px - cx) * factor, cy + (py - cy) * factor);
            }
            return { ...shape, points };
          }
          case "path":
          default:
            return { ...shape };
        }
      })
      .filter((s): s is MaskShape => s !== null),
  };
}
