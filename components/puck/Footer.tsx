import { ComponentConfig } from "@puckeditor/core";

export type FooterProps = {
  businessName?: string;
  tagline?: string;
  id?: string;
};

export const Footer = ({ businessName, tagline }: FooterProps) => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-10 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {businessName || "Your business"}</p>
        <p>{tagline || "Generated with a reusable storefront compiler."}</p>
      </div>
    </footer>
  );
};

export const footerConfig: ComponentConfig<FooterProps> = {
  render: Footer,
  fields: {
    businessName: { type: "text" },
    tagline: { type: "text" },
  },
  defaultProps: {
    businessName: "Your business",
    tagline: "Generated with a reusable storefront compiler.",
  },
};
