import type {
  AllowedTool,
  ProductCustomizerConfig,
  Surface,
} from "@/lib/customizer/types";

import {
  supporterDefinitions,
  TSHIRT_SILHOUETTE_PATH,
} from "@/lib/supporter-products";

import { caneleirasConfig } from "./caneleiras";

import {
  bottleShadeOverlay,
  capShadeOverlay,
  jerseyShadeOverlay,
  jerseyBackWhite,
  jerseyFrontWhite,
  printSurfaceWhite,
  sacoShadeOverlay,
  mochilaShadeOverlay,
  shortsShadeOverlay,
  supporterItemWhite,
  JERSEY_PATH,
  JERSEY_BACK_PATH,
} from "@/lib/customizer/mockups";

const sharedTools: AllowedTool[] = [
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

const colors = [
  "#ffffff",
  "#00c8ff",
  "#ec008c",
  "#ffd400",
  "#111111",
  "#166534",
  "#1d4ed8",
];

const fonts = [
  "Archivo Black",
  "Barlow",
  "Arial",
  "Impact",
  "Georgia",
];

const JERSEY_FRONT_PRINT_CONTOUR: number[] = [
  0.2685, 0.0492,
  0.4074, 0.0000,
  0.4373, 0.0236,
  0.4779, 0.0354,
  0.5221, 0.0354,
  0.5627, 0.0236,
  0.5926, 0.0000,
  0.7315, 0.0492,
  1.0000, 0.1721,
  0.8981, 0.3852,
  0.7685, 0.3279,
  0.7778, 0.9754,
  0.7631, 0.9811,
  0.7227, 0.9876,
  0.6618, 0.9937,
  0.5858, 0.9982,
  0.5000, 1.0000,
  0.4142, 0.9982,
  0.3382, 0.9937,
  0.2773, 0.9876,
  0.2369, 0.9811,
  0.2222, 0.9754,
  0.2315, 0.3279,
  0.1019, 0.3852,
  0.0000, 0.1721,
];

const JERSEY_BACK_PRINT_CONTOUR: number[] = [
  0.2685, 0.0333,
  0.3981, 0.0000,
  0.4353, 0.0120,
  0.4779, 0.0180,
  0.5221, 0.0180,
  0.5647, 0.0120,
  0.6019, 0.0000,
  0.7315, 0.0333,
  1.0000, 0.1583,
  0.8981, 0.3750,
  0.7685, 0.3167,
  0.7778, 0.9750,
  0.7631, 0.9808,
  0.7227, 0.9874,
  0.6618, 0.9936,
  0.5858, 0.9982,
  0.5000, 1.0000,
  0.4142, 0.9982,
  0.3382, 0.9936,
  0.2773, 0.9874,
  0.2369, 0.9808,
  0.2222, 0.9750,
  0.2315, 0.3167,
  0.1019, 0.3750,
  0.0000, 0.1583,
];

function buildConfig(
  id: string,
  name: string,
  surfaces: Surface[],
): ProductCustomizerConfig {
  return {
    id,
    name,
    surfaces,
    allowedTools: sharedTools,
    canvasWidth: 480,
    canvasHeight: 480,
    colorSwatches: colors,
    fontOptions: fonts,
  };
}

/* -------------------------------------------------------------------------- */
/* EQUIPAMENTO — NÃO MEXER: ESTÁ APROVADO                                    */
/* -------------------------------------------------------------------------- */

export const equipamentoConfig = buildConfig(
  "equipamento-personalizado",
  "Equipamento Personalizado",
  [
    {
      id: "FRONT",
      label: "Frente",
      mockupSrc: jerseyFrontWhite,
      mockup: {
        baseSrc: jerseyFrontWhite,
        overlaySrc: jerseyShadeOverlay,
        silhouettePath: JERSEY_PATH,
      },
      printArea: {
        xFraction: 130 / 800,
        yFraction: 115 / 800,
        widthFraction: 540 / 800,
        heightFraction: 610 / 800,
        shape: {
          type: "contour",
          points: JERSEY_FRONT_PRINT_CONTOUR,
        },
      },
    },
    {
      id: "BACK",
      label: "Costas",
      mockupSrc: jerseyBackWhite,
      mockup: {
        baseSrc: jerseyBackWhite,
        overlaySrc: jerseyShadeOverlay,
        silhouettePath: JERSEY_BACK_PATH,
      },
      printArea: {
        xFraction: 130 / 800,
        yFraction: 125 / 800,
        widthFraction: 540 / 800,
        heightFraction: 600 / 800,
        shape: {
          type: "contour",
          points: JERSEY_BACK_PRINT_CONTOUR,
        },
      },
    },
  ],
);

/* -------------------------------------------------------------------------- */
/* BANDEIRA                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Contorno normalizado (0–1) da área de impressão da bandeira.
 * Geometria independente da resolução: serve de fonte única para recorte e limites.
 */
export const FLAG_CONTOUR_POINTS: number[] = [
  0, 0, 1, 0, 1, 1, 0, 1,
];


export const bandeiraConfig = buildConfig(
  "bandeira-personalizada",
  "Bandeira Personalizada",
  [
    {
      id: "FRONT",
      label: "Bandeira",
      mockupSrc: "/catalog/editor/bandeira-reta.svg",
      mockup: {
        baseSrc: "/catalog/editor/bandeira-reta.svg",
      },
      printArea: {
        xFraction: 36 / 480,
        yFraction: 92 / 480,
        widthFraction: 408 / 480,
        heightFraction: 288 / 480,
        shape: {
          type: "rect",
        },
      },
    },
  ],
);

/* -------------------------------------------------------------------------- */
/* ARTIGOS PARA ADEPTOS                                                       */
/* -------------------------------------------------------------------------- */

export const adeptosConfig = buildConfig(
  "artigos-adeptos",
  "Artigos para Adeptos",
  [
    {
      id: "FRONT",
      label: "Área Principal",
      mockupSrc: supporterItemWhite,
      mockup: {
        baseSrc: supporterItemWhite,
      },
      printArea: {
        xFraction: 150 / 800,
        yFraction: 180 / 800,
        widthFraction: 500 / 800,
        heightFraction: 440 / 800,
        shape: {
          type: "rounded",
          cornerRadius: 20,
        },
      },
    },
  ],
);

/* -------------------------------------------------------------------------- */
/* ESTAMPAGEM — FRENTE + COSTAS, CAMISOLA INTEIRA                            */
/* -------------------------------------------------------------------------- */

const estampagemSurface = (
  id: "FRONT" | "BACK",
  label: string,
): Surface => ({
  id,
  label,
  mockupSrc: "/catalog/editor/estampagem.svg",
  mockup: {
    baseSrc: "/catalog/editor/estampagem.svg",
    silhouettePath: TSHIRT_SILHOUETTE_PATH,
  },
  printArea: {
    xFraction: 104 / 800,
    yFraction: 128 / 800,
    widthFraction: 592 / 800,
    heightFraction: 588 / 800,
    shape: {
      type: "svg-path",
      svgPath: TSHIRT_SILHOUETTE_PATH,
    },
  },
});

export const estampagemConfig = buildConfig(
  "estampagem",
  "Estampagem",
  [
    estampagemSurface("FRONT", "Frente"),
    estampagemSurface("BACK", "Costas"),
  ],
);

/* -------------------------------------------------------------------------- */
/* IMPRESSÃO                                                                  */
/* -------------------------------------------------------------------------- */

export const impressaoConfig = buildConfig(
  "impressao",
  "Impressão",
  [
    {
      id: "FRONT",
      label: "Área de Impressão",
      mockupSrc: printSurfaceWhite,
      mockup: {
        baseSrc: printSurfaceWhite,
      },
      printArea: {
        xFraction: 175 / 800,
        yFraction: 100 / 800,
        widthFraction: 450 / 800,
        heightFraction: 600 / 800,
        shape: {
          type: "rounded",
          cornerRadius: 5,
        },
      },
    },
  ],
);

/* -------------------------------------------------------------------------- */
/* ARTIGOS GERADOS A PARTIR DE supporterDefinitions                           */
/* -------------------------------------------------------------------------- */

export const productCustomizerConfigs: Record<
  string,
  ProductCustomizerConfig
> = {
  ...Object.fromEntries(
    supporterDefinitions.map((d) => {
      const createSurface = (
        id: "FRONT" | "BACK",
        label: string,
      ): Surface => ({
        id,
        label,

        mockupSrc: `/catalog/editor/${d.base}.svg`,

        mockup: {
          baseSrc: `/catalog/editor/${d.base}.svg`,

          ...(d.id === "garrafa"
            ? { overlaySrc: bottleShadeOverlay }
            : {}),

          ...(d.id === "bone"
            ? { overlaySrc: capShadeOverlay }
            : {}),

          ...(d.id === "saco"
            ? { overlaySrc: sacoShadeOverlay }
            : {}),

          ...(d.id === "mochila"
            ? { overlaySrc: mochilaShadeOverlay }
            : {}),

          ...(d.id === "calcoes"
            ? { overlaySrc: shortsShadeOverlay }
            : {}),

          ...(d.silhouettePath
            ? { silhouettePath: d.silhouettePath }
            : {}),
        },

        printArea: d.area,
      });

      const hasBack =
        d.id === "tshirt" ||
        d.id === "saco";

      const surfaces: Surface[] = hasBack
        ? [
            createSurface("FRONT", "Frente"),
            createSurface("BACK", "Costas"),
          ]
        : [
            createSurface(
              "FRONT",
              d.id === "garrafa"
                ? "Corpo"
                : "Frente",
            ),
          ];

      const config = buildConfig(
        `${d.id}-personalizado`,
        d.name,
        surfaces,
      );

      config.projection =
        d.projection ?? "flat";

      if (d.note) {
        config.mockupNote = d.note;
      }

      return [
        config.id,
        config,
      ];
    }),
  ),

  [caneleirasConfig.id]:
    caneleirasConfig,

  [equipamentoConfig.id]:
    equipamentoConfig,

  [bandeiraConfig.id]:
    bandeiraConfig,

  [adeptosConfig.id]:
    adeptosConfig,

  [estampagemConfig.id]:
    estampagemConfig,

  [impressaoConfig.id]:
    impressaoConfig,
};

export function getProductCustomizerConfig(
  productId: string,
): ProductCustomizerConfig | undefined {
  return productCustomizerConfigs[
    productId
  ];
}

export { caneleirasConfig };
