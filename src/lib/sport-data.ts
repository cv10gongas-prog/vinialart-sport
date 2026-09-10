import caneleiras from "@/assets/prod-caneleiras.jpg";
import equipamento from "@/assets/prod-equipamento.jpg";
import bandeira from "@/assets/prod-bandeira.jpg";

export type Badge = "Personalizável" | "Novo" | "Mais popular";

export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
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
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável", "Mais popular"],
    description:
      "Caneleiras produzidas com impressão de alta durabilidade. Envia o teu logo, foto ou grafismo e define nome, número e cores. Cada par é preparado individualmente para o teu design.",
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
      "Equipamentos desportivos personalizados com as cores, logo e identidade da tua equipa. Produção individual ou por equipa completa.",
    isCustomizable: false,
    variants: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    slug: "bandeira-personalizada",
    name: "Bandeira Personalizada",
    category: "Bandeiras",
    image: bandeira,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável", "Novo"],
    description:
      "Bandeiras de alta qualidade com o design, cores e identidade do teu clube ou equipa. Impressão a toda a largura.",
    isCustomizable: false,
  },
  {
    slug: "camisola-personalizada",
    name: "Camisola Personalizada",
    category: "Equipamentos",
    image: equipamento,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável", "Novo"],
    description:
      "Camisolas desportivas personalizadas com nome, número e identidade visual da equipa. Tecido de alta performance.",
    isCustomizable: false,
    variants: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    slug: "caneleiras-clube",
    name: "Caneleiras — Pack Equipa",
    category: "Caneleiras",
    image: caneleiras,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description:
      "Pack de caneleiras personalizadas para toda a equipa. Encomenda com nomes e números individuais por jogador.",
    isCustomizable: true,
    variants: ["XS", "S", "M", "L", "XL"],
  },
  {
    slug: "bandeira-adeptos",
    name: "Bandeira de Adeptos",
    category: "Artigos para Adeptos",
    image: bandeira,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description:
      "Bandeiras para adeptos com o design e cores do teu clube. Leve, resistente e de grande impacto visual nas bancadas.",
    isCustomizable: false,
  },
  {
    slug: "estampagem-nome-numero",
    name: "Estampagem Nome & Número",
    category: "Estampagem",
    image: equipamento,
    priceLabel: "Preço sob consulta",
    badges: ["Personalizável"],
    description:
      "Serviço de estampagem de nome e número em equipamentos existentes. Compatível com a maioria dos tecidos desportivos.",
    isCustomizable: false,
  },
  {
    slug: "impressao-grande-formato",
    name: "Impressão Grande Formato",
    category: "Impressão",
    image: bandeira,
    priceLabel: "Preço sob consulta",
    badges: ["Novo"],
    description:
      "Impressão de grande formato para banners, faixas e decoração de espaços desportivos. Consulta-nos para medidas e suportes disponíveis.",
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


