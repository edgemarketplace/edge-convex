import { ComponentConfig } from "@puckeditor/core";
import { useEffect, useState } from "react";
import type { ProductGridProps } from "./types";

export type ProductGridProps = {
  source?: string;
  collectionId?: string;
  itemsPerView?: number;
  filterCategories?: boolean;
};

interface MedusaProduct {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  variants?: Array<{
    prices?: Array<{ amount: number; currency_code: string }>;
  }>;
}

export const ProductGrid = ({ 
  source, 
  collectionId, 
  itemsPerView = 8 
}: ProductGridProps) => {
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (source !== "medusa" || !collectionId) {
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://193.203.164.230:9000";
        const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_948836da5e44b03b4151d1e37fa54bd922f72fd38971cb0f0381e3700191a3ec";
        
        const url = new URL(`${baseUrl}/store/products`);
        url.searchParams.set("collection_id", collectionId);
        url.searchParams.set("limit", itemsPerView.toString());
        
        const response = await fetch(url.toString(), {
          headers: {
            "x-publishable-api-key": publishableKey,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching Medusa products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [source, collectionId, itemsPerView]);

  if (source !== "medusa") {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Our Products</h2>
        <p className="text-gray-500">Product grid (source: {source || "none"})</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array(itemsPerView).fill(0).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="bg-gray-200 h-48 mb-4 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Our Products</h2>
        <p className="text-red-500">Error: {error}</p>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Our Products</h2>
        <p className="text-gray-500">No products found in this collection.</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map((product) => {
          const price = product.variants?.[0]?.prices?.[0];
          const priceFormatted = price 
            ? `$${(price.amount / 100).toFixed(2)}`
            : "N/A";
            
          return (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition">
              {product.thumbnail ? (
                <img 
                  src={product.thumbnail} 
                  alt={product.title}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
              ) : (
                <div className="bg-gray-100 h-48 mb-4 rounded flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              <h3 className="font-semibold mb-2">{product.title}</h3>
              {product.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
              )}
              <p className="text-lg font-bold text-green-600">{priceFormatted}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const productGridConfig: ComponentConfig<ProductGridProps> = {
  render: ProductGrid,
  fields: {
    source: { 
      type: "select", 
      options: [
        { label: "Medusa", value: "medusa" },
        { label: "Manual", value: "manual" },
      ] 
    },
    collectionId: { type: "text", label: "Collection ID" },
    itemsPerView: { type: "number", label: "Items per view" },
    filterCategories: { 
      type: "radio", 
      options: [
        { label: "Yes", value: true }, 
        { label: "No", value: false }
      ] 
    },
  },
  defaultProps: {
    source: "medusa",
    itemsPerView: 8,
    filterCategories: true,
  },
};
