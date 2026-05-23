"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentConfig } from "@puckeditor/core";
import { useEffect, useMemo, useState } from "react";
import { addCartItem, cartItemCount } from "@/lib/cart/store";
import {
  DEFAULT_MEDUSA_COLLECTION_ID,
  DEFAULT_MEDUSA_REGION_ID,
  getMedusaStorefrontConfig,
} from "@/lib/medusa/config";

export type ProductGridProps = {
  source?: "medusa";
  collectionId?: string;
  itemsPerView?: number;
  filterCategories?: boolean;
  headline?: string;
  emptyStateMessage?: string;
  id?: string;
};

type MedusaVariantPrice = {
  amount: number;
  currency_code: string;
};

type MedusaVariant = {
  id: string;
  title: string;
  prices?: MedusaVariantPrice[];
};

type MedusaProduct = {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  variants?: MedusaVariant[];
};

function formatMoney(amount?: number, currencyCode?: string) {
  if (amount === undefined || !currencyCode) return "Price unavailable";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100);
}

function firstVariant(product: MedusaProduct) {
  return product.variants?.[0] ?? null;
}

function firstPrice(product: MedusaProduct) {
  return firstVariant(product)?.prices?.[0];
}

function inferTenantSlug(pathname: string) {
  const match = pathname.match(/^\/storefront\/([^/]+)/);
  return match?.[1] ?? "preview";
}

function ProductGridRenderer({
  source = "medusa",
  collectionId,
  itemsPerView = 8,
  headline,
  emptyStateMessage,
}: ProductGridProps) {
  const pathname = usePathname();
  const tenantSlug = inferTenantSlug(pathname);
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(() => cartItemCount(tenantSlug));
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  const medusaConfig = useMemo(() => getMedusaStorefrontConfig(), []);
  const checkoutHref = tenantSlug === "preview" ? null : `/storefront/${tenantSlug}/checkout`;

  useEffect(() => {
    if (source !== "medusa") return;
    if (!medusaConfig.baseUrl || !medusaConfig.publishableKey) return;

    const resolvedCollectionId = collectionId || medusaConfig.defaultCollectionId || DEFAULT_MEDUSA_COLLECTION_ID;
    const resolvedBaseUrl = medusaConfig.baseUrl;
    const resolvedPublishableKey = medusaConfig.publishableKey;
    const resolvedRegionId = medusaConfig.defaultRegionId || DEFAULT_MEDUSA_REGION_ID;
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const url = new URL(`${resolvedBaseUrl}/store/products`);
        url.searchParams.set("collection_id[]", resolvedCollectionId);
        url.searchParams.set("limit", String(itemsPerView));
        url.searchParams.set("region_id", resolvedRegionId);
        url.searchParams.set("fields", "title,description,thumbnail,*variants.prices,*variants.id,*variants.title");

        const response = await fetch(url.toString(), {
          headers: {
            "x-publishable-api-key": resolvedPublishableKey,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Medusa request failed with ${response.status}`);
        }

        const payload = (await response.json()) as { products?: MedusaProduct[] };
        if (!cancelled) {
          setProducts(Array.isArray(payload.products) ? payload.products : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load products");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [collectionId, itemsPerView, medusaConfig.baseUrl, medusaConfig.defaultCollectionId, medusaConfig.defaultRegionId, medusaConfig.publishableKey, source]);

  function handleAddToCart(product: MedusaProduct) {
    const variant = firstVariant(product);
    const price = firstPrice(product);

    if (!variant) {
      setCartMessage("This product is missing a Medusa variant and cannot be added yet.");
      return;
    }

    addCartItem({
      tenantSlug,
      productId: product.id,
      variantId: variant.id,
      productTitle: product.title,
      variantTitle: variant.title,
      quantity: 1,
      unitAmount: price?.amount,
      currencyCode: price?.currency_code,
      thumbnail: product.thumbnail,
      collectionId: collectionId || medusaConfig.defaultCollectionId || DEFAULT_MEDUSA_COLLECTION_ID,
    });

    setCartCount(cartItemCount(tenantSlug));
    setCartMessage(`${product.title} added to cart.`);
  }

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
            Commerce blocks
          </p>
          <h3 className="mt-2 text-3xl font-semibold text-gray-950">
            {headline || "Featured products"}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>Source: Medusa</span>
          {checkoutHref ? (
            <Link href={checkoutHref} className="rounded-full border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900">
              Cart ({cartCount})
            </Link>
          ) : null}
        </div>
      </div>

      {cartMessage ? (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {cartMessage}
        </div>
      ) : null}

      {!medusaConfig.baseUrl || !medusaConfig.publishableKey ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
          Set NEXT_PUBLIC_MEDUSA_BACKEND_URL and NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY to hydrate this block.
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {Array.from({ length: itemsPerView }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-gray-200 p-4">
              <div className="mb-4 h-40 rounded-xl bg-gray-200" />
              <div className="mb-2 h-4 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
          {emptyStateMessage || "No products were returned for this Medusa collection yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {products.map((product) => {
            const variant = firstVariant(product);
            const price = firstPrice(product);

            return (
              <article key={product.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="aspect-[4/3] bg-gray-100">
                  {product.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No image available
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <h4 className="text-lg font-semibold text-gray-950">{product.title}</h4>
                  <p className="line-clamp-3 text-sm text-gray-600">
                    {product.description || "Merchandise and pricing are hydrated live from Medusa."}
                  </p>
                  <div className="text-sm text-gray-500">
                    {variant ? `Default option: ${variant.title}` : "No variants available"}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-blue-700">
                      {formatMoney(price?.amount, price?.currency_code)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={!variant}
                      className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export const ProductGrid = (props: ProductGridProps) => <ProductGridRenderer {...props} />;

export const productGridConfig: ComponentConfig<ProductGridProps> = {
  render: ProductGrid,
  fields: {
    source: {
      type: "select",
      options: [{ label: "Medusa", value: "medusa" }],
    },
    headline: { type: "text" },
    collectionId: { type: "text", label: "Medusa collection ID" },
    itemsPerView: { type: "number", label: "Items per view" },
    filterCategories: {
      type: "radio",
      options: [
        { label: "On", value: true },
        { label: "Off", value: false },
      ],
    },
    emptyStateMessage: { type: "textarea" },
  },
  defaultProps: {
    source: "medusa",
    headline: "Featured products",
    collectionId: DEFAULT_MEDUSA_COLLECTION_ID,
    itemsPerView: 8,
    filterCategories: true,
    emptyStateMessage: "No products were returned for this Medusa collection yet.",
  },
};
