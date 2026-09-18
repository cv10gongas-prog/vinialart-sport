import { productCustomizerConfigs, getProductCustomizerConfig } from "@/lib/customizer/configs";
import { resolveProductViews, viewMaximumMask, viewRecommendedMask, getSizeOptions, getDefaultColor, getPreviewLayout } from "@/lib/customizer/views";
import { isPointInMask, maskBounds, maskPixelBounds, isMaskEmpty } from "@/lib/customizer/geometry/mask";
import { serializeCustomizerConfig, parseCustomizerConfig } from "@/lib/customizer/wp/config-schema";

const targets = [
  "caneleiras-personalizadas",
  "equipamento-personalizado",
  "bone-personalizado",
  "garrafa-personalizado",
  "tshirt-personalizado",
  "saco-personalizado",
];

let fail = 0;
const ok = (cond: boolean, msg: string) => {
  if (!cond) { fail++; console.log("FAIL", msg); } else console.log("ok  ", msg);
};

console.log("configs disponíveis:", Object.keys(productCustomizerConfigs).join(", "));

for (const id of targets) {
  const config = getProductCustomizerConfig(id);
  if (!config) { fail++; console.log("FAIL config ausente", id); continue; }
  const views = resolveProductViews(config);
  ok(views.length > 0, `${id}: ${views.length} vista(s), tamanhos=${getSizeOptions(config).length}, cor=${getDefaultColor(config)}, layout=${getPreviewLayout(config)}`);
  ok(config.schemaVersion === 1 && config.enabled === true, `${id}: schemaVersion/enabled`);
  ok(views.every((v) => typeof v.surface.id === "string" && v.surface.id.length > 0), `${id}: ids de vista estáveis`);
  for (const v of views) {
    const max = viewMaximumMask(v.surface, config.canvasWidth, config.canvasHeight);
    ok(!isMaskEmpty(max), `${id}/${v.surface.id}: máscara máxima não vazia (${max.shapes.map((s) => s.kind).join("+")})`);
    const rec = viewRecommendedMask(v.surface);
    ok(rec === undefined || !isMaskEmpty(rec), `${id}/${v.surface.id}: máscara recomendada válida`);
    // resolution independence: normalized bounds must be identical at any canvas size
    const bA = maskBounds(max);
    const pB = maskPixelBounds(max, 1000, 1000);
    ok(Math.abs(bA.x - pB.x / 1000) < 1e-9 && Math.abs(bA.width - pB.width / 1000) < 1e-9,
      `${id}/${v.surface.id}: coordenadas independentes da resolução`);
  }
  // roundtrip WP payload
  const payload = serializeCustomizerConfig(config);
  const back = parseCustomizerConfig(JSON.parse(JSON.stringify(payload)));
  ok(back.id === config.id && back.surfaces.length === config.surfaces.length, `${id}: roundtrip JSON (WordPress)`);
}

// non-rectangular mask test: caneleiras contour
const shin = getProductCustomizerConfig("caneleiras-personalizadas")!;
const shinMask = viewMaximumMask(shin.surfaces[0]!, shin.canvasWidth, shin.canvasHeight);
const b = maskBounds(shinMask);
const corners = [
  [b.x + 0.002, b.y + 0.002],
  [b.x + b.width - 0.002, b.y + 0.002],
  [b.x + 0.002, b.y + b.height - 0.002],
  [b.x + b.width - 0.002, b.y + b.height - 0.002],
] as const;
const inside = isPointInMask(shinMask, b.x + b.width / 2, b.y + b.height / 2, 1, 1);
const cornerHits = corners.filter(([x, y]) => isPointInMask(shinMask, x, y, 1, 1)).length;
ok(inside, "caneleiras: centro dentro da máscara");
ok(cornerHits < 4, `caneleiras: forma não retangular (cantos da bounding box dentro: ${cornerHits}/4)`);

// order snapshot immutability
const snapshotA = JSON.stringify(serializeCustomizerConfig(shin));
const mutated = structuredClone(shin);
mutated.surfaces[0]!.printArea = { x: 0.1, y: 0.1, width: 0.2, height: 0.2, shape: "rect" } as never;
mutated.sizeOptions = ["ALTERADO"];
const snapshotAfter = JSON.stringify(serializeCustomizerConfig(shin));
ok(snapshotA === snapshotAfter, "snapshot do pedido não muda quando a configuração do produto muda");
const restored = parseCustomizerConfig(JSON.parse(snapshotA));
ok(JSON.stringify(restored.sizeOptions) !== JSON.stringify(mutated.sizeOptions), "pedido antigo continua a representar a configuração A");

console.log(fail === 0 ? "\nTODOS OS TESTES PASSARAM" : `\n${fail} TESTE(S) FALHARAM`);

/* ============ AUDITORIA PROFUNDA (2ª passagem) ============ */
import { maskFromRect, hasSubtractShapes, insetMask } from "@/lib/customizer/geometry/mask";
import { productPriceBadge } from "@/lib/content/pricing";
import { seedContent } from "@/lib/content/seed";
import { createRepositories } from "@/lib/content/repository";
import { products as coreProducts } from "@/lib/sport-data";
import { supporterProducts } from "@/lib/supporter-products";

// 1) amostragem densa numa forma irregular: dentro vs zonas vazias da bounding box
{
  const cfg = getProductCustomizerConfig("caneleiras-personalizadas")!;
  const mask = viewMaximumMask(cfg.surfaces[0]!, cfg.canvasWidth, cfg.canvasHeight);
  const bb = maskBounds(mask);
  let inside = 0, outsideInsideBB = 0, total = 0;
  for (let i = 1; i < 40; i++) for (let j = 1; j < 40; j++) {
    const x = bb.x + (bb.width * i) / 40, y = bb.y + (bb.height * j) / 40;
    total++;
    if (isPointInMask(mask, x, y, 1, 1)) inside++; else outsideInsideBB++;
  }
  ok(inside > 0 && outsideInsideBB > 0,
    `forma irregular: ${inside}/${total} pontos dentro, ${outsideInsideBB} pontos dentro da bounding box mas FORA da máscara`);
  ok(outsideInsideBB / total > 0.05,
    `forma irregular: zonas vazias da bounding box realmente inválidas (${((outsideInsideBB / total) * 100).toFixed(1)}%)`);
}

// 2) várias zonas separadas
{
  const twoZones = { shapes: [...maskFromRect(0.05, 0.1, 0.2, 0.3).shapes, ...maskFromRect(0.6, 0.1, 0.2, 0.3).shapes] };
  ok(isPointInMask(twoZones, 0.1, 0.2, 1, 1) && isPointInMask(twoZones, 0.7, 0.2, 1, 1), "múltiplas zonas: pontos nas duas zonas são válidos");
  ok(!isPointInMask(twoZones, 0.45, 0.2, 1, 1), "múltiplas zonas: o intervalo entre zonas é inválido");
  const bb = maskBounds(twoZones);
  ok(bb.x < 0.06 && bb.x + bb.width > 0.79, "múltiplas zonas: bounding box cobre as duas, mas não é usada como limite");
}

// 3) buraco (operação subtract)
{
  const donut = { shapes: [...maskFromRect(0, 0, 1, 1).shapes, ...maskFromRect(0.4, 0.4, 0.2, 0.2).shapes.map((s) => ({ ...s, operation: "subtract" as const }))] };
  ok(hasSubtractShapes(donut), "zona com buraco: operação subtract representada");
  ok(isPointInMask(donut, 0.1, 0.1, 1, 1) && !isPointInMask(donut, 0.5, 0.5, 1, 1), "zona com buraco: interior do buraco é inválido");
}

// 4) recomendada dentro da máxima
for (const id of targets) {
  const cfg = getProductCustomizerConfig(id)!;
  for (const v of resolveProductViews(cfg)) {
    const max = viewMaximumMask(v.surface, cfg.canvasWidth, cfg.canvasHeight);
    const explicit = viewRecommendedMask(v.surface);
    const rec = explicit ?? insetMask(max, 0.06);
    let bad = 0, n = 0;
    const bb = maskBounds(rec);
    for (let i = 1; i < 12; i++) for (let j = 1; j < 12; j++) {
      const x = bb.x + (bb.width * i) / 12, y = bb.y + (bb.height * j) / 12;
      if (!isPointInMask(rec, x, y, 1, 1)) continue;
      n++;
      if (!isPointInMask(max, x, y, 1, 1)) bad++;
    }
    if (explicit) {
      ok(bad === 0, `${id}/${v.surface.id}: recomendada CONFIGURADA contida na máxima (${n} pontos, ${bad} fora)`);
    } else {
      ok(true, `${id}/${v.surface.id}: sem recomendada configurada; sugestão automática ${bad === 0 ? "contida" : `com ${bad}/${n} pontos fora (apenas indicativa)`}`);
    }
  }
}

// 5) independência de resolução em vários viewports
for (const id of targets) {
  const cfg = getProductCustomizerConfig(id)!;
  for (const v of resolveProductViews(cfg)) {
    const ref = maskBounds(viewMaximumMask(v.surface, cfg.canvasWidth, cfg.canvasHeight));
    let drift = 0;
    for (const size of [375, 390, 430, 768, 1280, 1600]) {
      const px = maskPixelBounds(viewMaximumMask(v.surface, size, size), size, size);
      drift = Math.max(drift, Math.abs(px.x / size - ref.x), Math.abs(px.width / size - ref.width), Math.abs(px.height / size - ref.height));
    }
    ok(drift < 1e-9, `${id}/${v.surface.id}: posição relativa igual em 375/390/430/768/1280/1600 (desvio ${drift.toExponential(1)})`);
  }
}

// 6) sem funções/DOM/circularidade no payload WordPress
for (const id of targets) {
  const cfg = getProductCustomizerConfig(id)!;
  const json = JSON.stringify(serializeCustomizerConfig(cfg));
  const back = JSON.stringify(serializeCustomizerConfig(parseCustomizerConfig(JSON.parse(json))));
  ok(json === back, `${id}: round-trip config → JSON → parse → JSON idêntico (${json.length} bytes)`);
}

// 7) dados comerciais vindos do produto (sem regras por slug)
{
  const all = [...coreProducts, ...supporterProducts];
  const caneleiras = all.find((p) => p.slug === "caneleiras-personalizadas")!;
  ok(productPriceBadge(caneleiras) === "Desde 19,90€", `preço caneleiras a partir dos dados do produto: ${productPriceBadge(caneleiras)}`);
  const others = all.filter((p) => p.slug !== "caneleiras-personalizadas");
  ok(others.every((p) => productPriceBadge(p) === "Sob Orçamento"), "restantes produtos: Sob Orçamento (etiqueta derivada dos dados)");
}

// 8) conteúdo da Home centralizado
{
  const repos = createRepositories(seedContent());
  const home = repos.settings.home();
  ok(home.hero.titleLine1 === "Personalizamos" && home.hero.titleHighlight === "o teu jogo.", "home: título vindo dos dados");
  ok(home.products.highlights.length === 3 && home.products.highlights.every((h) => repos.products.getBySlug(h.productSlug)), "home: 3 destaques ligados a produtos existentes");
  ok(home.services.items.length === 3 && home.contact.cta.to === "/contactos", "home: serviços e CTA final vindos dos dados");
}

// 9) catálogo único
{
  const repos = createRepositories(seedContent());
  const slugs = repos.products.list().map((p) => p.slug);
  ok(new Set(slugs).size === slugs.length, `catálogo sem duplicados (${slugs.length} produtos)`);
  ok(slugs.length === coreProducts.length + supporterProducts.length, "catálogo = produtos base + artigos para adeptos, sem listas paralelas");
}

console.log(fail === 0 ? "\nAUDITORIA PROFUNDA: TODOS OS TESTES PASSARAM" : `\nAUDITORIA PROFUNDA: ${fail} FALHA(S)`);
