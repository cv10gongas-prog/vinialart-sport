/** VinilArt Sport — utilitários de conteúdo (slug, ids, ordenação). */

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/** Move um item para cima/baixo e reescreve o campo `order` de 1..n. */
export function moveItem<T extends { id: string; order: number }>(
  items: T[],
  id: string,
  direction: -1 | 1,
): T[] {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((item) => item.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= sorted.length) return items;
  const next = [...sorted];
  const moved = next[index]!;
  next[index] = next[target]!;
  next[target] = moved;
  return next.map((item, i) => ({ ...item, order: i + 1 }));
}

export function nextOrder(items: { order: number }[]): number {
  return items.reduce((max, item) => Math.max(max, item.order), 0) + 1;
}
