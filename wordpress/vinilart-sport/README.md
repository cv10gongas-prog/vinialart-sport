# Tema VinilArt Sport (WordPress)

Tema oficial do **VinilArt Sport**, concebido para servir a plataforma desportiva de personalização interativa de alto desempenho (caneleiras, equipamentos desportivos, vestuário, bonés e acessórios) integrada no ecossistema WordPress.

---

## 1. Requisitos do Sistema

- **WordPress:** 6.0 ou superior
- **PHP:** 8.0 ou superior
- **Node.js:** 18.x ou superior (para compilação e sincronização de assets)
- **Servidor Web:** Apache / Nginx com suporte a reescrita de URLs (`mod_rewrite` / `try_files`)

---

## 2. Estrutura do Tema

```text
vinilart-sport/
├── style.css                  # Folha de estilos e metadados oficiais do tema
├── functions.php              # Ponto de entrada e bootstrap dos módulos PHP
├── index.php                  # Contentor principal da aplicação (App Shell)
├── header.php                 # Cabeçalho HTML, meta tags e wp_head()
├── footer.php                 # Rodapé HTML e wp_footer()
│
├── inc/
│   ├── setup.php              # Suportes do tema, menus e internacionalização
│   ├── assets.php             # Enfileiramento dinâmico de scripts/estilos via manifest
│   ├── routes.php             # Regras de reescrita para deep-links SPA no WordPress
│   ├── admin.php              # Fundação do menu e painel de controlo no wp-admin
│   └── rest.php               # Fundação de endpoints REST API (/wp-json/vinilart-sport/v1/)
│
├── templates/
│   └── app-shell.php          # Template de página dedicada para o frontend
│
├── assets/
│   ├── assets-manifest.json   # Mapeamento dinâmico de hashes de compilação
│   ├── build/                 # Bundles JS/CSS compilados com hashes de produção
│   ├── brand/                 # Logótipos e imagens de marca
│   ├── catalog/               # Modelos e imagens de catálogo
│   ├── css/                   # Estilos auxiliares
│   ├── js/                    # Scripts auxiliares
│   └── images/                # Recursos gráficos adicionais
│
└── README.md                  # Documentação técnica do tema
```

---

## 3. Como Compilar e Sincronizar Assets

O tema consome os ficheiros compilados em produção sem necessidade de alterar código PHP manualmente.

### Passo 1: Gerar a compilação de produção
Na raiz do projeto:
```bash
npm run build
```

### Passo 2: Sincronizar ficheiros para o tema WordPress
```bash
npm run sync:theme
```
*(ou em comando único: `npm run build:theme`)*

Este processo copia os artefactos de compilação para `wordpress/vinilart-sport/assets/build/`, recursos de catálogo e marca, e gera automaticamente o ficheiro `assets-manifest.json`.

---

## 4. Como Instalar no WordPress

1. Copie a pasta `wordpress/vinilart-sport` para a diretoria de temas da sua instalação WordPress:
   `wp-content/themes/vinilart-sport`
2. Aceda ao **Painel de Administração (wp-admin)** do WordPress.
3. Navegue até **Apresentação > Temas** (Appearance > Themes).
4. Localize **VinilArt Sport** e clique em **Ativar**.
5. Em **Definições > Ligações Permanentes** (Settings > Permalinks), assegure-se de que a estrutura está definida para **Nome do artigo** (`/%postname%/`) para ativar o suporte completo a rotas internas e deep-links.

---

## 5. Rotas e Deep-Links

O tema inclui suporte nativo a reescrita de URL para as seguintes rotas da aplicação:
- `/` (Página Inicial)
- `/loja` (Catálogo)
- `/produto/{slug}` (Detalhe de Produto)
- `/personalizar` (Personalizador)
- `/portfolio` (Portefólio)
- `/contactos` (Contactos)
- `/carrinho` (Carrinho de Compras)
- `/checkout` (Finalização de Encomenda)
- `/adeptos` (Área de Adeptos)
- `/equipamentos` (Equipamentos)

---

## 6. Endpoints REST API

O tema disponibiliza a base da API sob o namespace `vinilart-sport/v1`:
- `GET /wp-json/vinilart-sport/v1/health` — Verificação de estado do tema
- `GET /wp-json/vinilart-sport/v1/config` — Parâmetros públicos de configuração

---

## 7. Licença

Proprietário — VinilArt Sport. Todos os direitos reservados.
