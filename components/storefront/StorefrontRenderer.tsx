"use client";

import "@puckeditor/core/puck.css";

import { useEffect, useMemo, useState } from "react";
import { Render, type Config, type Data } from "@puckeditor/core";

type StorefrontData = Partial<Data>;

function ProductGridBlock({
  source,
  collectionId,
  itemsPerView,
  filterCategories,
  categoryIds,
}: {
  source?: string;
  collectionId?: string;
  itemsPerView?: number;
  filterCategories?: boolean;
  categoryIds?: string;
}) {
  const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  const hasMedusaConfig = Boolean(backend && key);

  const [products, setProducts] = useState<Array<{ id: string; title: string }>>([]);
  const [loading, setLoading] = useState(hasMedusaConfig);

  useEffect(() => {
    if (!backend || !key) return;

    let cancelled = false;
    const params = new URLSearchParams();

    const limit = Number.isFinite(itemsPerView) && (itemsPerView ?? 0) > 0 ? Math.floor(itemsPerView as number) : 8;
    params.set("limit", String(limit));

    if (collectionId && collectionId !== "default") {
      params.append("collection_id", collectionId);
    }

    if (filterCategories && categoryIds) {
      categoryIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
        .forEach((id) => params.append("category_id", id));
    }

    fetch(`${backend}/store/products?${params.toString()}`, {
      headers: {
        "x-publishable-api-key": key,
      },
    })
      .then((res) => res.json())
      .then((data: { products?: Array<{ id: string; title: string }> }) => {
        if (cancelled) return;
        setProducts((data.products ?? []).map((p) => ({ id: p.id, title: p.title })));
      })
      .catch(() => {
        if (cancelled) return;
        setProducts([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [backend, key, collectionId, itemsPerView, filterCategories, categoryIds]);

  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <p className="text-sm text-gray-600 mb-3">
        source: {String(source ?? "medusa")} | collectionId: {String(collectionId ?? "default")} | itemsPerView: {String(itemsPerView ?? 8)} | filterCategories: {String(Boolean(filterCategories))}
      </p>
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products available yet in Medusa.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.slice(0, itemsPerView ?? 8).map((product) => (
            <div key={product.id} className="border rounded-xl p-4">
              <p className="font-medium">{product.title}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export const storefrontPuckConfig: Config = {
  components: {
    Header: {
      fields: {
        brand: { type: "text" },
        links: { type: "text" },
      },
      defaultProps: {
        brand: "Storefront",
        links: "Products, About, Contact",
      },
      render: ({ brand, links }) => (
        <header className="border-b pb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{String(brand ?? "Storefront")}</h1>
          <nav className="text-sm text-gray-600">{String(links ?? "")}</nav>
        </header>
      ),
    },
    HeroSection: {
      fields: {
        headline: { type: "text" },
        subheadline: { type: "textarea" },
        ctaLabel: { type: "text" },
      },
      render: ({ headline, subheadline }) => (
        <section className="py-10">
          <h2 className="text-4xl font-bold">{String(headline ?? "")}</h2>
          <p className="mt-3 text-lg text-gray-700">{String(subheadline ?? "")}</p>
        </section>
      ),
    },
    ProductGrid: {
      fields: {
        source: { type: "text" },
        collectionId: { type: "text" },
        itemsPerView: { type: "number" },
        filterCategories: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
        categoryIds: { type: "text" },
      },
      render: ({ source, collectionId, itemsPerView, filterCategories, categoryIds }) => (
        <ProductGridBlock
          source={typeof source === "string" ? source : undefined}
          collectionId={typeof collectionId === "string" ? collectionId : undefined}
          itemsPerView={typeof itemsPerView === "number" ? itemsPerView : undefined}
          filterCategories={typeof filterCategories === "boolean" ? filterCategories : undefined}
          categoryIds={typeof categoryIds === "string" ? categoryIds : undefined}
        />
      ),
    },
    SocialProof: {
      fields: {
        title: { type: "text" },
        item1: { type: "text" },
        item2: { type: "text" },
        item3: { type: "text" },
      },
      render: ({ title, item1, item2, item3 }) => {
        const items = [item1, item2, item3].filter((item): item is string => Boolean(item));
        return (
          <section className="py-6">
            <h3 className="text-xl font-semibold mb-2">{String(title ?? "")}</h3>
            <ul className="list-disc pl-5">
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        );
      },
    },
    ContentBlock: {
      fields: {
        title: { type: "text" },
        body: { type: "textarea" },
      },
      render: ({ title, body }) => (
        <section className="py-6">
          <h3 className="text-xl font-semibold mb-2">{String(title ?? "")}</h3>
          <p>{String(body ?? "")}</p>
        </section>
      ),
    },
    AccordionFAQ: {
      fields: {
        title: { type: "text" },
        q1: { type: "text" },
        a1: { type: "textarea" },
        q2: { type: "text" },
        a2: { type: "textarea" },
      },
      render: ({ title, q1, a1, q2, a2 }) => {
        const items = [
          { question: String(q1 ?? ""), answer: String(a1 ?? "") },
          { question: String(q2 ?? ""), answer: String(a2 ?? "") },
        ].filter((item) => item.question && item.answer);

        return (
          <section className="py-6">
            <h3 className="text-xl font-semibold mb-3">{String(title ?? "FAQ")}</h3>
            <div className="space-y-3">
              {items.map((item, index) => (
                <details key={index} className="border rounded-lg p-3">
                  <summary className="font-medium cursor-pointer">{item.question}</summary>
                  <p className="mt-2 text-gray-700">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        );
      },
    },
    ContactForm: {
      fields: {
        title: { type: "text" },
        submitLabel: { type: "text" },
      },
      render: ({ title, submitLabel }) => (
        <section className="py-6">
          <h3 className="text-xl font-semibold mb-3">{String(title ?? "Contact")}</h3>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input className="w-full border rounded-lg p-3" placeholder="Name" />
            <input className="w-full border rounded-lg p-3" placeholder="Email" />
            <textarea className="w-full border rounded-lg p-3" placeholder="Message" rows={4} />
            <button className="bg-black text-white px-4 py-2 rounded-lg" type="submit">
              {String(submitLabel ?? "Submit")}
            </button>
          </form>
        </section>
      ),
    },
    Footer: {
      fields: {
        copyright: { type: "text" },
      },
      render: ({ copyright }) => (
        <footer className="border-t pt-6 text-sm text-gray-600">{String(copyright ?? "")}</footer>
      ),
    },
  },
};

export function StorefrontRenderer({ data }: { data: StorefrontData }) {
  const stableData = useMemo(() => data, [data]);
  return <Render config={storefrontPuckConfig} data={stableData} />;
}
