/**
 * VinilArt Sport — Cart store (localStorage persistence).
 *
 * No prices. No totals. No checkout.
 * The cart is a simple list of CartItems persisted to localStorage.
 */

import { useState, useEffect, useCallback } from "react";
import type { CartItem } from "./types";

export const CART_STORAGE_KEY = "vinilart_sport_cart_v1";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage may be unavailable in some contexts; fail silently
  }
}

/** Generates a simple unique ID for cart items without a heavy dependency. */
export function cartId(): string {
  return `ci_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  // Sync to localStorage whenever items change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback(
    (
      productId: string,
      productName: string,
      options?: {
        quantity?: number | undefined;
        variant?: string | undefined;
        customizerDesign?: string | undefined;
        previewDataUrl?: string | undefined;
        serviceDetails?: import("./types").ServiceQuoteDetails | undefined;
      },
    ): string => {
      const qty = Math.max(1, options?.quantity ?? 1);
      const newId = cartId();
      setItems((prev) => {
        if (!options?.customizerDesign && !options?.serviceDetails) {
          const existing = prev.find(
            (i) => i.productId === productId && i.variant === options?.variant && !i.customizerDesign && !i.serviceDetails,
          );
          if (existing) {
            return prev.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + qty } : i,
            );
          }
        }
        const newItem: CartItem = {
          id: newId,
          productId,
          productName,
          quantity: qty,
          variant: options?.variant,
          customizerDesign: options?.customizerDesign,
          previewDataUrl: options?.previewDataUrl,
          serviceDetails: options?.serviceDetails,
          addedAt: Date.now(),
        };
        return [...prev, newItem];
      });
      return newId;
    },
    [],
  );

  const updateItem = useCallback(
    (
      id: string,
      updates: {
        customizerDesign?: string | undefined;
        previewDataUrl?: string | undefined;
        quantity?: number | undefined;
        variant?: string | undefined;
        serviceDetails?: import("./types").ServiceQuoteDetails | undefined;
      },
    ) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          return {
            ...item,
            ...(updates.customizerDesign !== undefined ? { customizerDesign: updates.customizerDesign } : {}),
            ...(updates.previewDataUrl !== undefined ? { previewDataUrl: updates.previewDataUrl } : {}),
            ...(updates.quantity !== undefined ? { quantity: updates.quantity } : {}),
            ...(updates.variant !== undefined ? { variant: updates.variant } : {}),
            ...(updates.serviceDetails !== undefined ? { serviceDetails: updates.serviceDetails } : {}),
          };
        }),
      );
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, quantity: number) => {
    const qty = Math.max(1, quantity);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, totalItems, addItem, updateItem, removeItem, updateQty, clear };
}
