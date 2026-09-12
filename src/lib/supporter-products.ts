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

export const supporterDefinitions: {
  id: string;
  name: string;
  photo: string;
  base: string;
  area: PrintArea;
  note?: string;
  projection?: "cylinder";
  isDirectCustomizable?: boolean;
}[] = [
  {
    id: "garrafa",
    name: "Garrafa",
    photo: "base-garrafa.jpg",
    base: "garrafa",
    area: {
      xFraction: 186 / 480,
      yFraction: 127 / 480,
      widthFraction: 88 / 480,
      heightFraction: 285 / 480,
      shape: { type: "rounded", cornerRadius: 4 },
    },
    projection: "cylinder",
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
      xFraction: 0.34,
      yFraction: 0.315,
      widthFraction: 0.422,
      heightFraction: 0.305,
    },
    note: "Sem base neutra direta no editor. Pedido gerido sob consulta com apoio da equipa técnica.",
    isDirectCustomizable: false,
  },
  {
    id: "calcoes",
    name: "Calções",
    photo: "base-calcoes.jpg",
    base: "calcoes",
    area: {
      xFraction: 278 / 480,
      yFraction: 265 / 480,
      widthFraction: 72 / 480,
      heightFraction: 72 / 480,
      shape: { type: "rounded", cornerRadius: 4 },
    },
    note: "Área de personalização ajustada para número ou emblema na perna.",
  },
];

export const supporterProducts: Product[] = supporterDefinitions.map((d) => ({
  slug: `${d.id}-personalizado`,
  name: d.name,
  category: "Artigos para Adeptos",
  image: `/catalog/editor/${d.base}.svg`,
  catalogImage: `/catalog/${d.photo}`,
  imageKind:
    d.id === "bone" || d.id === "bracadeira"
      ? "Fotografia de trabalho"
      : "Base de personalização",
  priceLabel: "Sob consulta",
  badges: ["Personalizável"],
  description:
    d.isDirectCustomizable === false
      ? "Braçadeiras desportivas personalizadas sob consulta com a equipa da VinilArt."
      : "Personaliza com a tua imagem ou pede ajuda à VinilArt.",
  isCustomizable: d.isDirectCustomizable !== false,
  customizationMode: d.isDirectCustomizable === false ? "service" : "product",
}));
