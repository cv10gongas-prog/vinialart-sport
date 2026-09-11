import type {
  AllowedTool,
  ProductCustomizerConfig,
  Surface,
} from "@/lib/customizer/types";

import { caneleirasConfig } from "./caneleiras";

import {
  flagWhite,
  jerseyBackWhite,
  jerseyFrontWhite,
  printSurfaceWhite,
  supporterItemWhite,
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
  "#ec008c",
  "#00c8ff",
  "#ffd400",
  "#ffffff",
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
      },
      printArea: {
        xFraction: 0.33,
        yFraction: 0.23,
        widthFraction: 0.34,
        heightFraction: 0.58,
        shape: {
          type: "rounded",
          cornerRadius: 16,
        },
      },
    },
    {
      id: "BACK",
      label: "Costas",
      mockupSrc: jerseyBackWhite,
      mockup: {
        baseSrc: jerseyBackWhite,
      },
      printArea: {
        xFraction: 0.33,
        yFraction: 0.23,
        widthFraction: 0.34,
        heightFraction: 0.58,
        shape: {
          type: "rounded",
          cornerRadius: 16,
        },
      },
    },
  ],
);

export const bandeiraConfig = buildConfig(
  "bandeira-personalizada",
  "Bandeira Personalizada",
  [
    {
      id: "FRONT",
      label: "Bandeira",
      mockupSrc: flagWhite,
      mockup: {
        baseSrc: flagWhite,
      },
      printArea: {
        xFraction: 0.165,
        yFraction: 0.16,
        widthFraction: 0.69,
        heightFraction: 0.58,
        shape: {
          type: "rounded",
          cornerRadius: 10,
        },
      },
    },
  ],
);

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
        xFraction: 0.15,
        yFraction: 0.39,
        widthFraction: 0.7,
        heightFraction: 0.21,
        shape: {
          type: "rounded",
          cornerRadius: 12,
        },
      },
    },
  ],
);

export const estampagemConfig = buildConfig(
  "estampagem",
  "Estampagem",
  [
    {
      id: "FRONT",
      label: "Área Principal",
      mockupSrc: jerseyFrontWhite,
      mockup: {
        baseSrc: jerseyFrontWhite,
      },
      printArea: {
        xFraction: 0.31,
        yFraction: 0.25,
        widthFraction: 0.38,
        heightFraction: 0.43,
        shape: {
          type: "rounded",
          cornerRadius: 12,
        },
      },
    },
  ],
);

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
        xFraction: 0.255,
        yFraction: 0.175,
        widthFraction: 0.49,
        heightFraction: 0.65,
        shape: {
          type: "rounded",
          cornerRadius: 6,
        },
      },
    },
  ],
);

export const productCustomizerConfigs: Record<
  string,
  ProductCustomizerConfig
> = {
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
