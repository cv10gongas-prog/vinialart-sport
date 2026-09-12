import type { Product } from "./sport-data";
import type { PrintArea } from "./customizer/types";
export const supporterDefinitions: {id:string; name:string; photo:string; base:string; area:PrintArea; note?:string; projection?:"cylinder"}[] = [
 {id:"garrafa",name:"Garrafa",photo:"base-garrafa.jpg",base:"garrafa",area:{xFraction:.40,yFraction:.27,widthFraction:.16,heightFraction:.54},projection:"cylinder"},
 {id:"bone",name:"Boné",photo:"bone-personalizado.jpg",base:"bone",area:{xFraction:.35,yFraction:.24,widthFraction:.29,heightFraction:.20}},
 {id:"saco",name:"Saco",photo:"base-saco.jpg",base:"saco",area:{xFraction:.29,yFraction:.28,widthFraction:.43,heightFraction:.48}},
 {id:"mochila",name:"Mochila",photo:"base-mochila.jpg",base:"mochila",area:{xFraction:.36,yFraction:.35,widthFraction:.17,heightFraction:.30}},
 {id:"tshirt",name:"T-shirt",photo:"tshirt-branca-base.jpg",base:"tshirt",area:{xFraction:.34,yFraction:.30,widthFraction:.32,heightFraction:.44}},
 {id:"bracadeira",name:"Braçadeira",photo:"bracadeira-em-uso.jpg",base:"bracadeira",area:{xFraction:.34,yFraction:.315,widthFraction:.422,heightFraction:.305,shape:{type:"contour",points:[0,.656,.877,0,1,.164,.180,1]}},note:"Simulação sobre uma fotografia de referência. A base neutra e a área final serão confirmadas pela VinilArt."},
 {id:"calcoes",name:"Calções",photo:"base-calcoes.jpg",base:"calcoes",area:{xFraction:.54,yFraction:.49,widthFraction:.15,heightFraction:.18}},
];
export const supporterProducts: Product[] = supporterDefinitions.map(d=>({
 slug:`${d.id}-personalizado`,name:d.name,category:"Artigos para Adeptos",image:`/catalog/editor/${d.base}.svg`,catalogImage:`/catalog/${d.photo}`,imageKind:d.id==="bone"||d.id==="bracadeira"?"Fotografia de trabalho":"Base de personalização",priceLabel:"Sob consulta",badges:["Personalizável"],description:"Personaliza com a tua imagem ou pede ajuda à VinilArt.",isCustomizable:true,customizationMode:"product",
}));
