import type {
  AllowedTool,
  ProductCustomizerConfig,
} from "@/lib/customizer/types";
import { shinGuardSingleWhite } from "@/lib/customizer/mockups";

const SHIN_GUARD_CONTOUR_POINTS: number[] = [
  0.5, 0.0,
  0.72, 0.02,
  0.88, 0.08,
  0.96, 0.18,
  0.98, 0.32,
  0.94, 0.48,
  0.88, 0.65,
  0.8, 0.82,
  0.68, 0.94,
  0.5, 1.0,
  0.32, 0.94,
  0.2, 0.82,
  0.12, 0.65,
  0.06, 0.48,
  0.02, 0.32,
  0.04, 0.18,
  0.12, 0.08,
  0.28, 0.02,
];

const tools: AllowedTool[] = [
  "upload-image",
  "add-text",
  "smart-fit",
  "move",
  "resize",
  "rotate",
  "delete",
  "duplicate",
  "lock",
  "reorder",
  "undo",
  "redo",
  "reset",
  "export-preview",
  "remove-bg-future",
  "ai-adjust-future",
];

export const caneleirasConfig: ProductCustomizerConfig = {
  id: "caneleiras-personalizadas",
  name: "Caneleiras Personalizadas",

  surfaces: [
    {
      id: "LEFT",
      label: "Caneleira Esquerda",
      mockupSrc: shinGuardSingleWhite,
      mockup: {
        baseSrc: shinGuardSingleWhite,
      },
      printArea: {
        xFraction: 0.3,
        yFraction: 0.105,
        widthFraction: 0.4,
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
      mockupSrc: shinGuardSingleWhite,
      mockup: {
        baseSrc: shinGuardSingleWhite,
      },
      printArea: {
        xFraction: 0.3,
        yFraction: 0.105,
        widthFraction: 0.4,
        heightFraction: 0.79,
        shape: {
          type: "contour",
          points: SHIN_GUARD_CONTOUR_POINTS,
        },
      },
    },
  ],

  allowedTools: tools,

  canvasWidth: 480,
  canvasHeight: 480,

  colorSwatches: [
    "#ec008c",
    "#00c8ff",
    "#ffd400",
    "#ffffff",
    "#111111",
    "#166534",
    "#1d4ed8",
  ],

  fontOptions: [
    "Archivo Black",
    "Barlow",
    "Arial",
    "Impact",
    "Georgia",
  ],
};
