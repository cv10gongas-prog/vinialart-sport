/**
 * IMPORTANTE — regra de assets:
 * O catálogo usa apenas mockups neutros (produto branco, sem design inventado).
 * Nenhuma fotografia de trabalho é inventada: quando existirem fotografias reais
 * dos trabalhos VinilArt Sport, substituem estes mockups.
 */
import {
  shinGuardPairWhite,
  shinGuardSingleWhite,
  shinGuardBackWhite,
  jerseyFrontWhite,
  flagWhite,
  supporterItemWhite,
  printSurfaceWhite,
} from "@/lib/customizer/mockups";

export type Badge = "Personalizável" | "Novo" | "Mais popular";

export type CustomizationMode = "product" | "catalog" | "service";

export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
  catalogImage?: string | undefined;
  catalogGallery?: string[] | undefined;
  imageKind?: "Fotografia de trabalho" | "Base de personalização" | undefined;
  gallery?: string[] | undefined;
  priceLabel: string;
  badges: Badge[];
  description: string;
  isCustomizable: boolean;
  customizationMode: CustomizationMode;
  variants?: string[] | undefined;
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
    catalogImage: "/catalog/caneleiras-clube.jpg",
    catalogGallery: ["/catalog/caneleiras-cores.jpg", "/catalog/base-caneleiras.jpg"],
    imageKind: "Fotografia de trabalho",
    gallery: [shinGuardSingleWhite, shinGuardBackWhite],
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description: "O teu design nas duas caneleiras, com personalização independente de cada lado.",
    isCustomizable: true,
    customizationMode: "product",
  },
  {
    slug: "equipamento-personalizado",
    name: "Equipamento Personalizado",
    category: "Equipamentos",
    image: jerseyFrontWhite,
    catalogImage: "/catalog/equipamento-azul.jpg",
    catalogGallery: ["/catalog/equipamento-vermelho.jpg"],
    imageKind: "Fotografia de trabalho",
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description: "Personaliza a frente e as costas com a identidade da tua equipa.",
    isCustomizable: true,
    customizationMode: "product",
  },
  {
    slug: "bandeira-personalizada",
    name: "Bandeira Personalizada",
    category: "Bandeiras",
    image: flagWhite,
    catalogImage: "/catalog/base-bandeira.jpg",
    imageKind: "Base de personalização",
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description: "As tuas cores e símbolos numa bandeira personalizada.",
    isCustomizable: true,
    customizationMode: "product",
  },
  {
    slug: "artigos-adeptos",
    name: "Artigos para Adeptos",
    category: "Artigos para Adeptos",
    image: supporterItemWhite,
    catalogImage: "/catalog/bone-personalizado.jpg",
    imageKind: "Fotografia de trabalho",
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description: "Bandeiras personalizadas e outros artigos de apoio, sob consulta.",
    isCustomizable: false,
    customizationMode: "catalog",
  },
  {
    slug: "estampagem",
    name: "Estampagem",
    category: "Estampagem",
    image: jerseyFrontWhite,
    catalogImage: "/catalog/estampagem-producao.jpg",
    imageKind: "Fotografia de trabalho",
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description: "Nomes, números, emblemas e grafismos nas tuas peças desportivas.",
    isCustomizable: false,
    customizationMode: "service",
  },
  {
    slug: "impressao",
    name: "Impressão",
    category: "Impressão",
    image: printSurfaceWhite,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description: "Envia o teu ficheiro e indica as quantidades, medidas e materiais pretendidos.",
    isCustomizable: false,
    customizationMode: "service",
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
