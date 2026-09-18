# VinilArt Sport — preparação para WordPress

Sem área de administração, sem login, sem novo backend. Só arquitetura pronta
para o WordPress fornecer o conteúdo mais tarde.

## Feito
- Camada de conteúdos `src/lib/content` (tipos, seed a partir dos dados atuais,
  repositórios Produtos/Categorias/Portefólio/Configurações, fonte trocável).
- Fonte única de catálogo (`catalog-source.ts`) — loja, produto, carrinho e
  checkout já não têm listas próprias.
- Loja, Portefólio, Contactos, Início, Menu e Rodapé a ler dos repositórios.
- Área de administração anterior removida.

## A seguir
- Personalizador universal guiado por configuração (sem condições por produto).
- Motor de máscaras reutilizável: área máxima + recomendada por vista, formas
  livres/irregulares, geometria normalizada, mesma máscara para contorno,
  recorte, mover, redimensionar, rodar e validar.
- Modelo de encomenda com snapshot (productId, configVersion, vistas,
  transformações, ficheiros) para encomendas antigas nunca mudarem.
- Auditoria final de conteúdos fixos + relatório.
