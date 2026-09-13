import type { Product } from "./sport-data";
import type { PrintArea } from "./customizer/types";

export const CAP_CROWN_POINTS: number[] = [
  0.5000, 0.0000,
  0.5924, 0.0044,
  0.6815, 0.0175,
  0.7707, 0.0480,
  0.8408, 0.0961,
  0.9013, 0.1659,
  0.9427, 0.2533,
  0.9713, 0.3493,
  0.9904, 0.4629,
  0.9968, 0.5808,
  1.0000, 0.7118,
  1.0000, 0.8428,
  0.9968, 0.9432,
  0.9873, 1.0000,
  0.9013, 0.9956,
  0.8057, 0.9782,
  0.7102, 0.9651,
  0.6146, 0.9520,
  0.5000, 0.9476,
  0.3854, 0.9520,
  0.2898, 0.9651,
  0.1943, 0.9782,
  0.0987, 0.9956,
  0.0127, 1.0000,
  0.0032, 0.9432,
  0.0000, 0.8428,
  0.0000, 0.7118,
  0.0032, 0.5808,
  0.0096, 0.4629,
  0.0287, 0.3493,
  0.0573, 0.2533,
  0.0987, 0.1659,
  0.1592, 0.0961,
  0.2293, 0.0480,
  0.3185, 0.0175,
  0.4076, 0.0044,
];

export const BOTTLE_CONTOUR_POINTS: number[] = [
  0.3200, 0.0000,
  0.6800, 0.0000,
  0.6800, 0.0682,
  1.0000, 0.1326,
  1.0000, 0.9571,
  0.9200, 1.0000,
  0.0800, 1.0000,
  0.0000, 0.9571,
  0.0000, 0.1326,
  0.3200, 0.0682,
];

export const SACO_CONTOUR_POINTS: number[] = [
  0.4875, 0.0000,
  0.7058, 0.0000,
  0.7631, 0.0454,
  0.8280, 0.1363,
  0.8879, 0.3181,
  0.9303, 0.6363,
  0.9876, 0.9092,
  1.0000, 0.9546,
  0.9677, 1.0000,
  0.5400, 1.0000,
  0.1123, 1.0000,
  0.0000, 0.9546,
  0.0349, 0.9092,
  0.0575, 0.8182,
  0.0823, 0.6818,
  0.0974, 0.4999,
  0.1172, 0.3181,
  0.1472, 0.1818,
  0.1995, 0.0908,
  0.2694, 0.0000,
];

export const TSHIRT_CONTOUR_POINTS: number[] = [
  0.3378, 0.0000,
  0.4189, 0.0486,
  0.5000, 0.0811,
  0.5811, 0.0486,
  0.6622, 0.0000,
  0.8784, 0.0946,
  1.0000, 0.3378,
  0.8378, 0.4189,
  0.7568, 0.2838,
  0.7703, 0.9730,
  0.6351, 0.9946,
  0.5000, 1.0000,
  0.3649, 0.9946,
  0.2297, 0.9730,
  0.2432, 0.2838,
  0.1622, 0.4189,
  0.0000, 0.3378,
  0.1216, 0.0946,
];

export const SHORTS_CONTOUR_POINTS: number[] = [
  0.154, 0.012,
  0.319, 0.003,
  0.500, 0.000,
  0.681, 0.003,
  0.846, 0.012,
  0.855, 0.125,
  0.898, 0.363,
  0.946, 0.631,
  0.982, 0.839,
  1.000, 0.982,
  0.801, 1.000,
  0.596, 0.988,
  0.560, 0.810,
  0.524, 0.631,
  0.500, 0.497,
  0.476, 0.631,
  0.440, 0.810,
  0.404, 0.988,
  0.199, 1.000,
  0.000, 0.982,
  0.018, 0.839,
  0.054, 0.631,
  0.102, 0.363,
  0.145, 0.125,
];

export const MOCHILA_CONTOUR_POINTS: number[] = [
  0.5000, 0.0350,
  0.6200, 0.0350,
  0.6600, 0.0000,
  0.7571, 0.0000,
  0.9294, 0.0207,
  0.9520, 0.0414,
  0.9633, 0.0621,
  0.9661, 0.0828,
  0.9718, 0.1036,
  0.9746, 0.1243,
  0.9774, 0.1450,
  0.9802, 0.1657,
  0.9831, 0.1864,
  0.9859, 0.2071,
  0.9887, 0.2278,
  0.9915, 0.2692,
  0.9944, 0.3107,
  0.9972, 0.3521,
  1.0000, 0.4142,
  1.0000, 0.5178,
  1.0000, 0.6213,
  1.0000, 0.7041,
  0.9972, 0.7870,
  0.9944, 0.8698,
  0.9915, 0.9320,
  0.9887, 0.9941,
  1.0000, 1.0000,
  0.0000, 1.0000,
  0.0056, 0.9941,
  0.0028, 0.9320,
  0.0028, 0.8698,
  0.0000, 0.7870,
  0.0000, 0.7041,
  0.0000, 0.6213,
  0.0000, 0.5178,
  0.0000, 0.4142,
  0.0028, 0.3521,
  0.0056, 0.3107,
  0.0085, 0.2692,
  0.0113, 0.2278,
  0.0141, 0.2071,
  0.0169, 0.1864,
  0.0198, 0.1657,
  0.0254, 0.1243,
  0.0311, 0.0828,
  0.0367, 0.0621,
  0.0480, 0.0414,
  0.0734, 0.0207,
  0.2740, 0.0000,
  0.3400, 0.0000,
  0.3800, 0.0350,
];

export const SHORTS_SILHOUETTE_PATH = `
  M 208 137
  C 300 132, 500 132, 592 137
  L 597 200
  C 620 333, 647 483, 677 680
  C 633 687, 567 690, 453 683
  C 433 583, 413 483, 400 408
  C 387 483, 367 583, 347 683
  C 233 690, 167 687, 123 680
  C 153 483, 180 333, 203 200
  Z
`;

export const BRACADEIRA_SILHOUETTE_PATH = `
  M 90 300
  H 710
  A 10 10 0 0 1 720 310
  V 490
  A 10 10 0 0 1 710 500
  H 90
  A 10 10 0 0 1 80 490
  V 310
  A 10 10 0 0 1 90 300
  Z
`;

export const BOTTLE_SILHOUETTE_PATH = `
  M 364 177
  C 364 212, 300 218, 300 245
  L 300 668
  C 300 684, 316 690, 340 690
  L 460 690
  C 484 690, 500 684, 500 668
  L 500 245
  C 500 218, 436 212, 436 177
  Z
`;

export const CAP_SILHOUETTE_PATH = `
  M 398.3 136.7
  L 446.7 138.3
  L 493.3 143.3
  L 540.0 155.0
  L 576.7 173.3
  L 608.3 200.0
  L 630.0 233.3
  L 645.0 270.0
  L 655.0 313.3
  L 658.3 358.3
  L 660.0 408.3
  L 660.0 458.3
  L 658.3 496.7
  L 653.3 518.3
  L 608.3 516.7
  L 558.3 510.0
  L 508.3 505.0
  L 458.3 500.0
  L 398.3 498.3
  L 338.3 500.0
  L 288.3 505.0
  L 238.3 510.0
  L 188.3 516.7
  L 143.3 518.3
  L 138.3 496.7
  L 136.7 458.3
  L 136.7 408.3
  L 138.3 358.3
  L 141.7 313.3
  L 151.7 270.0
  L 166.7 233.3
  L 188.3 200.0
  L 220.0 173.3
  L 256.7 155.0
  L 303.3 143.3
  L 350.0 138.3
  Z
`;

export const SACO_SILHOUETTE_PATH = `
  M 388.0 96.3
  L 511.1 96.3
  L 543.4 124.4
  L 564.5 152.5
  L 580.0 180.6
  L 591.3 208.8
  L 601.1 236.9
  L 608.1 265.0
  L 613.8 293.1
  L 619.4 321.3
  L 623.6 349.4
  L 626.4 377.5
  L 629.2 405.6
  L 632.0 433.8
  L 634.8 461.9
  L 637.7 490.0
  L 640.5 518.1
  L 644.7 546.3
  L 648.9 574.4
  L 655.9 602.5
  L 663.0 630.6
  L 670.0 658.8
  L 677.0 686.9
  L 658.8 715.0
  L 417.6 715.0
  L 176.4 715.0
  L 113.1 686.9
  L 132.8 658.8
  L 134.2 630.6
  L 145.5 602.5
  L 153.9 574.4
  L 155.3 546.3
  L 159.5 518.1
  L 162.3 490.0
  L 163.8 461.9
  L 166.6 433.8
  L 168.0 405.6
  L 170.8 377.5
  L 173.6 349.4
  L 176.4 321.3
  L 179.2 293.1
  L 182.0 265.0
  L 187.7 236.9
  L 196.1 208.8
  L 207.3 180.6
  L 225.6 152.5
  L 245.3 124.4
  L 265.0 96.3
  Z
`;

export const MOCHILA_SILHOUETTE_PATH = `
  M 396.12 160.65
  L 429.31 160.65
  L 440.37 142.16
  L 467.22 142.16
  L 514.87 153.09
  L 521.13 164.03
  L 524.25 174.96
  L 525.02 185.89
  L 526.60 196.88
  L 527.38 207.81
  L 528.15 218.74
  L 528.92 229.68
  L 529.73 240.61
  L 530.50 251.54
  L 531.27 262.47
  L 532.05 284.34
  L 532.85 306.26
  L 533.63 328.13
  L 534.40 360.92
  L 534.40 415.64
  L 534.40 470.31
  L 534.40 514.04
  L 533.63 557.82
  L 532.85 601.55
  L 532.05 634.41
  L 531.27 667.20
  L 534.40 670.32
  L 257.84 670.32
  L 259.39 667.20
  L 258.61 634.41
  L 258.61 601.55
  L 257.84 557.82
  L 257.84 514.04
  L 257.84 470.31
  L 257.84 415.64
  L 257.84 360.92
  L 258.61 328.13
  L 259.39 306.26
  L 260.19 284.34
  L 260.97 262.47
  L 261.74 251.54
  L 262.51 240.61
  L 263.32 229.68
  L 264.86 207.81
  L 266.44 185.89
  L 267.99 174.96
  L 271.11 164.03
  L 278.14 153.09
  L 333.62 142.16
  L 351.87 142.16
  L 362.93 160.65
  Z
`;

export const TSHIRT_SILHOUETTE_PATH = `
  M 304 128
  C 340 156, 460 156, 496 128
  L 624 184
  L 696 328
  L 600 376
  L 552 296
  L 560 704
  C 480 716, 320 716, 240 704
  L 248 296
  L 200 376
  L 104 328
  L 176 184
  Z
`;

export const supporterDefinitions: {
  id: string;
  name: string;
  photo: string;
  base: string;
  area: PrintArea;
  note?: string;
  projection?: "cylinder";
  isDirectCustomizable?: boolean;
  silhouettePath?: string;
}[] = [
  {
    id: "garrafa",
    name: "Garrafa",
    photo: "base-garrafa.jpg",
    base: "garrafa",
    area: {
      xFraction: 300 / 800,
      yFraction: 177 / 800,
      widthFraction: 200 / 800,
      heightFraction: 513 / 800,
      shape: {
        type: "svg-path",
        svgPath: BOTTLE_SILHOUETTE_PATH,
      },
    },
    projection: "cylinder",
    silhouettePath: BOTTLE_SILHOUETTE_PATH,
    note: "Personalização em todo o corpo útil da garrafa.",
    isDirectCustomizable: true,
  },
  {
    id: "bone",
    name: "Boné",
    photo: "bone-personalizado.jpg",
    base: "bone",
    area: {
      xFraction: 136.7 / 800,
      yFraction: 136.7 / 800,
      widthFraction: 523.3 / 800,
      heightFraction: 381.6 / 800,
      shape: {
        type: "svg-path",
        svgPath: CAP_SILHOUETTE_PATH,
      },
    },
    silhouettePath: CAP_SILHOUETTE_PATH,
    note: "Personalização em todo o painel frontal útil do boné.",
  },
  {
    id: "saco",
    name: "Saco",
    photo: "base-saco.jpg",
    base: "saco",
    area: {
      xFraction: 113.1 / 800,
      yFraction: 96.3 / 800,
      widthFraction: 563.9 / 800,
      heightFraction: 618.7 / 800,
      shape: {
        type: "svg-path",
        svgPath: SACO_SILHOUETTE_PATH,
      },
    },
    silhouettePath: SACO_SILHOUETTE_PATH,
    note: "Personalização em toda a superfície frontal do saco.",
  },
  {
    id: "mochila",
    name: "Mochila",
    photo: "base-mochila.jpg",
    base: "mochila",
    area: {
      xFraction: 257.84 / 800,
      yFraction: 142.16 / 800,
      widthFraction: 276.56 / 800,
      heightFraction: 528.16 / 800,
      shape: {
        type: "svg-path",
        svgPath: MOCHILA_SILHOUETTE_PATH,
      },
    },
    silhouettePath: MOCHILA_SILHOUETTE_PATH,
    note: "Personalização em todo o painel frontal útil da mochila.",
  },
  {
    id: "tshirt",
    name: "T-shirt",
    photo: "tshirt-branca-base.jpg",
    base: "tshirt",
    area: {
      xFraction: 104 / 800,
      yFraction: 128 / 800,
      widthFraction: 592 / 800,
      heightFraction: 588 / 800,
      shape: {
        type: "svg-path",
        svgPath: TSHIRT_SILHOUETTE_PATH,
      },
    },
    silhouettePath: TSHIRT_SILHOUETTE_PATH,
    note: "Personalização total da T-shirt: mangas, peito, laterais e corpo.",
  },
  {
    id: "bracadeira",
    name: "Braçadeira",
    photo: "bracadeira-em-uso.jpg",
    base: "bracadeira",
    area: {
      xFraction: 136 / 800,
      yFraction: 320 / 800,
      widthFraction: 524 / 800,
      heightFraction: 160 / 800,
      shape: {
        type: "rounded",
        cornerRadius: 4,
      },
    },
    silhouettePath: BRACADEIRA_SILHOUETTE_PATH,
    note: "Personalização em toda a faixa central imprimível da braçadeira.",
    isDirectCustomizable: true,
  },
  {
    id: "calcoes",
    name: "Calções",
    photo: "base-calcoes.jpg",
    base: "calcoes",
    area: {
      xFraction: 123 / 800,
      yFraction: 132 / 800,
      widthFraction: 554 / 800,
      heightFraction: 558 / 800,
      shape: {
        type: "svg-path",
        svgPath: SHORTS_SILHOUETTE_PATH,
      },
    },
    silhouettePath: SHORTS_SILHOUETTE_PATH,
    note: "Personalização em toda a superfície frontal dos calções.",
  },
];

export const supporterProducts: Product[] = supporterDefinitions.map((d) => ({
  slug: `${d.id}-personalizado`,
  name: d.name,
  category: "Artigos para Adeptos",
  image: `/catalog/editor/${d.base}.svg`,
  catalogImage: `/catalog/${d.photo}`,
  imageKind:
    d.id === "bone"
      ? "Fotografia de trabalho"
      : "Base de personalização",
  priceLabel: "Sob consulta",
  badges: ["Personalizável"],
  description: "Personaliza com a tua imagem ou pede ajuda à VinilArt.",
  isCustomizable: true,
  customizationMode: "product",
}));
