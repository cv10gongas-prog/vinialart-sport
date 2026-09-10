/**
 * VinilArt Sport — Server API: Remove Background
 *
 * POST /api/image-processing/remove-background
 *
 * Accepts: multipart/form-data with a `file` field (image/jpeg, image/png, image/webp, max 10MB)
 * Returns: PNG image with background removed
 *
 * SECURITY:
 *   - API key is read from server-side environment variable REMOVE_BG_API_KEY
 *   - API key is NEVER exposed to the client
 *   - If REMOVE_BG_API_KEY is not set, returns 503 (service unavailable)
 */

import { defineEventHandler, readMultipartFormData, createError } from "h3";

/** Allowed MIME types */
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Max file size: 10 MB */
const MAX_SIZE = 10 * 1024 * 1024;

export default defineEventHandler(async (event) => {
  // Validate API key is configured
  const apiKey = process.env["REMOVE_BG_API_KEY"];
  if (!apiKey) {
    throw createError({
      statusCode: 503,
      statusMessage: "Processamento avançado indisponível",
      data: {
        error:
          "REMOVE_BG_API_KEY não configurada. Configure a variável de ambiente no servidor.",
        fallback: "local",
      },
    });
  }

  // Parse multipart body
  const parts = await readMultipartFormData(event);
  if (!parts || parts.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "Ficheiro em falta." });
  }

  const filePart = parts.find((p) => p.name === "file");
  if (!filePart || !filePart.data) {
    throw createError({ statusCode: 400, statusMessage: "Campo 'file' em falta." });
  }

  // Validate MIME type
  const mimeType = filePart.type ?? "application/octet-stream";
  if (!ALLOWED_TYPES.has(mimeType)) {
    throw createError({
      statusCode: 415,
      statusMessage: `Tipo de ficheiro não suportado: ${mimeType}. Usa JPEG, PNG ou WEBP.`,
    });
  }

  // Validate file size
  if (filePart.data.byteLength > MAX_SIZE) {
    throw createError({
      statusCode: 413,
      statusMessage: "Ficheiro demasiado grande. Máximo: 10 MB.",
    });
  }

  throw createError({
    statusCode: 501,
    statusMessage: "Endpoint configurado mas provider não foi integrado ainda.",
    data: { fallback: "local" },
  });
});
