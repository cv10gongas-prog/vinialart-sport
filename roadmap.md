# VinilArt Sport — Roadmap (CMS admin)

Origem: brief "Quero evoluir o projeto atual VINILART SPORT" (56 pontos).

## Fase 0 — Decisões
- [ ] Confirmar persistência (local vs Cloud) e proteção do /admin

## Fase 1 — Camada de dados
- [ ] Tipos de conteúdo (produtos, categorias, portfólio, contactos, home, settings)
- [ ] Repositories/adapters + normalizeLegacy* (migração dos dados atuais)
- [ ] Frontend público a consumir repositories (sem arrays hardcoded)

## Fase 2 — Área administrativa
- [ ] Layout /admin com identidade VinilArt Sport
- [ ] Visão geral, Início (secções: ordem/visibilidade), Loja
- [ ] Produtos (CRUD, duplicar, variantes, imagens, publicado/rascunho)
- [ ] Categorias (CRUD, ordem, ativar)
- [ ] Portefólio (CRUD, galeria, destaque, ordem)
- [ ] Contactos + Header/Footer + Configurações gerais
- [ ] Pedidos (estados, previews, ficheiros, notas)
- [ ] Media picker (referências, sem base64 gigante)

## Fase 3 — Motor universal de personalização
- [ ] ProductCustomizerConfig (schemaVersion, views, settings, draft/published, versão)
- [ ] Personalizador genérico (sem ifs por produto)
- [ ] Lista de produtos no admin com estados/filtros
- [ ] Editor visual de máscaras (formas livres, pincel, borracha, undo/redo, zoom/pan)
- [ ] Máscara única como fonte de verdade (clipping + limites)
- [ ] Draft / Testar / Publicar / Repor / Duplicar config / Presets

## Fase 4 — Integridade e QA
- [ ] Pedidos históricos imutáveis (snapshot + configVersion)
- [ ] Migração dos produtos atuais sem recalibrar
- [ ] Auditoria de hardcodes + relatório final
- [ ] Build, tsc, lint, QA mobile 375/390/430
