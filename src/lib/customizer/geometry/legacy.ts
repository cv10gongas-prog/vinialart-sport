/**
 * Conversão das áreas de impressão atuais (PrintArea + ClipShape) para o
 * modelo de máscaras normalizadas.
 *
 * IMPORTANTE: esta conversão é fiel — não recalibra nada. As configurações
 * aprovadas (Caneleiras, Equipamento, Boné, Garrafa, Bandeira, restantes
 * artigos) continuam com exatamente a mesma geometria.
 */

import type { PrintArea } from "@/lib/customizer/types";
import type { AreaMask, MaskShape } from "./mask";

/** Espaço de referência dos caminhos SVG usados nos mockups atuais. */
export const SVG_REFERENCE_SIZE = 800;

export function printAreaToMask(
  printArea: PrintArea,
  canvasWidth: number,
  canvasHeight: number,
): AreaMask {
  const { xFraction: x, yFraction: y, widthFraction: w, heightFraction: h } = printArea;
  const shape = printArea.shape;

  if ((shape?.type === "svg-path" || shape?.type === "silhouette") && shape.svgPath) {
    const maskShape: MaskShape = {
      kind: "path",
      d: shape.svgPath,
      viewBox: { width: SVG_REFERENCE_SIZE, height: SVG_REFERENCE_SIZE },
    };
    return { shapes: [maskShape] };
  }

  if (shape?.type === "contour" && shape.points && shape.points.length >= 6) {
    // Os pontos do contorno são relativos à área de impressão (0..1).
    // Passam a ser relativos à vista completa, mantendo a mesma forma.
    const points: number[] = [];
    for (let i = 0; i < shape.points.length; i += 2) {
      points.push(x + (shape.points[i] ?? 0) * w);
      points.push(y + (shape.points[i + 1] ?? 0) * h);
    }
    return { shapes: [{ kind: "polygon", points }] };
  }

  if (shape?.type === "rounded") {
    const radiusPx =
      typeof shape.cornerRadius === "number" ? shape.cornerRadius : 12;
    const shorterSide = Math.min(w * canvasWidth, h * canvasHeight) || 1;
    return {
      shapes: [
        {
          kind: "rect",
          x,
          y,
          width: w,
          height: h,
          cornerRadius: Math.min(0.5, radiusPx / shorterSide),
        },
      ],
    };
  }

  return { shapes: [{ kind: "rect", x, y, width: w, height: h }] };
}
