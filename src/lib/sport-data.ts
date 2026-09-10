import caneleiras from "@/assets/prod-caneleiras.jpg";
import caneleirasAngle from "@/assets/prod-caneleira-angle.jpg";
import caneleirasDetail from "@/assets/prod-caneleira-detail.jpg";
import caneleirasBack from "@/assets/prod-caneleira-back.jpg";
import equipamento from "@/assets/prod-equipamento.jpg";
import bandeira from "@/assets/prod-bandeira.jpg";

export type Badge = "Personalizável" | "Novo" | "Mais popular";

export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
  /** Additional product gallery images for detailed showcase */
  gallery?: string[];
  /** Always "Preço sob consulta" — never invent prices. */
  priceLabel: string;
  badges: Badge[];
  /** Short product description shown on product page and cards. */
  description: string;
  /** Whether this product supports the online customizer tool. */
  isCustomizable: boolean;
  /** Available size options, if applicable. */
  variants?: string[];
};

export const categories = [
  { name: "Caneleiras", slug: "caneleiras", accent: "magenta" as const },
  { name: "Equipamentos", slug: "equipamentos", accent: "cyan" as const },
  { name: "Bandeiras", slug: "bandeiras", accent: "yellow" as const },
  { name: "Artigos para Adeptos", slug: "adeptos", accent: "magenta" as const },
  { name: "Estampagem", slug: "estampagem", accent: "cyan" as const },
  { name: "Impressão", slug: "impressao", accent: "yellow" as const },
];

export const products: Product[] = [
  {
    slug: "caneleiras-personalizadas",
    name: "Caneleiras Personalizadas",
    category: "Caneleiras",
    image: caneleiras,
    gallery: [caneleiras, caneleirasAngle, caneleirasDetail, caneleirasBack],
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável", "Mais popular"],
    description:
      "Caneleiras com personalização gráfica à tua medida. Adiciona as tuas imagens, fotos ou logótipos, define nome e número, e personaliza cada lado de forma independente no nosso estúdio online.",
    isCustomizable: true,
    variants: ["XS", "S", "M", "L", "XL"],
  },
  {
    slug: "equipamento-personalizado",
    name: "Equipamento Personalizado",
    category: "Equipamentos",
    image: equipamento,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description:
      "Personalização de equipamentos desportivos para atletas, clubes e equipas. Configuração com cores, emblemas e numerações da tua equipa.",
    isCustomizable: false,
  },
  {
    slug: "bandeira-personalizada",
    name: "Bandeira Personalizada",
    category: "Bandeiras",
    image: bandeira,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description:
      "Bandeiras personalizadas com o design, cores e identidade do teu clube, claque ou evento desportivo.",
    isCustomizable: false,
  },
  {
    slug: "artigos-adeptos",
    name: "Artigos para Adeptos",
    category: "Artigos para Adeptos",
    image: bandeira,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description:
      "Artigos de apoio e bancada personalizados para adeptos, claques e grupos desportivos.",
    isCustomizable: false,
  },
  {
    slug: "estampagem",
    name: "Estampagem",
    category: "Estampagem",
    image: equipamento,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description:
      "Serviço de estampagem de nomes, números e logótipos em peças desportivas para individuais ou equipas.",
    isCustomizable: false,
  },
  {
    slug: "impressao",
    name: "Impressão",
    category: "Impressão",
    image: bandeira,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description:
      "Produção e impressão gráfica para materiais de apoio desportivo, faixas e comunicação de clubes.",
    isCustomizable: false,
  },
];

export const steps = [
  { n: "01", title: "Escolhe o produto", text: "Seleciona o artigo que queres personalizar." },
  { n: "02", title: "Envia as tuas imagens", text: "Logos, fotos ou grafismos da tua equipa." },
  { n: "03", title: "Personaliza", text: "Cores, nome, número e posicionamento." },
  { n: "04", title: "Vê a pré-visualização", text: "Confirma o resultado antes de produzir." },
  { n: "05", title: "Finaliza a encomenda", text: "Enviamos para produção e acompanhamos." },
];


