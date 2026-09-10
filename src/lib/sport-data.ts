import {
  flagWhite,
  jerseyFrontWhite,
  printSurfaceWhite,
  shinGuardBackWhite,
  shinGuardDetailWhite,
  shinGuardPairWhite,
  shinGuardSingleWhite,
  supporterItemWhite,
} from "@/lib/customizer/mockups";

export type Badge = "Personalizável" | "Novo" | "Mais popular";

export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
  gallery?: string[];
  priceLabel: string;
  badges: Badge[];
  description: string;
  isCustomizable: boolean;
  variants?: string[];
};

export const categories = [
  { name: "Caneleiras", slug: "caneleiras", accent: "magenta" as const },
  { name: "Equipamentos", slug: "equipamentos", accent: "cyan" as const },
  { name: "Bandeiras", slug: "bandeiras", accent: "yellow" as const },
  {
    name: "Artigos para Adeptos",
    slug: "adeptos",
    accent: "magenta" as const,
  },
  { name: "Estampagem", slug: "estampagem", accent: "cyan" as const },
  { name: "Impressão", slug: "impressao", accent: "yellow" as const },
];

export const products: Product[] = [
  {
    slug: "caneleiras-personalizadas",
    name: "Caneleiras Personalizadas",
    category: "Caneleiras",
    image: shinGuardPairWhite,
    gallery: [
      shinGuardPairWhite,
      shinGuardSingleWhite,
      shinGuardDetailWhite,
      shinGuardBackWhite,
    ],
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável", "Mais popular"],
    description:
      "Cria uma proposta visual para as tuas caneleiras com fotografias, logótipos, nome, número e outros grafismos. Cada lado pode ser personalizado de forma independente.",
    isCustomizable: true,
  },
  {
    slug: "equipamento-personalizado",
    name: "Equipamento Personalizado",
    category: "Equipamentos",
    image: jerseyFrontWhite,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description:
      "Cria uma proposta visual para um equipamento com cores, emblemas, imagens, nomes, números e outros elementos gráficos.",
    isCustomizable: true,
  },
  {
    slug: "bandeira-personalizada",
    name: "Bandeira Personalizada",
    category: "Bandeiras",
    image: flagWhite,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description:
      "Cria uma proposta visual para uma bandeira utilizando as tuas cores, imagens, logótipos e texto.",
    isCustomizable: true,
  },
  {
    slug: "artigos-adeptos",
    name: "Artigos para Adeptos",
    category: "Artigos para Adeptos",
    image: supporterItemWhite,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description:
      "Prepara uma ideia visual para artigos de apoio através das tuas imagens, cores, símbolos e mensagens.",
    isCustomizable: true,
  },
  {
    slug: "estampagem",
    name: "Estampagem",
    category: "Estampagem",
    image: jerseyFrontWhite,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description:
      "Prepara visualmente nomes, números, logótipos ou outros grafismos antes de enviares o pedido de estampagem.",
    isCustomizable: true,
  },
  {
    slug: "impressao",
    name: "Impressão",
    category: "Impressão",
    image: printSurfaceWhite,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description:
      "Monta uma proposta gráfica com imagens, texto e logótipos para enviares junto do teu pedido de impressão.",
    isCustomizable: true,
  },
];

export const steps = [
  {
    n: "01",
    title: "Escolhe o produto",
    text: "Seleciona a área que queres personalizar.",
  },
  {
    n: "02",
    title: "Carrega imagens",
    text: "Adiciona fotografias, logótipos ou outros grafismos.",
  },
  {
    n: "03",
    title: "Personaliza",
    text: "Move, redimensiona, roda e adiciona texto.",
  },
  {
    n: "04",
    title: "Pré-visualiza",
    text: "Vê o resultado diretamente no site, sem downloads.",
  },
  {
    n: "05",
    title: "Guarda o pedido",
    text: "Adiciona a personalização ao carrinho para confirmação.",
  },
];
