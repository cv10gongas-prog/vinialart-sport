import { getProductCustomizerConfig } from "./lib/customizer/configs";
import { resolveProductViews, viewMaximumMask } from "./lib/customizer/views";
import { isPointInMask, maskBounds, maskCenter, maskToPath2D } from "./lib/customizer/geometry/mask";

function run() {
  const out: string[] = [];
  let fail = 0;
  const ok = (cond: boolean, msg: string) => {
    if (!cond) fail++;
    out.push(`${cond ? "ok  " : "FAIL"} ${msg}`);
  };

  const ids = [
    "caneleiras-personalizadas",
    "equipamento-personalizado",
    "bone-personalizado",
    "garrafa-personalizado",
    "tshirt-personalizado",
    "saco-personalizado",
  ];

  for (const id of ids) {
    const config = getProductCustomizerConfig(id)!;
    for (const view of resolveProductViews(config)) {
      for (const [w, h] of [[config.canvasWidth, config.canvasHeight], [375, 375], [390, 500], [430, 430], [1200, 900]] as const) {
        const mask = viewMaximumMask(view.surface, w, h);
        const built = maskToPath2D(mask, w, h);
        ok(built !== null, `${id}/${view.surface.id} @${w}x${h}: recorte Path2D construído (${mask.shapes.map((s) => s.kind).join("+")})`);
        const c = maskCenter(mask, w, h);
        ok(isPointInMask(mask, c.x, c.y, w, h), `${id}/${view.surface.id} @${w}x${h}: centro dentro da máscara`);
        const b = maskBounds(mask);
        // posição relativa da máscara é igual em qualquer viewport
        ok(Math.abs(b.x + b.width / 2 - (c.x / w)) < 1e-9, `${id}/${view.surface.id} @${w}x${h}: posição relativa estável`);
      }
    }
  }

  // forma não retangular: caneleiras (contorno da caneleira)
  const shin = getProductCustomizerConfig("caneleiras-personalizadas")!;
  const shinView = resolveProductViews(shin)[0]!;
  const W = shin.canvasWidth;
  const H = shin.canvasHeight;
  const mask = viewMaximumMask(shinView.surface, W, H);
  const b = maskBounds(mask);
  const px = (fx: number, fy: number) => [ (b.x + fx * b.width) * W, (b.y + fy * b.height) * H ] as const;
  const corners: Array<[number, number]> = [[0.01, 0.01], [0.99, 0.01], [0.01, 0.99], [0.99, 0.99]];
  const cornersInside = corners.filter(([fx, fy]) => {
    const [x, y] = px(fx, fy);
    return isPointInMask(mask, x, y, W, H);
  }).length;
  const [cx, cy] = px(0.5, 0.5);
  ok(isPointInMask(mask, cx, cy, W, H), "caneleiras: centro dentro da forma");
  ok(cornersInside < 4, `caneleiras: forma não retangular — cantos da bounding box fora da máscara (${4 - cornersInside}/4 fora)`);

  return { fail, out };
}

(window as unknown as { __audit: typeof run }).__audit = run;
