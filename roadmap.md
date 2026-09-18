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

## Personalizador universal + sistema de áreas (feito)

- `src/lib/customizer/geometry/mask.ts` — motor de máscaras normalizadas (0..1):
  retângulos, elipses, polígonos, formas livres, caminhos SVG, várias zonas e
  zonas subtraídas. Serializável em JSON, independente da resolução.
- `src/lib/customizer/geometry/legacy.ts` — conversão fiel das áreas atuais
  (PrintArea + ClipShape) para máscaras. Sem recalibração: Caneleiras,
  Equipamento, Boné, Garrafa, Bandeira e restantes ficam iguais.
- `src/lib/customizer/geometry/mask-editor.ts` — MOTOR do futuro editor visual
  (seleção, pincel, retângulo, elipse, polígono, edição de pontos, borracha,
  desfazer, refazer, zoom, pan, limpar, restaurar). Sem interface, sem /admin.
- `src/lib/customizer/views.ts` — vistas por produto (id, nome, ordem, mockup,
  área máxima, área recomendada), tamanhos, cor base e composição da
  pré-visualização, tudo vindo da configuração.
- `CanvasEditor` usa a MESMA máscara para o contorno visível, o recorte do
  design e a validação de limites — fonte única de verdade.
- `ProductLivePreview` e `ProductDesignWorkspace` deixaram de ter condições por
  produto (caneleiras/equipamento/bandeira/tamanhos/cor/preço).
- `src/lib/customizer/wp/config-schema.ts` — contrato JSON (zod) para leitura e
  escrita futura pela WordPress REST API.
- `src/lib/content/customizer-repository.ts` — repositório trocável por um
  adaptador WordPress.
- Encomendas guardam `configVersion` + `configSnapshot`: uma encomenda antiga
  nunca muda por a configuração do produto mudar depois.
- Corrigida a biblioteca de desenho (react-konva) que impedia o editor de abrir.

Por fazer: 3D continua desativado (Product3DViewer mantém-se como está);
fotografias reais dos trabalhos ainda por receber.

## Auditoria técnica + refinamento cirúrgico (concluído, sem commit manual)
- Preços passaram para o modelo de Produto (`commercial`: priceMode/price/currency/priceLabel); `pricing.ts` só formata.
- Textos/imagens/CTAs/destaques/serviços da Home passaram para `SiteSettings.home` (seed.ts) — Home só renderiza dados.
- Mockups desacoplados: componentes e configs usam `resolveMockupAsset`/`resolveOverlayAsset` (`src/lib/content/assets.ts`), ponto único de troca para a Media Library do WordPress.
- Condicionais por produto removidos de configs, ProductCard, workspace, carrinho, adeptos, EditorMock.
- Testes: 98 verificações de geometria/dados (0 falhas), fluxo real do editor em 6 produtos e 375/390/430 (0 falhas), QA de rotas 1440/390 (0 erros).
- Dívida técnica: `Product3DViewer.tsx` mantém condições de caneleira/bandeira (3D desligado, isolado); sugestão automática de área recomendada pode exceder formas concavas (apenas indicativa; `maximumArea` continua o único limite).
