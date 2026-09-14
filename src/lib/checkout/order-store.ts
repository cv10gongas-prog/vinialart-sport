import type { OrderRecord } from './types';

export const ORDERS_STORAGE_KEY = 'vinilart_sport_orders_v1';

export function getStoredOrders(): OrderRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OrderRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveOrderToStore(order: OrderRecord): void {
  if (typeof window === 'undefined') return;
  const current = getStoredOrders();
  const next = [order, ...current.filter((o) => o.orderId !== order.orderId)];
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(next));
}

export function getOrderById(orderId: string): OrderRecord | null {
  const current = getStoredOrders();
  return current.find((o) => o.orderId === orderId) || null;
}

export function generateOrderId(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `VA-${dateStr}-${rand}`;
}
