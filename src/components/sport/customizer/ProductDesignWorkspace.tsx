import { useEffect, useRef, useState, type ReactNode } from "react";
import type Konva from "konva";
import { Link } from "@tanstack/react-router";
import { Upload, Eye, ShoppingBag } from "lucide-react";
import { CanvasEditor } from "./CanvasEditor";
import { SingleSurfacePreviewCanvas } from "./DualShinGuardPreview";
import { useProductCustomizer } from "@/hooks/useProductCustomizer";
import { useCart } from "@/lib/cart/store";
import type { CartItem } from "@/lib/cart/types";
import type { ProductCustomizerConfig } from "@/lib/customizer/types";

const label = (id: string, fallback: string) =>
  ({ LEFT: "Caneleira esquerda", RIGHT: "Caneleira direita", FRONT: "Frente", BACK: "Costas" })[
    id
  ] || fallback;
export function ProductDesignWorkspace({
  config,
  info,
  item,
}: {
  config: ProductCustomizerConfig;
  info: ReactNode;
  item?: CartItem | undefined;
}) {
  const c = useProductCustomizer(config, { initialDesignJson: item?.customizerDesign });
  const cart = useCart();
  const [quantity, setQuantity] = useState(item?.quantity ?? 1);
  const [size, setSize] = useState(item?.variant ?? "");
  const [same, setSame] = useState(() => {
    try {
      return Boolean(JSON.parse(item?.customizerDesign ?? "{}").sameDesign);
    } catch {
      return false;
    }
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [konva, setKonva] = useState<any>(null);
  const stages = useRef<Record<string, Konva.Stage | null>>({});
  const dialog = useRef<HTMLDialogElement>(null);
  const signature = JSON.stringify(c.activeLayers);
  useEffect(() => {
    import("react-konva").then(setKonva);
  }, []);
  useEffect(() => {
    if (same && config.surfaces.length === 2) {
      const other = config.surfaces.find((s) => s.id !== c.state.activeSurfaceId);
      if (other) c.syncSurface(c.state.activeSurfaceId, other.id);
    }
  }, [same, signature, c.state.activeSurfaceId, config, c.syncSurface]);
  useEffect(() => {
    if (preview) dialog.current?.showModal();
    else dialog.current?.close();
  }, [preview]);
  const selected = c.selectedLayer;
  const hasDesign = config.surfaces.some((s) => (c.state.surfaces[s.id]?.layers.length ?? 0) > 0);
  async function upload(file: File | undefined, id: string) {
    if (!file) return;
    setBusy(true);
    setError("");
    setSaved(null);
    try {
      await c.addImageFromFile(file, id, true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar.");
    } finally {
      setBusy(false);
    }
  }
  async function thumbnail() {
    const sources = config.surfaces.map((s) =>
      s.id === c.state.activeSurfaceId
        ? c.exportCustomerPreview()
        : stages.current[s.id]?.toDataURL({ pixelRatio: 1 }),
    );
    if (sources.some((s) => !s)) throw new Error("Aguarda que o preview termine de carregar.");
    const images = await Promise.all(
      sources.map(
        (src) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src!;
          }),
      ),
    );
    const canvas = document.createElement("canvas");
    canvas.width = 320 * images.length;
    canvas.height = 320;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0b0d10";
    ctx.fillRect(0, 0, canvas.width, 320);
    images.forEach((img, i) => ctx.drawImage(img, i * 320, 0, 320, 320));
    return canvas.toDataURL("image/jpeg", 0.85);
  }
  async function save() {
    setBusy(true);
    setError("");
    try {
      const serialized = await c.persistDesign();
      const customizerDesign = JSON.stringify({ ...JSON.parse(serialized), sameDesign: same });
      const previewDataUrl = await thumbnail();
      const options = {
        quantity,
        variant: size,
        customizerDesign,
        previewDataUrl,
        mode: "design" as const,
        serviceDetails: undefined,
      };
      if (item) {
        cart.updateItem(item.id, options);
        setSaved(item.id);
      } else if (saved) {
        cart.updateItem(saved, options);
      } else setSaved(cart.addItem(config.id, config.name, options));
      setPreview(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível guardar o pedido.");
    } finally {
      setBusy(false);
    }
  }
  const surfaces = (interactive: boolean) => (
    <>
      {interactive && config.surfaces.length > 1 && (
        <div className="surface-tabs" role="tablist" aria-label="Superfície a editar">
          {config.surfaces.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={c.state.activeSurfaceId === s.id}
              className={c.state.activeSurfaceId === s.id ? "is-active" : ""}
              onClick={() => c.setSurface(s.id)}
            >
              {label(s.id, s.label).replace("Caneleira ", "")}
            </button>
          ))}
        </div>
      )}
      <div className={`integrated-surfaces ${config.surfaces.length === 1 ? "single" : ""}`}>
      {config.surfaces.map((s) => (
        <div
          key={s.id}
          className={`integrated-surface ${interactive && c.state.activeSurfaceId === s.id ? "is-active" : ""} ${interactive && c.state.activeSurfaceId !== s.id ? "surface-stage-hidden" : ""}`}
        >
          {!interactive ? (
            <p className="surface-label">{label(s.id, s.label)}</p>
          ) : null}
          <div
            className="surface-canvas"
            onPointerDown={() => {
              if (interactive && c.state.activeSurfaceId !== s.id) c.setSurface(s.id);
            }}
          >
            {interactive && c.state.activeSurfaceId === s.id ? (
              <CanvasEditor config={config} customizer={c} />
            ) : konva ? (
              <SingleSurfacePreviewCanvas
                config={config}
                surface={s}
                customizer={c}
                KonvaLib={konva}
                stageRef={
                  interactive
                    ? (stage) => {
                        stages.current[s.id] = stage;
                      }
                    : undefined
                }
              />
            ) : (
              <img src={s.mockupSrc} alt={label(s.id, s.label)} />
            )}
          </div>
        </div>
      ))}
      </div>
    </>
  );
  return (
    <div className="integrated-layout design-open">
      <div className="integrated-info">{info}</div>
      <div className="integrated-media">
        {surfaces(true)}
        <p className="surface-hint">Toca na arte para mover, ajustar ou rodar.</p>
      </div>
      <div className="integrated-controls">
        <div className="surface-uploads">
          {config.surfaces.map((s) => (
            <label key={s.id} className="surface-upload">
              <span className="surface-upload-title">
                {label(s.id, s.label)}
              </span>
              <span className="upload-action">
                <Upload size={16} />
                {(c.state.surfaces[s.id]?.layers.length ?? 0) > 0
                  ? "Substituir ficheiro"
                  : "Carrega o teu design"}
              </span>
              <input
                aria-label={`Carregar ${label(s.id, s.label).toLowerCase()}`}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={busy}
                onChange={(e) => {
                  void upload(e.target.files?.[0], s.id);
                  e.target.value = "";
                }}
              />
              <small>
                {c.state.surfaces[s.id]?.layers
                  .filter((l) => l.type === "image")
                  .map((l) => l.name)
                  .join(", ") || "PNG, JPG ou imagem de referência"}
              </small>
            </label>
          ))}
        </div>
        {config.surfaces.length === 2 && (
          <label className="same-design">
            <input
              type="checkbox"
              checked={same}
              onChange={(e) => {
                setSame(e.target.checked);
                if (e.target.checked && !c.activeLayers.length) {
                  const filled = config.surfaces.find(
                    (s) => (c.state.surfaces[s.id]?.layers.length ?? 0) > 0,
                  );
                  if (filled) c.setSurface(filled.id);
                }
              }}
            />
            Usar o mesmo design nos dois lados
          </label>
        )}
        <div className="adjust-controls">
          <p className="label-eyebrow">Ajuste</p>
          <div className="adjust-buttons">
            <button disabled={!selected} onClick={c.smartFit}>
              Ajustar
            </button>
            <button disabled={!selected} onClick={c.coverFit}>
              Preencher
            </button>
            <button disabled={!selected} onClick={() => c.alignSelected("horizontal")}>
              Centrar H
            </button>
            <button disabled={!selected} onClick={() => c.alignSelected("vertical")}>
              Centrar V
            </button>
          </div>
          <label>
            Tamanho <output>{Math.round((selected?.scaleX ?? 1) * 100)}%</output>
            <span className="range-stepper">
              <button
                type="button"
                disabled={!selected}
                aria-label="Diminuir tamanho"
                onClick={() => {
                  if (selected) {
                    const value = Math.max(0.1, Math.round((selected.scaleX - 0.1) * 100) / 100);
                    c.updateLayer(selected.id, { scaleX: value, scaleY: value });
                  }
                }}
              >−</button>
            <input
              aria-label="Tamanho"
              type="range"
              min="0.1"
              max="4"
              step="0.01"
              value={selected?.scaleX ?? 1}
              disabled={!selected}
              onChange={(e) => {
                if (selected)
                  c.updateLayer(selected.id, { scaleX: +e.target.value, scaleY: +e.target.value });
              }}
            />
              <button
                type="button"
                disabled={!selected}
                aria-label="Aumentar tamanho"
                onClick={() => {
                  if (selected) {
                    const value = Math.min(4, Math.round((selected.scaleX + 0.1) * 100) / 100);
                    c.updateLayer(selected.id, { scaleX: value, scaleY: value });
                  }
                }}
              >+</button>
            </span>
          </label>
          <label>
            Rotação <output>{Math.round(selected?.rotation ?? 0)}°</output>
            <div className="rotation-presets">
              {[-15, 0, 15].map((rotation) => (
                <button
                  type="button"
                  key={rotation}
                  disabled={!selected}
                  onClick={() => selected && c.updateLayer(selected.id, { rotation })}
                >
                  {rotation > 0 ? "+" : ""}{rotation}°
                </button>
              ))}
            </div>
            <input
              aria-label="Rotação"
              type="range"
              min="-180"
              max="180"
              step="1"
              value={selected?.rotation ?? 0}
              disabled={!selected}
              onChange={(e) => {
                if (selected) c.updateLayer(selected.id, { rotation: +e.target.value });
              }}
            />
          </label>
        </div>
        <div className="order-options">
          {config.id.includes("caneleiras") && (
            <label>
              Tamanho do produto
              <select aria-label="Tamanho do produto" value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="">Escolher tamanho</option>
                {["10 cm", "12 cm", "14 cm", "15 cm", "16 cm", "18 cm", "20 cm"]
                  .map((option) => <option key={option} value={option}>{option}</option>)}
                {size && !["10 cm", "12 cm", "14 cm", "15 cm", "16 cm", "18 cm", "20 cm"].includes(size) && (
                  <option value={size}>{size}</option>
                )}
              </select>
              <small>A confirmar no orçamento.</small>
            </label>
          )}
          <label>
            Quantidade
            <span className="quantity-stepper">
              <button type="button" aria-label="Diminuir quantidade" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
              <input aria-label="Quantidade" type="number" min="1" step="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.floor(+e.target.value) || 1))} />
              <button type="button" aria-label="Aumentar quantidade" onClick={() => setQuantity((value) => value + 1)}>+</button>
            </span>
          </label>
        </div>
        {error && (
          <p role="alert" className="order-error">
            {error}
          </p>
        )}
        <button
          className="order-secondary"
          disabled={!hasDesign || busy}
          onClick={() => setPreview(true)}
        >
          <Eye size={17} />
          Ver resultado
        </button>
        <button className="order-primary" disabled={!hasDesign || busy} onClick={() => void save()}>
          <ShoppingBag size={17} />
          {busy ? "A guardar…" : item || saved ? "Guardar alterações" : "Adicionar ao pedido"}
        </button>
        {saved && (
          <p role="status" className="order-success">
            Pedido guardado. <Link to="/carrinho">Ver resumo do pedido →</Link>
          </p>
        )}
      </div>
      <dialog ref={dialog} className="product-preview-dialog" onCancel={() => setPreview(false)}>
        <div className="preview-heading">
          <h2>O teu resultado</h2>
          <button onClick={() => setPreview(false)} aria-label="Fechar preview">
            Fechar ✕
          </button>
        </div>
        {preview && surfaces(false)}
        <div className="preview-actions">
          <button className="order-secondary" onClick={() => setPreview(false)}>
            Voltar a editar
          </button>
          <button className="order-primary" disabled={busy} onClick={() => void save()}>
            {item || saved ? "Guardar alterações" : "Adicionar ao pedido"}
          </button>
        </div>
      </dialog>
    </div>
  );
}
