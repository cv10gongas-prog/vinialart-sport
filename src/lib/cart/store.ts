import { useSyncExternalStore } from "react";
import type { CartItem } from "./types";
export const CART_STORAGE_KEY = "vinilart_sport_cart_v1";
const empty: CartItem[] = [];
let snapshot: CartItem[] = empty;
let initialized = false;
const listeners = new Set<() => void>();
function load() {
  try {
    const value = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(value) ? (value as CartItem[]) : [];
  } catch {
    return [];
  }
}
function getSnapshot() {
  if (!initialized && typeof window !== "undefined") {
    snapshot = load();
    initialized = true;
  }
  return snapshot;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const sync = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY) {
      snapshot = load();
      listeners.forEach((fn) => fn());
    }
  };
  window.addEventListener("storage", sync);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", sync);
  };
}
function change(fn: (items: CartItem[]) => CartItem[]) {
  const next = fn(getSnapshot());
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  } catch {
    throw new Error(
      "Não foi possível guardar o pedido neste navegador. Liberta espaço e tenta novamente.",
    );
  }
  snapshot = next;
  listeners.forEach((fn) => fn());
}
export function cartId() {
  return `ci_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}
type Options = Partial<
  Pick<
    CartItem,
    "quantity" | "variant" | "customizerDesign" | "previewDataUrl" | "serviceDetails" | "mode"
  >
>;
function addItem(productId: string, productName: string, options: Options = {}) {
  const id = cartId();
  change((items) => [
    ...items,
    {
      ...options,
      id,
      productId,
      productName,
      quantity: Math.max(1, options.quantity ?? 1),
      addedAt: Date.now(),
    },
  ]);
  return id;
}
function updateItem(id: string, updates: Options) {
  change((items) => items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
}
function removeItem(id: string) {
  change((items) => items.filter((item) => item.id !== id));
}
function updateQty(id: string, quantity: number) {
  updateItem(id, { quantity: Math.max(1, quantity) });
}
function clear() {
  change(() => []);
}
export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, () => empty);
  return {
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    addItem,
    updateItem,
    removeItem,
    updateQty,
    clear,
  };
}
