"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, type ComponentType } from "react";

type HeaderProps = { title?: string };
type HeroSectionProps = { title?: string; subtitle?: string };
type ProductGridProps = { source?: string; itemsPerView?: number };
type SocialProofProps = { heading?: string };
type ContentBlockProps = { heading?: string; content?: string };
type AccordionFAQProps = { heading?: string };
type ContactFormProps = { email?: string };
type FooterProps = { text?: string };

type MedusaProduct = {
  id: string;
  title?: string;
  description?: string | null;
  thumbnail?: string | null;
};

type PuckBlock = {
  type: keyof typeof config.components;
  props: Record<string, string | number | boolean | null | undefined> & { id?: string };
};

type PuckData = {
  content?: PuckBlock[];
};

function Header({ title }: HeaderProps) {
  return (
    <header className="p-6 bg-black text-white text-xl font-bold text-center tracking-tight sticky top-0 z-50">
      {title}
    </header>
  );
}

function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <div className="py-32 px-4 text-center bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">{title}</h1>
      <p className="mt-4 text-xl md:text-2xl text-gray-600 max-w-3xl">{subtitle}</p>
    </div>
  );
}

function ProductGrid({ source, itemsPerView }: ProductGridProps) {
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(source === "medusa");

  useEffect(() => {
    if (source !== "medusa") return;

    let cancelled = false;

    async function fetchProducts() {
      try {
        const url = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://193.203.164.230:9000";
        const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_948836da5e44b03b4151d1e37fa54bd922f72fd38971cb0f0381e3700191a3ec";

        const res = await fetch(`${url}/store/products?limit=${itemsPerView || 8}`, {
          headers: {
            "x-publishable-api-key": key,
          },
        });
        const data = (await res.json()) as { products?: MedusaProduct[] };
        if (!cancelled) setProducts(data.products || []);
      } catch (e) {
        console.error("Failed to fetch Medusa products", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [source, itemsPerView]);

  return (
    <div className="py-24 px-8 text-center bg-white">
      <h2 className="text-3xl font-bold mb-12">Featured Products</h2>
      {loading ? (
        <div className="animate-pulse flex flex-wrap justify-center gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 w-64 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="bg-gray-50 h-48 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                {product.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.thumbnail} alt={product.title || "Product image"} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-gray-400 font-medium">No Image</span>
                )}
              </div>
              <h3 className="font-bold text-lg text-gray-900 truncate">{product.title}</h3>
              <p className="text-gray-500 line-clamp-2 text-sm mt-1 mb-4">{product.description || "No description provided."}</p>
              <button
                onClick={() => alert(`Added ${product.title || "product"} to Medusa Cart!`)}
                className="w-full py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-2xl p-20 text-gray-500 max-w-5xl mx-auto flex flex-col items-center justify-center space-y-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          <span className="font-semibold text-xl text-gray-900">No Products Found</span>
          <p className="text-gray-500">Medusa connection is active via reference, but your store has no products yet.</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="mt-12">
          <Link href={`/storefront/${tenantSlug}/checkout`} className="inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all">
            Proceed to Checkout
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      )}
    </div>
  );
}

function SocialProof({ heading }: SocialProofProps) {
  return (
    <div className="py-24 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold mb-12">{heading}</h2>
      <div className="flex justify-center gap-12 text-yellow-400 text-3xl">
        <span>★★★★★</span>
        <span>★★★★★</span>
        <span>★★★★★</span>
      </div>
    </div>
  );
}

function ContentBlock({ heading, content }: ContentBlockProps) {
  return (
    <div className="py-24 px-8 max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-6 text-gray-900">{heading}</h2>
      <p className="text-xl text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
}

function AccordionFAQ({ heading }: AccordionFAQProps) {
  return (
    <div className="py-24 px-8 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold mb-12">{heading}</h2>
      <div className="max-w-3xl mx-auto bg-white border rounded-xl p-8 shadow-sm">
        <p className="text-gray-500 italic">FAQ items will render here.</p>
      </div>
    </div>
  );
}

function ContactForm({ email }: ContactFormProps) {
  return (
    <div className="py-24 text-center bg-white border-t border-gray-100">
      <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
      <a href={`mailto:${email}`} className="text-xl text-indigo-600 font-medium hover:underline">{email}</a>
    </div>
  );
}

function Footer({ text }: FooterProps) {
  return (
    <footer className="p-12 bg-gray-900 text-gray-400 text-center font-medium text-sm">
      {text}
    </footer>
  );
}

const config = {
  components: {
    Header,
    HeroSection,
    ProductGrid,
    SocialProof,
    ContentBlock,
    AccordionFAQ,
    ContactForm,
    Footer,
  },
};

function isPuckData(value: unknown): value is PuckData {
  return typeof value === "object" && value !== null && "content" in value;
}

export default function StorefrontRenderer() {
  const params = useParams();
  const slug = params.tenantSlug as string;

  const data = useQuery(api.storefronts.getStorefrontByTenantSlug, { slug });

  if (data === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
          <p className="mt-4 text-gray-500 font-medium">Loading Storefront...</p>
        </div>
      </div>
    );
  }

  if (data === null || !data.storefront) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Storefront Not Found</h1>
          <p className="text-gray-500">The storefront &quot;{slug}&quot; does not exist or is unpublished.</p>
        </div>
      </div>
    );
  }

  const puckData = isPuckData(data.storefront.puckData) ? data.storefront.puckData : null;

  return (
    <div className="w-full min-h-screen bg-white">
      {puckData?.content?.map((block) => {
        const Component = config.components[block.type] as ComponentType<Record<string, string | number | boolean | null | undefined>> | undefined;
        if (!Component) return null;
        return <Component key={block.props.id || block.type} {...block.props} />;
      })}
    </div>
  );
}
