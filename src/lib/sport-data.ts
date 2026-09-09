import caneleiras from "@/assets/prod-caneleiras.jpg";
import equipamento from "@/assets/prod-equipamento.jpg";
import bandeira from "@/assets/prod-bandeira.jpg";

export type Badge = "Personalizável" | "Novo" | "Mais popular";

export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
  priceLabel: string;
  badges: Badge[];
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
    priceLabel: "Desde — €",
    badges: ["Personalizável", "Mais popular"],
  },
  {
    slug: "equipamento-personalizado",
    name: "Equipamento Personalizado",
    category: "Equipamentos",
    image: equipamento,
    priceLabel: "Desde — €",
    badges: ["Personalizável"],
  },
  {
    slug: "bandeira-personalizada",
    name: "Bandeira Personalizada",
    category: "Bandeiras",
    image: bandeira,
    priceLabel: "Desde — €",
    badges: ["Personalizável", "Novo"],
  },
  {
    slug: "camisola-personalizada",
    name: "Camisola Personalizada",
    category: "Equipamentos",
    image: equipamento,
    priceLabel: "Desde — €",
    badges: ["Personalizável", "Novo"],
  },
  {
    slug: "caneleiras-clube",
    name: "Caneleiras — Pack Equipa",
    category: "Caneleiras",
    image: caneleiras,
    priceLabel: "Desde — €",
    badges: ["Personalizável"],
  },
  {
    slug: "bandeira-adeptos",
    name: "Bandeira de Adeptos",
    category: "Artigos para Adeptos",
    image: bandeira,
    priceLabel: "Desde — €",
    badges: ["Personalizável"],
  },
  {
    slug: "estampagem-nome-numero",
    name: "Estampagem Nome & Número",
    category: "Estampagem",
    image: equipamento,
    priceLabel: "Desde — €",
    badges: ["Personalizável"],
  },
  {
    slug: "impressao-grande-formato",
    name: "Impressão Grande Formato",
    category: "Impressão",
    image: bandeira,
    priceLabel: "Desde — €",
    badges: ["Novo"],
  },
];

export const steps = [
  { n: "01", title: "Escolhe o produto", text: "Seleciona o artigo que queres personalizar." },
  { n: "02", title: "Envia as tuas imagens", text: "Logos, fotos ou grafismos da tua equipa." },
  { n: "03", title: "Personaliza", text: "Cores, nome, número e posicionamento." },
  { n: "04", title: "Vê a pré-visualização", text: "Confirma o resultado antes de produzir." },
  { n: "05", title: "Finaliza a encomenda", text: "Enviamos para produção e acompanhamos." },
];
