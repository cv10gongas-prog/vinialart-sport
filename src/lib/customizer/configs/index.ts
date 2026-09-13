import type {
  AllowedTool,
  ProductCustomizerConfig,
  Surface,
} from "@/lib/customizer/types";

import {
  supporterDefinitions,
  TSHIRT_CONTOUR_POINTS,
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

/**
 * Contorno aprovado do Equipamento Personalizado.
 * NÃO reduzir novamente para uma caixa no peito.
 */
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
/* EQUIPAMENTO PERSONALIZADO — APROVADO                                       */
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

export const FLAG_CONTOUR_POINTS: number[] = [
  0, 0.0288,
  0.04, 0.0133,
  0.0796, 0.004,
  0.1187, 0,
  0.1575, 0.0004,
  0.1959, 0.0044,
  0.2341, 0.0111,
  0.2722, 0.0195,
  0.3101, 0.0288,
  0.3479, 0.0382,
  0.3857, 0.0466,
  0.4236, 0.0532,
  0.4615, 0.0572,
  0.4996, 0.0577,
  0.5379, 0.0537,
  0.5765, 0.0444,
  0.6154, 0.0288,
  0.6452, 0.0163,
  0.6746, 0.0077,
  0.7035, 0.0026,
  0.7318, 0.0004,
  0.7595, 0.0008,
  0.7864, 0.0032,
  0.8125, 0.0071,
  0.8377, 0.012,
  0.862, 0.0175,
  0.8853, 0.0229,
  0.9076, 0.0279,
  0.9286, 0.032,
  0.9485, 0.0346,
  0.967, 0.0353,
  0.9842, 0.0335,
  1, 0.0288,
  1, 0.9712,
  0.9842, 0.9758,
  0.967, 0.9776,
  0.9485, 0.9769,
  0.9286, 0.9743,
  0.9076, 0.9703,
  0.8853, 0.9652,
  0.862, 0.9598,
  0.8377, 0.9543,
  0.8125, 0.9494,
  0.7864, 0.9455,
  0.7595, 0.9431,
  0.7318, 0.9428,
  0.7035, 0.9449,
  0.6746, 0.95,
  0.6452, 0.9586,
  0.6154, 0.9712,
  0.5765, 0.9867,
  0.5379, 0.996,
  0.4996, 1,
  0.4615, 0.9996,
  0.4236, 0.9956,
  0.3857, 0.9889,
  0.3479, 0.9805,
  0.3101, 0.9712,
  0.2722, 0.9618,
  0.2341, 0.9534,
  0.1959, 0.9468,
  0.1575, 0.9428,
  0.1187, 0.9423,
  0.0796, 0.9463,
  0.04, 0.9556,
  0, 0.9712,
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
        /*
         * O mockup físico ocupa x=150..650 e y=180..620
         * dentro da grelha 800x800.
         */
        xFraction: 150 / 800,
        yFraction: 180 / 800,
        widthFraction: 500 / 800,
        heightFraction: 440 / 800,
        shape: {
          type: "rounded",
          cornerRadius: 12,
        },
      },
    },
  ],
);

/* -------------------------------------------------------------------------- */
/* ESTAMPAGEM — CAMISOLA COMPLETA                                             */
/* -------------------------------------------------------------------------- */

export const estampagemConfig = buildConfig(
  "estampagem",
  "Estampagem",
  [
    {
      id: "FRONT",
      label: "Área Principal",
      mockupSrc: "/catalog/editor/estampagem.svg",
      mockup: {
        baseSrc: "/catalog/editor/estampagem.svg",
      },
      printArea: {
        /*
         * O SVG de estampagem usa exatamente a mesma geometria-base
         * de camisola da T-shirt.
         *
         * Logo: mangas + peito + corpo inteiro.
         */
        xFraction: 104 / 800,
        yFraction: 128 / 800,
        widthFraction: 592 / 800,
        heightFraction: 588 / 800,
        shape: {
          type: "contour",
          points: TSHIRT_CONTOUR_POINTS,
        },
      },
    },
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
        /*
         * Folha física completa do mockup:
         * x=175..625 / y=100..700 em 800x800.
         */
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
/* CONFIGS GERADAS A PARTIR DE SUPPORTER PRODUCTS                             */
/* -------------------------------------------------------------------------- */

export const productCustomizerConfigs: Record<
  string,
  ProductCustomizerConfig
> = {
  ...Object.fromEntries(
    supporterDefinitions.map((d) => {
      const surface: Surface = {
        id: "FRONT",
        label: d.id === "garrafa" ? "Corpo" : "Frente",

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
      };

      const config = buildConfig(
        `${d.id}-personalizado`,
        d.name,
        [surface],
      );

      config.projection = d.projection ?? "flat";

      if (d.note) {
        config.mockupNote = d.note;
      }

      return [config.id, config];
    }),
  ),

  [caneleirasConfig.id]: caneleirasConfig,
  [equipamentoConfig.id]: equipamentoConfig,
  [bandeiraConfig.id]: bandeiraConfig,
  [adeptosConfig.id]: adeptosConfig,
  [estampagemConfig.id]: estampagemConfig,
  [impressaoConfig.id]: impressaoConfig,
};

export function getProductCustomizerConfig(
  productId: string,
): ProductCustomizerConfig | undefined {
  return productCustomizerConfigs[productId];
}

export { caneleirasConfig };
