import { ComponentConfig } from "@puckeditor/core";

export type ProductGridProps = {
  source?: string;
  collectionId?: string;
  itemsPerView?: number;
  filterCategories?: boolean;
};

export const ProductGrid: React.FC<ProductGridProps> = ({ source, itemsPerView = 8 }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8">Our Products</h2>
      {source === "medusa" ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Placeholder for Medusa products - will hydrate from Medusa API */}
          {Array(itemsPerView).fill(0).map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="bg-gray-100 h-48 mb-4 rounded"></div>
              <h3 className="font-semibold">Product {i + 1}</h3>
              <p className="text-gray-600">$99.99</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Product grid (source: {source || "none"})</p>
      )}
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
    collectionId: { type: "text" },
    itemsPerView: { type: "number" },
    filterCategories: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
  },
  defaultProps: {
    source: "medusa",
    itemsPerView: 8,
    filterCategories: true,
  },
};
