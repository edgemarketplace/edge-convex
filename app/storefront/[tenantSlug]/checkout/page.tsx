"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  cartSubtotal,
  clearCart,
  readCart,
  type CartLineItem,
  updateCartItemQuantity,
} from "@/lib/cart/store";
import {
  DEFAULT_MEDUSA_REGION_ID,
  getMedusaStorefrontConfig,
} from "@/lib/medusa/config";

type CheckoutFormState = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  countryCode: string;
};

const initialFormState: CheckoutFormState = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  postalCode: "",
  countryCode: "de",
};

function formatMoney(amount?: number, currencyCode?: string) {
  if (amount === undefined || !currencyCode) return "Price unavailable";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100);
}

export default function CheckoutPage() {
  const params = useParams<{ tenantSlug: string }>();
  const tenantSlug = params.tenantSlug;
  const medusaConfig = useMemo(() => getMedusaStorefrontConfig(), []);

  const [items, setItems] = useState<CartLineItem[]>(() => readCart(tenantSlug));
  const [formState, setFormState] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [remoteCartId, setRemoteCartId] = useState<string | null>(null);
  const [syncWarnings, setSyncWarnings] = useState<string[]>([]);

  const subtotal = cartSubtotal(items);
  const currencyCode = items[0]?.currencyCode ?? "usd";

  function refreshCart() {
    setItems(readCart(tenantSlug));
  }

  function handleQuantityChange(variantId: string, quantity: number) {
    updateCartItemQuantity(tenantSlug, variantId, quantity);
    refreshCart();
  }

  async function handleCheckout(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setSyncWarnings([]);

    if (items.length === 0) {
      setError("Your cart is empty.");
      setLoading(false);
      return;
    }

    if (!medusaConfig.baseUrl || !medusaConfig.publishableKey) {
      setError("Medusa storefront environment variables are missing.");
      setLoading(false);
      return;
    }

    try {
      const createCartResponse = await fetch(`${medusaConfig.baseUrl}/store/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": medusaConfig.publishableKey,
        },
        body: JSON.stringify({
          region_id: medusaConfig.defaultRegionId || DEFAULT_MEDUSA_REGION_ID,
        }),
      });

      if (!createCartResponse.ok) {
        throw new Error(`Failed to initialize cart (${createCartResponse.status})`);
      }

      const createCartPayload = (await createCartResponse.json()) as {
        cart?: { id: string };
      };

      const cartId = createCartPayload.cart?.id;

      if (!cartId) {
        throw new Error("Medusa did not return a cart id.");
      }

      setRemoteCartId(cartId);

      await fetch(`${medusaConfig.baseUrl}/store/carts/${cartId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": medusaConfig.publishableKey,
        },
        body: JSON.stringify({
          email: formState.email,
          shipping_address: {
            first_name: formState.firstName,
            last_name: formState.lastName,
            address_1: formState.address,
            city: formState.city,
            postal_code: formState.postalCode,
            country_code: formState.countryCode,
          },
          billing_address: {
            first_name: formState.firstName,
            last_name: formState.lastName,
            address_1: formState.address,
            city: formState.city,
            postal_code: formState.postalCode,
            country_code: formState.countryCode,
          },
        }),
      });

      const warnings: string[] = [];

      for (const item of items) {
        const response = await fetch(`${medusaConfig.baseUrl}/store/carts/${cartId}/line-items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": medusaConfig.publishableKey,
          },
          body: JSON.stringify({
            variant_id: item.variantId,
            quantity: item.quantity,
          }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { message?: string } | null;
          warnings.push(`${item.productTitle}: ${payload?.message || `line item sync failed (${response.status})`}`);
        }
      }

      setSyncWarnings(warnings);
      setSuccessMessage(
        warnings.length === 0
          ? "Checkout payload synced to Medusa. Stripe is the next layer to add."
          : "Customer details synced to Medusa, but some line items could not be added to the remote cart yet.",
      );
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Checkout</p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-950">{tenantSlug}</h1>
              <p className="mt-2 text-sm text-gray-600">
                This step creates a Medusa cart, syncs customer details, and attempts to push line items into the store backend.
              </p>
            </div>
            <Link href={`/storefront/${tenantSlug}`} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900">
              Back to storefront
            </Link>
          </div>

          {error ? <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          {successMessage ? <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div> : null}
          {remoteCartId ? <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">Medusa cart: {remoteCartId}</div> : null}
          {syncWarnings.length > 0 ? (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p className="font-semibold">Sync warnings</p>
              <ul className="mt-2 list-disc pl-5">
                {syncWarnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <form className="space-y-8" onSubmit={handleCheckout}>
            <section>
              <h2 className="text-xl font-semibold text-gray-950">Contact</h2>
              <div className="mt-4 grid gap-4">
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="buyer@example.com"
                  value={formState.email}
                  onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                  className="rounded-2xl border border-gray-300 px-4 py-3"
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-950">Shipping details</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input required type="text" name="firstName" autoComplete="given-name" placeholder="First name" value={formState.firstName} onChange={(event) => setFormState((current) => ({ ...current, firstName: event.target.value }))} className="rounded-2xl border border-gray-300 px-4 py-3" />
                <input required type="text" name="lastName" autoComplete="family-name" placeholder="Last name" value={formState.lastName} onChange={(event) => setFormState((current) => ({ ...current, lastName: event.target.value }))} className="rounded-2xl border border-gray-300 px-4 py-3" />
                <input required type="text" name="address" autoComplete="street-address" placeholder="Street address" value={formState.address} onChange={(event) => setFormState((current) => ({ ...current, address: event.target.value }))} className="rounded-2xl border border-gray-300 px-4 py-3 md:col-span-2" />
                <input required type="text" name="city" autoComplete="address-level2" placeholder="City" value={formState.city} onChange={(event) => setFormState((current) => ({ ...current, city: event.target.value }))} className="rounded-2xl border border-gray-300 px-4 py-3" />
                <input required type="text" name="postalCode" autoComplete="postal-code" placeholder="Postal code" value={formState.postalCode} onChange={(event) => setFormState((current) => ({ ...current, postalCode: event.target.value }))} className="rounded-2xl border border-gray-300 px-4 py-3" />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-950">Payment layer</h2>
              <div className="mt-4 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
                Stripe Connect is intentionally deferred. This flow stops after Medusa cart/customer sync so the commerce foundation is real before payments are layered on.
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={loading || items.length === 0} className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Syncing cart..." : "Sync checkout to Medusa"}
              </button>
              <button type="button" onClick={() => { clearCart(tenantSlug); refreshCart(); }} className="rounded-full border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Clear local cart
              </button>
            </div>
          </form>
        </div>

        <aside className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-950">Order summary</h2>
          <p className="mt-2 text-sm text-gray-600">Cart items are stored locally per tenant storefront until checkout sync runs.</p>

          <div className="mt-6 space-y-4">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
                No products in cart yet.
              </div>
            ) : (
              items.map((item) => (
                <div key={item.variantId} className="rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-950">{item.productTitle}</h3>
                      <p className="text-sm text-gray-500">{item.variantTitle || "Default variant"}</p>
                      <p className="mt-2 text-sm font-medium text-blue-700">{formatMoney(item.unitAmount, item.currencyCode)}</p>
                    </div>
                    <select
                      value={item.quantity}
                      onChange={(event) => handleQuantityChange(item.variantId, Number(event.target.value))}
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    >
                      {[1, 2, 3, 4, 5].map((quantity) => (
                        <option key={quantity} value={quantity}>{quantity}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal, currencyCode)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-base font-semibold text-gray-950">
              <span>Estimated total</span>
              <span>{formatMoney(subtotal, currencyCode)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
