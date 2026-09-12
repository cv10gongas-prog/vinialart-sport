import type {
  AllowedTool,
  ProductCustomizerConfig,
} from "@/lib/customizer/types";
import {
  shinGuardShadeOverlay,
  shinGuardSingleWhite,
  SHIN_GUARD_PATH,
} from "@/lib/customizer/mockups";

export const SHIN_GUARD_CONTOUR_POINTS: number[] = [
  0.5,0,0.5475,0.0007,0.5942,0.0028,0.6396,0.0064,0.6836,0.0114,0.7258,0.0181,
  0.7661,0.0264,0.804,0.0363,0.8394,0.048,0.872,0.0615,0.9015,0.0768,0.9275,0.094,
  0.9499,0.1131,0.9684,0.1342,0.9826,0.1574,0.9924,0.1827,0.9974,0.2101,0.9993,0.2354,
  1,0.2623,0.9996,0.2907,0.998,0.3204,0.9955,0.3514,0.992,0.3836,0.9875,0.4169,
  0.9823,0.4511,0.9762,0.4861,0.9694,0.5219,0.962,0.5584,0.9539,0.5953,0.9453,0.6327,
  0.9362,0.6704,0.9267,0.7084,0.9167,0.7464,0.9079,0.7718,0.8966,0.7962,0.8829,0.8197,
  0.8667,0.8421,0.8482,0.8633,0.8274,0.8833,0.8043,0.902,0.7789,0.9194,0.7514,0.9353,
  0.7217,0.9497,0.6898,0.9625,0.6559,0.9736,0.6199,0.983,0.5819,0.9906,0.5419,0.9963,
  0.5,1,0.4581,0.9963,0.4181,0.9906,0.3801,0.983,0.3441,0.9736,0.3102,0.9625,
  0.2783,0.9497,0.2486,0.9353,0.2211,0.9194,0.1957,0.902,0.1726,0.8833,0.1518,0.8633,
  0.1333,0.8421,0.1171,0.8197,0.1034,0.7962,0.0921,0.7718,0.0833,0.7464,0.0733,0.7084,
  0.0638,0.6704,0.0547,0.6327,0.0461,0.5953,0.038,0.5584,0.0306,0.5219,0.0238,0.4861,
  0.0177,0.4511,0.0125,0.4169,0.008,0.3836,0.0045,0.3514,0.002,0.3204,0.0004,0.2907,
  0,0.2623,0.0007,0.2354,0.0026,0.2101,0.0076,0.1827,0.0174,0.1574,0.0316,0.1342,
  0.0501,0.1131,0.0725,0.094,0.0985,0.0768,0.128,0.0615,0.1606,0.048,0.196,0.0363,
  0.2339,0.0264,0.2742,0.0181,0.3164,0.0114,0.3604,0.0064,0.4058,0.0028,0.4525,0.0007
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
        overlaySrc: shinGuardShadeOverlay,
        silhouettePath: SHIN_GUARD_PATH,
      },
      printArea: {
        xFraction: 0.2675,
        yFraction: 0.0563,
        widthFraction: 0.465,
        heightFraction: 0.8625,
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
        overlaySrc: shinGuardShadeOverlay,
        silhouettePath: SHIN_GUARD_PATH,
      },
      printArea: {
        xFraction: 0.2675,
        yFraction: 0.0563,
        widthFraction: 0.465,
        heightFraction: 0.8625,
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
    "#ffffff",
    "#00c8ff",
    "#ec008c",
    "#ffd400",
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
