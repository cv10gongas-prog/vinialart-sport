export interface SupporterProductDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  base: string;
  area: {
    xFraction: number;
    yFraction: number;
    widthFraction: number;
    heightFraction: number;
    shape: {
      type: "rect" | "rounded" | "custom";
      cornerRadius?: number;
    };
  };
  projection?: "flat" | "cylinder" | "perspective";
  note?: string;
  priceFrom: number;
}

export const supporterDefinitions: SupporterProductDefinition[] = [
  {
    id: "tshirt",
    name: "T-Shirt",
    category: "Artigos para Adeptos",
    description: "T-Shirt técnica personalizável em sublimação total.",
    base: "tshirt",
    area: {
      // Cobertura a 100% da silhueta da camisola
      xFraction: 0.05,
      yFraction: 0.05,
      widthFraction: 0.90,
      heightFraction: 0.90,
      shape: {
        type: "rounded",
        cornerRadius: 0,
      },
    },
    projection: "flat",
    priceFrom: 14.9,
  },
  {
    id: "garrafa",
    name: "Garrafa Térmica",
    category: "Artigos para Adeptos",
    description: "Garrafa de alumínio desportiva com tampa estanque.",
    base: "garrafa",
    area: {
      xFraction: 0.28,
      yFraction: 0.22,
      widthFraction: 0.44,
      heightFraction: 0.60,
      shape: {
        type: "rect",
      },
    },
    projection: "cylinder",
    priceFrom: 11.9,
  },
  {
    id: "caneca",
    name: "Caneca",
    category: "Artigos para Adeptos",
    description: "Caneca cerâmica de alta qualidade.",
    base: "caneca",
    area: {
      xFraction: 0.20,
      yFraction: 0.25,
      widthFraction: 0.60,
      heightFraction: 0.50,
      shape: {
        type: "rect",
      },
    },
    projection: "flat",
    priceFrom: 8.9,
  },
];
