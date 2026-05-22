import { ComponentConfig } from "@puckeditor/core";

export type FooterProps = {
  businessName?: string;
  year?: number;
};

export const Footer: React.FC<FooterProps> = ({ businessName, year }) => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
        © {year || new Date().getFullYear()} {businessName || "Your Business"}. All rights reserved.
      </div>
    </footer>
  );
};

export const footerConfig: ComponentConfig<FooterProps> = {
  render: Footer,
  fields: {
    businessName: { type: "text" },
    year: { type: "number" },
  },
  defaultProps: {
    businessName: "Your Business",
    year: new Date().getFullYear(),
  },
};
