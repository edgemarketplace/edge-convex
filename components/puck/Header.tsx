import { ComponentConfig } from "@puckeditor/core";

export type HeaderProps = {
  businessName?: string;
  vertical?: string;
};

export const Header = ({ businessName }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{businessName || "Storefront"}</h1>
        <nav>
          <a href="#" className="text-gray-600 hover:text-gray-900 mr-4">Home</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export const headerConfig: ComponentConfig<HeaderProps> = {
  render: Header,
  fields: {
    businessName: { type: "text" },
    vertical: { type: "text" },
  },
  defaultProps: {
    businessName: "Your Business",
    vertical: "retail",
  },
};
