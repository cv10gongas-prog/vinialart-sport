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

export const caneleirasConfig: ProductCustomizerConfig = {
  id: "caneleiras-personalizadas",
  name: "Caneleiras Personalizadas",

  surfaces: [
    {
      id: "LEFT",
      label: "Caneleira Esquerda",
      mockupSrc: caneleirasMockup,
      printArea: {
        // Approximate printable zone: centred horizontally, upper 2/3 of image
        // These values should be revised when official mockups are available
        xFraction: 0.2,
        yFraction: 0.15,
        widthFraction: 0.6,
        heightFraction: 0.65,
      },
    },
    {
      id: "RIGHT",
      label: "Caneleira Direita",
      mockupSrc: caneleirasMockup, // same photo; future: dedicated right-side mockup
      printArea: {
        xFraction: 0.2,
        yFraction: 0.15,
        widthFraction: 0.6,
        heightFraction: 0.65,
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

  mockupNote:
    "TEMPORARY: Using Lovable demo photo. Swap for transparent PNG mockup when available.",
};
