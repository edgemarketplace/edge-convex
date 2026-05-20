"use client";

import { useEffect, useState } from "react";

type Block = {
  type: string;
  props: Record<string, unknown>;
};

function ProductGridBlock({ props }: { props: Record<string, unknown> }) {
  const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  const hasMedusaConfig = Boolean(backend && key);

  const [products, setProducts] = useState<Array<{ id: string; title: string }>>([]);
  const [loading, setLoading] = useState(hasMedusaConfig);

  useEffect(() => {
    if (!backend || !key) {
      return;
    }

    fetch(`${backend}/store/products`, {
      headers: {
        "x-publishable-api-key": key,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts((data.products ?? []).map((p: { id: string; title: string }) => ({ id: p.id, title: p.title })));
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <p className="text-sm text-gray-600 mb-3">
        source: {String(props.source)} | collectionId: {String(props.collectionId)} | itemsPerView: {String(props.itemsPerView)}
      </p>
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products available yet in Medusa.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-xl p-4">
              <p className="font-medium">{product.title}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function StorefrontRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.type === "Header") {
          return (
            <header key={index} className="border-b pb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">{String(block.props.brand ?? "Storefront")}</h1>
              <nav className="text-sm text-gray-600">{Array.isArray(block.props.links) ? (block.props.links as string[]).join(" • ") : null}</nav>
            </header>
          );
        }

        if (block.type === "HeroSection") {
          return (
            <section key={index} className="py-10">
              <h2 className="text-4xl font-bold">{String(block.props.headline ?? "")}</h2>
              <p className="mt-3 text-lg text-gray-700">{String(block.props.subheadline ?? "")}</p>
            </section>
          );
        }

        if (block.type === "ProductGrid") {
          return <ProductGridBlock key={index} props={block.props} />;
        }

        if (block.type === "SocialProof") {
          return (
            <section key={index} className="py-6">
              <h3 className="text-xl font-semibold mb-2">{String(block.props.title ?? "")}</h3>
              <ul className="list-disc pl-5">
                {Array.isArray(block.props.items)
                  ? (block.props.items as string[]).map((item, i) => <li key={i}>{item}</li>)
                  : null}
              </ul>
            </section>
          );
        }

        if (block.type === "ContentBlock") {
          return (
            <section key={index} className="py-6">
              <h3 className="text-xl font-semibold mb-2">{String(block.props.title ?? "")}</h3>
              <p>{String(block.props.body ?? "")}</p>
            </section>
          );
        }

        if (block.type === "AccordionFAQ") {
          const items = Array.isArray(block.props.items)
            ? (block.props.items as Array<{ question: string; answer: string }>)
            : [];
          return (
            <section key={index} className="py-6">
              <h3 className="text-xl font-semibold mb-3">{String(block.props.title ?? "FAQ")}</h3>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <details key={i} className="border rounded-lg p-3">
                    <summary className="font-medium cursor-pointer">{item.question}</summary>
                    <p className="mt-2 text-gray-700">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          );
        }

        if (block.type === "ContactForm") {
          return (
            <section key={index} className="py-6">
              <h3 className="text-xl font-semibold mb-3">{String(block.props.title ?? "Contact")}</h3>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input className="w-full border rounded-lg p-3" placeholder="Name" />
                <input className="w-full border rounded-lg p-3" placeholder="Email" />
                <textarea className="w-full border rounded-lg p-3" placeholder="Message" rows={4} />
                <button className="bg-black text-white px-4 py-2 rounded-lg" type="submit">
                  {String(block.props.submitLabel ?? "Submit")}
                </button>
              </form>
            </section>
          );
        }

        if (block.type === "Footer") {
          return (
            <footer key={index} className="border-t pt-6 text-sm text-gray-600">
              {String(block.props.copyright ?? "")}
            </footer>
          );
        }

        return null;
      })}
    </div>
  );
}
