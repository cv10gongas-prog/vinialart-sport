import type { Product } from "./sport-data";
import type { PrintArea } from "./customizer/types";

export const CAP_CROWN_POINTS: number[] = [
  0.50, 0.00,
  0.59, 0.01,
  0.69, 0.04,
  0.77, 0.08,
  0.84, 0.14,
  0.90, 0.22,
  0.95, 0.32,
  0.98, 0.44,
  1.00, 0.58,
  0.99, 0.72,
  0.98, 0.86,
  0.96, 0.98,
  0.88, 1.00,
  0.76, 0.99,
  0.64, 0.98,
  0.52, 0.97,
  0.40, 0.95,
  0.28, 0.94,
  0.16, 0.93,
  0.08, 0.92,
  0.01, 0.90,
  0.00, 0.84,
  0.01, 0.70,
  0.03, 0.56,
  0.06, 0.43,
  0.11, 0.31,
  0.18, 0.20,
  0.27, 0.11,
  0.38, 0.04,
  0.45, 0.01,
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

/** Silhueta de cor da garrafa na escala de 800x800 */
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
      // Ajustado milimetricamente ao corpo cilíndrico reto
      xFraction: 0.40,
      yFraction: 0.35,
      widthFraction: 0.20,
      heightFraction: 0.44,
      shape: { type: "rounded", cornerRadius: 4 },
    },
    projection: "cylinder",
    silhouettePath: BOTTLE_SILHOUETTE_PATH,
    note: "Gravação frontal com acabamento cilíndrico em aço inoxidável.",
    isDirectCustomizable: true,
  },
  {
    id: "bone",
    name: "Boné",
    photo: "bone-personalizado.jpg",
    base: "bone",
    area: {
      xFraction: 127 / 480,
      yFraction: 92 / 480,
      widthFraction: 204 / 480,
      heightFraction: 162 / 480,
      shape: {
        type: "contour",
        points: CAP_CROWN_POINTS,
      },
    },
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
