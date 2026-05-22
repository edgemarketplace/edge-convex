import { ComponentConfig } from "@puckeditor/core";

export type HeroSectionProps = {
  headline?: string;
  subheadline?: string;
};

export const HeroSection: React.FC<HeroSectionProps> = ({ headline, subheadline }) => {
  return (
    <section className="bg-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">{headline || "Welcome to Our Store"}</h2>
        <p className="text-xl text-gray-600 mb-8">{subheadline || "Discover our products and services"}</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Shop Now
        </button>
      </div>
    </section>
  );
};

export const heroSectionConfig: ComponentConfig<HeroSectionProps> = {
  fields: {
    headline: { type: "text" },
    subheadline: { type: "text" },
  },
  defaultProps: {
    headline: "Welcome to Our Store",
    subheadline: "Discover our products and services",
  },
};
