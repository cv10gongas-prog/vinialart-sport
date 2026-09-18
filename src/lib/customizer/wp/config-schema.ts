/**
 * VinilArt Sport — Serialização da configuração do personalizador.
 *
 * Este é o contrato de dados que o WordPress vai ler e escrever mais tarde
 * (WordPress REST API). Nada aqui depende de React nem do ecrã: toda a
 * geometria é normalizada e serializável em JSON.
 */

import { z } from "zod";

import type { ProductCustomizerConfig, Surface } from "@/lib/customizer/types";
import { CUSTOMIZER_SCHEMA_VERSION, viewMaximumMask, viewRecommendedMask } from "@/lib/customizer/views";
import type { AreaMask } from "@/lib/customizer/geometry/mask";

const operationSchema = z.enum(["add", "subtract"]).optional();

const maskShapeSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("rect"),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    cornerRadius: z.number().optional(),
    operation: operationSchema,
  }),
  z.object({
    kind: z.literal("ellipse"),
    cx: z.number(),
    cy: z.number(),
    rx: z.number(),
    ry: z.number(),
    operation: operationSchema,
  }),
  z.object({
    kind: z.literal("polygon"),
    points: z.array(z.number()),
    operation: operationSchema,
  }),
  z.object({
    kind: z.literal("path"),
    d: z.string(),
    viewBox: z.object({ width: z.number(), height: z.number() }),
    operation: operationSchema,
  }),
]);

export const areaMaskSchema = z.object({ shapes: z.array(maskShapeSchema) });

export const customizerViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number(),
  mockup: z.object({
    baseSrc: z.string(),
    overlaySrc: z.string().optional(),
    silhouettePath: z.string().optional(),
  }),
  maximumArea: areaMaskSchema,
  recommendedArea: areaMaskSchema.optional(),
});

export const customizerConfigSchema = z.object({
  schemaVersion: z.number(),
  productId: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  canvas: z.object({ width: z.number(), height: z.number() }),
  views: z.array(customizerViewSchema),
  tools: z.array(z.string()),
  colors: z.array(z.string()),
  defaultColor: z.string().optional(),
  fonts: z.array(z.string()),
  sizes: z.array(z.string()),
  previewLayout: z.string().optional(),
  projection: z.string().optional(),
});

export type CustomizerConfigPayload = z.infer<typeof customizerConfigSchema>;

/** Configuração interna → payload JSON (o que o WordPress irá guardar). */
export function serializeCustomizerConfig(
  config: ProductCustomizerConfig,
): CustomizerConfigPayload {
  return {
    schemaVersion: config.schemaVersion ?? CUSTOMIZER_SCHEMA_VERSION,
    productId: config.id,
    name: config.name,
    enabled: config.enabled !== false,
    canvas: { width: config.canvasWidth, height: config.canvasHeight },
    views: config.surfaces.map((surface, index) => {
      const recommended = viewRecommendedMask(surface);
      return {
        id: surface.id,
        name: surface.label,
        order: surface.order ?? index + 1,
        mockup: {
          baseSrc: surface.mockup?.baseSrc ?? surface.mockupSrc,
          ...(surface.mockup?.overlaySrc ? { overlaySrc: surface.mockup.overlaySrc } : {}),
          ...(surface.mockup?.silhouettePath
            ? { silhouettePath: surface.mockup.silhouettePath }
            : {}),
        },
        maximumArea: viewMaximumMask(surface, config.canvasWidth, config.canvasHeight),
        ...(recommended ? { recommendedArea: recommended } : {}),
      };
    }),
    tools: [...config.allowedTools],
    colors: [...config.colorSwatches],
    ...(config.defaultColor ? { defaultColor: config.defaultColor } : {}),
    fonts: [...config.fontOptions],
    sizes: config.sizeOptions ? [...config.sizeOptions] : [],
    ...(config.previewLayout ? { previewLayout: config.previewLayout } : {}),
    ...(config.projection ? { projection: config.projection } : {}),
  };
}

/** Payload JSON (ex.: WordPress REST API) → configuração interna. */
export function parseCustomizerConfig(input: unknown): ProductCustomizerConfig {
  const payload = customizerConfigSchema.parse(input);

  const surfaces: Surface[] = payload.views
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((view) => {
      const maximumArea = view.maximumArea as AreaMask;
      const bounds = maskOuterBounds(maximumArea);

      return {
        id: view.id,
        label: view.name,
        order: view.order,
        mockupSrc: view.mockup.baseSrc,
        mockup: {
          baseSrc: view.mockup.baseSrc,
          overlaySrc: view.mockup.overlaySrc,
          silhouettePath: view.mockup.silhouettePath,
        },
        // A área de impressão retangular é apenas informativa: o limite real
        // é sempre a máscara `maximumArea`.
        printArea: {
          xFraction: bounds.x,
          yFraction: bounds.y,
          widthFraction: bounds.width,
          heightFraction: bounds.height,
        },
        maximumArea,
        recommendedArea: view.recommendedArea as AreaMask | undefined,
      };
    });

  return {
    id: payload.productId,
    name: payload.name,
    schemaVersion: payload.schemaVersion,
    enabled: payload.enabled,
    surfaces,
    allowedTools: payload.tools as ProductCustomizerConfig["allowedTools"],
    canvasWidth: payload.canvas.width,
    canvasHeight: payload.canvas.height,
    colorSwatches: payload.colors,
    fontOptions: payload.fonts,
    ...(payload.sizes.length > 0 ? { sizeOptions: payload.sizes } : {}),
    ...(payload.defaultColor ? { defaultColor: payload.defaultColor } : {}),
    ...(payload.previewLayout
      ? { previewLayout: payload.previewLayout as ProductCustomizerConfig["previewLayout"] }
      : {}),
    ...(payload.projection
      ? { projection: payload.projection as ProductCustomizerConfig["projection"] }
      : {}),
  };
}

function maskOuterBounds(mask: AreaMask) {
  // Import tardio evitado: cálculo simples e local para não criar ciclos.
  const xs: number[] = [];
  const ys: number[] = [];

  for (const shape of mask.shapes) {
    if (shape.operation === "subtract") continue;
    if (shape.kind === "rect") {
      xs.push(shape.x, shape.x + shape.width);
      ys.push(shape.y, shape.y + shape.height);
    } else if (shape.kind === "ellipse") {
      xs.push(shape.cx - shape.rx, shape.cx + shape.rx);
      ys.push(shape.cy - shape.ry, shape.cy + shape.ry);
    } else if (shape.kind === "polygon") {
      for (let i = 0; i < shape.points.length; i += 2) {
        xs.push(shape.points[i] ?? 0);
        ys.push(shape.points[i + 1] ?? 0);
      }
    } else {
      xs.push(0, 1);
      ys.push(0, 1);
    }
  }

  if (xs.length === 0) return { x: 0, y: 0, width: 1, height: 1 };

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return { x: minX, y: minY, width: Math.max(...xs) - minX, height: Math.max(...ys) - minY };
}
