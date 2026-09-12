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

/** Contorno anatómico dos calções */
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

/** Contorno anatómico do painel frontal da mochila */
export const MOCHILA_CONTOUR_POINTS: number[] = [
  0.5000, 0.0000,
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
];

/** Silhueta de cor dos calções na escala de 800x800 */
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

/** Silhueta de cor da braçadeira na escala de 800x800 */
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

/** Silhueta de cor exata da garrafa a cobrir todo o corpo */
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

/** Silhueta de cor do painel frontal branco do boné na escala 800x800 */
export const CAP_SILHOUETTE_PATH = `
  M 398.3 136.7 L 446.7 138.3 L 493.3 143.3 L 540.0 155.0 L 576.7 173.3 L 608.3 200.0
  L 630.0 233.3 L 645.0 270.0 L 655.0 313.3 L 658.3 358.3 L 660.0 408.3 L 660.0 458.3
  L 658.3 496.7 L 653.3 518.3 L 608.3 516.7 L 558.3 510.0 L 508.3 505.0 L 458.3 500.0
  L 398.3 498.3 L 338.3 500.0 L 288.3 505.0 L 238.3 510.0 L 188.3 516.7 L 143.3 518.3
  L 138.3 496.7 L 136.7 458.3 L 136.7 408.3 L 138.3 358.3 L 141.7 313.3 L 151.7 270.0
  L 166.7 233.3 L 188.3 200.0 L 220.0 173.3 L 256.7 155.0 L 303.3 143.3 L 350.0 138.3 Z
`;

/** Silhueta de cor do tecido do saco (escala 800x800) */
export const SACO_SILHOUETTE_PATH = `
  M 388.0 96.3 L 511.1 96.3 L 543.4 124.4 L 564.5 152.5 L 580.0 180.6 L 591.3 208.8
  L 601.1 236.9 L 608.1 265.0 L 613.8 293.1 L 619.4 321.3 L 623.6 349.4 L 626.4 377.5
  L 629.2 405.6 L 632.0 433.8 L 634.8 461.9 L 637.7 490.0 L 640.5 518.1 L 644.7 546.3
  L 648.9 574.4 L 655.9 602.5 L 663.0 630.6 L 670.0 658.8 L 677.0 686.9 L 658.8 715.0
  L 417.6 715.0 L 176.4 715.0 L 113.1 686.9 L 132.8 658.8 L 134.2 630.6 L 145.5 602.5
  L 153.9 574.4 L 155.3 546.3 L 159.5 518.1 L 162.3 490.0 L 163.8 461.9 L 166.6 433.8
  L 168.0 405.6 L 170.8 377.5 L 173.6 349.4 L 176.4 321.3 L 179.2 293.1 L 182.0 265.0
  L 187.7 236.9 L 196.1 208.8 L 207.3 180.6 L 225.6 152.5 L 245.3 124.4 L 265.0 96.3 Z
`;

/** Silhueta de cor do bolso frontal da mochila (escala 800x800) */
export const MOCHILA_SILHOUETTE_PATH = `
  M 396.1 142.2 L 467.2 142.2 L 514.8 153.1 L 521.1 164.1 L 524.2 175 L 525 185.9 L 526.6 196.9 L 527.3 207.8 L 528.1 218.8 L 528.9 229.7 L 529.7 240.6 L 530.5 251.6 L 531.3 262.5 L 531.3 273.4 L 532 284.4 L 532 295.3 L 532.8 306.3 L 532.8 317.2 L 533.6 328.1 L 533.6 339.1 L 533.6 350 L 534.4 360.9 L 534.4 371.9 L 534.4 382.8 L 534.4 393.8 L 534.4 404.7 L 534.4 415.6 L 534.4 426.6 L 534.4 437.5 L 534.4 448.4 L 534.4 459.4 L 534.4 470.3 L 534.4 481.3 L 534.4 492.2 L 534.4 503.1 L 534.4 514.1 L 533.6 525 L 533.6 535.9 L 533.6 546.9 L 533.6 557.8 L 533.6 568.8 L 532.8 579.7 L 532.8 590.6 L 532.8 601.6 L 532.8 612.5 L 532 623.4 L 532 634.4 L 532 645.3 L 532 656.3 L 531.3 667.2 L 534.4 670.3 L 257.8 670.3 L 259.4 667.2 L 259.4 656.3 L 258.6 645.3 L 258.6 634.4 L 258.6 623.4 L 258.6 612.5 L 258.6 601.6 L 257.8 590.6 L 257.8 579.7 L 257.8 568.8 L 257.8 557.8 L 257.8 546.9 L 257.8 535.9 L 257.8 525 L 257 514.1 L 257 503.1 L 257 492.2 L 257 481.3 L 257 470.3 L 257 459.4 L 257 448.4 L 257 437.5 L 257 426.6 L 257 415.6 L 257 404.7 L 257.8 393.8 L 257.8 382.8 L 257.8 371.9 L 257.8 360.9 L 258.6 350 L 258.6 339.1 L 258.6 328.1 L 259.4 317.2 L 259.4 306.3 L 260.2 295.3 L 260.2 284.4 L 260.9 273.4 L 260.9 262.5 L 261.7 251.6 L 262.5 240.6 L 263.3 229.7 L 263.3 218.8 L 264.8 207.8 L 265.6 196.9 L 266.4 185.9 L 268 175 L 271.1 164.1 L 278.1 153.1 L 333.6 142.2 Z
`;

/** Silhueta de cor da t-shirt (escala 800x800 baseada no SVG 500x500 * 1.6) */
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
      // Área útil abrangendo de ponta a ponta conforme o teu desenho
      xFraction: 0.31,
      yFraction: 0.16,
      widthFraction: 0.38,
      heightFraction: 0.72,
      shape: { type: "rounded", cornerRadius: 14 },
    },
    projection: "cylinder",
    silhouettePath: BOTTLE_SILHOUETTE_PATH,
    note: "Gravação frontal total com acabamento cilíndrico em aço inoxidável.",
    isDirectCustomizable: true,
  },
  {
    id: "bone",
    name: "Boné",
    photo: "bone-personalizado.jpg",
    base: "bone",
    area: {
      xFraction: 82 / 480,
      yFraction: 82 / 480,
      widthFraction: 314 / 480,
      heightFraction: 229 / 480,
      shape: {
        type: "contour",
        points: CAP_CROWN_POINTS,
      },
    },
    silhouettePath: CAP_SILHOUETTE_PATH,
    note: "Área de personalização ajustada exclusivamente ao painel frontal branco do boné.",
  },
  {
    id: "saco",
    name: "Saco",
    photo: "base-saco.jpg",
    base: "saco",
    area: {
      xFraction: 125 / 480,
      yFraction: 130 / 480,
      widthFraction: 230 / 480,
      heightFraction: 245 / 480,
      shape: { type: "rounded", cornerRadius: 16 },
    },
    silhouettePath: SACO_SILHOUETTE_PATH,
    note: "Área útil ampla no painel frontal principal, delimitada pelas costuras e cordões.",
  },
  {
    id: "mochila",
    name: "Mochila",
    photo: "base-mochila.jpg",
    base: "mochila",
    area: {
      xFraction: 0.3223,
      yFraction: 0.1777,
      widthFraction: 0.3457,
      heightFraction: 0.6602,
      shape: {
        type: "contour",
        points: MOCHILA_CONTOUR_POINTS,
      },
    },
    silhouettePath: MOCHILA_SILHOUETTE_PATH,
    note: "Área útil frontal ampla no painel da mochila, delimitada pelos fechos e costuras.",
  },
  {
    id: "tshirt",
    name: "T-shirt",
    photo: "tshirt-branca-base.jpg",
    base: "tshirt",
    area: {
      xFraction: 0.30,
      yFraction: 0.28,
      widthFraction: 0.40,
      heightFraction: 0.42,
      shape: { type: "rounded", cornerRadius: 8 },
    },
    silhouettePath: TSHIRT_SILHOUETTE_PATH,
    note: "Área de personalização peitoral e frontal ampla, com margem à gola e às costuras.",
  },
  {
    id: "bracadeira",
    name: "Braçadeira",
    photo: "bracadeira-em-uso.jpg",
    base: "bracadeira",
    area: {
      xFraction: 86 / 480,
      yFraction: 194 / 480,
      widthFraction: 308 / 480,
      heightFraction: 92 / 480,
      shape: { type: "rounded", cornerRadius: 4 },
    },
    silhouettePath: BRACADEIRA_SILHOUETTE_PATH,
    note: "Personalização na fita elástica: letra C de capitão, emblema e patrocínio.",
    isDirectCustomizable: true,
  },
  {
    id: "calcoes",
    name: "Calções",
    photo: "base-calcoes.jpg",
    base: "calcoes",
    area: {
      xFraction: 74 / 480,
      yFraction: 78 / 480,
      widthFraction: 332 / 480,
      heightFraction: 336 / 480,
      shape: {
        type: "contour",
        points: SHORTS_CONTOUR_POINTS,
      },
    },
    silhouettePath: SHORTS_SILHOUETTE_PATH,
    note: "Personalização total: número e emblema com contorno anatómico dos calções.",
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
