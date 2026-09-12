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
      xFraction: 104 / 480,
      yFraction: 72 / 480,
      widthFraction: 272 / 480,
      heightFraction: 336 / 480,
      shape: { type: "rounded", cornerRadius: 18 },
    },
    note: "Área útil ampla no painel frontal principal, delimitada pelas costuras e cordões.",
  },
  {
    id: "mochila",
    name: "Mochila",
    photo: "base-mochila.jpg",
    base: "mochila",
    area: {
      xFraction: 164 / 480,
      yFraction: 105 / 480,
      widthFraction: 100 / 480,
      heightFraction: 236 / 480,
      shape: { type: "rounded", cornerRadius: 14 },
    },
    note: "Área útil expandida a toda a face do bolso frontal, delimitada pelos fechos e costuras.",
  },
  {
    id: "tshirt",
    name: "T-shirt",
    photo: "tshirt-branca-base.jpg",
    base: "tshirt",
    area: {
      xFraction: 0.13,
      yFraction: 0.14,
      widthFraction: 0.74,
      heightFraction: 0.76,
      shape: { type: "silhouette" },
    },
    note: "Personalização total: corpo frontal e mangas.",
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
