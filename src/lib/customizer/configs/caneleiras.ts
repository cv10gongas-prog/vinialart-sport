/**
 * VinilArt Sport — Caneleiras Product Config
 *
 * This is the single source-of-truth configuration for the
 * "Caneleiras Personalizadas" product in the customizer.
 *
 * MOCKUP NOTE:
 *   The current mockup image (prod-caneleiras.jpg) is a demonstration photo
 *   from Lovable, not a transparent/official production mockup.
 *   When production-ready mockups are available (ideally PNG with transparency
 *   or SVG overlays), swap `mockupSrc` for each surface and adjust the
 *   `printArea` fractions accordingly.
 *   The printArea fractions below are calibrated for the current mockup image
 *   to give a reasonable approximation of a printable zone.
 *
 * PRINT AREA:
 *   Using fractional coordinates (0–1) so the area scales with the canvas.
 *   LEFT caneleira printable zone ≈ centre-left of the image.
 *   RIGHT caneleira reuses same mockup (mirrored visually) with same area.
 */

import type { ProductCustomizerConfig } from "@/lib/customizer/types";
import caneleirasMockup from "@/assets/prod-caneleiras.jpg";

/**
 * Normalized 2D contour polygon of a shin guard shell (relative to print area bounding box: 0..1).
 * Smooth curved top, ergonomic side bulges, tapering smoothly towards the ankle.
 */
const SHIN_GUARD_CONTOUR_POINTS: number[] = [
  0.50, 0.00, // Top apex center
  0.72, 0.02, // Top right curve
  0.88, 0.08, // Upper right shoulder
  0.96, 0.18, // High right edge
  0.98, 0.32, // Right belly maximum width
  0.94, 0.48, // Mid right transition
  0.88, 0.65, // Lower right taper
  0.80, 0.82, // Ankle right curve
  0.68, 0.94, // Bottom right corner
  0.50, 1.00, // Bottom center apex
  0.32, 0.94, // Bottom left corner
  0.20, 0.82, // Ankle left curve
  0.12, 0.65, // Lower left taper
  0.06, 0.48, // Mid left transition
  0.02, 0.32, // Left belly maximum width
  0.04, 0.18, // High left edge
  0.12, 0.08, // Upper left shoulder
  0.28, 0.02, // Top left curve
];

export const caneleirasConfig: ProductCustomizerConfig = {
  id: "caneleiras-personalizadas",
  name: "Caneleiras Personalizadas",

  surfaces: [
    {
      id: "LEFT",
      label: "Caneleira Esquerda",
      mockupSrc: caneleirasMockup,
      mockup: {
        baseSrc: caneleirasMockup,
        // Focus frame on Left Caneleira
        crop: {
          x: 0.06,
          y: 0.04,
          width: 0.46,
          height: 0.88,
        },
      },
      printArea: {
        xFraction: 0.13,
        yFraction: 0.07,
        widthFraction: 0.34,
        heightFraction: 0.79,
        shape: {
          type: "contour",
          points: SHIN_GUARD_CONTOUR_POINTS,
        },
      },
    },
    {
      id: "RIGHT",
      label: "Caneleira Direita",
      mockupSrc: caneleirasMockup,
      mockup: {
        baseSrc: caneleirasMockup,
        // Focus frame on Right Caneleira (symmetrical pairing)
        crop: {
          x: 0.48,
          y: 0.04,
          width: 0.46,
          height: 0.88,
        },
      },
      printArea: {
        xFraction: 0.53,
        yFraction: 0.07,
        widthFraction: 0.34,
        heightFraction: 0.79,
        shape: {
          type: "contour",
          points: SHIN_GUARD_CONTOUR_POINTS,
        },
      },
    },
  ],

  allowedTools: [
    "upload-image",
    "add-text",
    "smart-fit",
    "move",
    "resize",
    "rotate",
    "delete",
    "undo",
    "redo",
    "reset",
    "export-preview",
    "remove-bg-future",
    "ai-adjust-future",
  ],

  canvasWidth: 480,
  canvasHeight: 480,

  colorSwatches: [
    "oklch(0.63 0.28 342)",  // magenta
    "oklch(0.79 0.15 212)",  // cyan
    "oklch(0.87 0.18 96)",   // yellow
    "oklch(0.985 0 0)",      // white
    "oklch(0.14 0.006 285)", // dark (near black)
    "oklch(0.45 0.25 145)",  // green sport
    "oklch(0.55 0.25 260)",  // blue sport
  ],

  fontOptions: [
    "Archivo Black",
    "Barlow",
    "Arial",
    "Impact",
    "Georgia",
  ],

  /*
   * INTERNAL NOTE: Current mockup image (prod-caneleiras.jpg) is a demonstration photo.
   * When production-ready mockups are available (ideally PNG with transparency or SVG overlays),
   * swap `mockupSrc` for each surface and adjust the `printArea` fractions accordingly.
   * Until then, mockupNote is intentionally omitted from the config to keep the UI clean.
   */
};
