import { productCustomizerConfigs, getProductCustomizerConfig } from "./lib/customizer/configs";
import { resolveProductViews, viewMaximumMask, viewRecommendedMask, getSizeOptions, getDefaultColor, getPreviewLayout } from "./lib/customizer/views";
import { isPointInMask, maskBounds, maskPixelBounds, isMaskEmpty } from "./lib/customizer/geometry/mask";
import { serializeCustomizerConfig, parseCustomizerConfig } from "./lib/customizer/wp/config-schema";

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
    ok(!isMaskEmpty(max), `${id}/${v.surface.id}: máscara máxima não vazia (${max.shapes.map((s) => s.type).join("+")})`);
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
const inside = isPointInMask(shinMask, b.x + b.width / 2, b.y + b.height / 2);
const cornerHits = corners.filter(([x, y]) => isPointInMask(shinMask, x, y)).length;
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
