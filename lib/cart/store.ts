export type CartLineItem = {
  tenantSlug: string;
  productId: string;
  variantId: string;
  productTitle: string;
  variantTitle?: string;
  quantity: number;
  unitAmount?: number;
  currencyCode?: string;
  thumbnail?: string | null;
  collectionId?: string;
};

function cartKey(tenantSlug: string) {
  return `edge-marketplace-cart:${tenantSlug}`;
}

export function readCart(tenantSlug: string): CartLineItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(cartKey(tenantSlug));
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CartLineItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(tenantSlug: string, items: CartLineItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(cartKey(tenantSlug), JSON.stringify(items));
}

export function addCartItem(item: CartLineItem) {
  const current = readCart(item.tenantSlug);
  const existing = current.find((entry) => entry.variantId === item.variantId);

  if (existing) {
    existing.quantity += item.quantity;
    writeCart(item.tenantSlug, [...current]);
    return;
  }

  writeCart(item.tenantSlug, [...current, item]);
}

export function updateCartItemQuantity(tenantSlug: string, variantId: string, quantity: number) {
  const next = readCart(tenantSlug)
    .map((item) => (item.variantId === variantId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  writeCart(tenantSlug, next);
}

export function clearCart(tenantSlug: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(cartKey(tenantSlug));
}

export function cartItemCount(tenantSlug: string) {
  return readCart(tenantSlug).reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(items: CartLineItem[]) {
  return items.reduce((sum, item) => sum + (item.unitAmount ?? 0) * item.quantity, 0);
}
