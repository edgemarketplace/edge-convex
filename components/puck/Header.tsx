import { ComponentConfig } from "@puckeditor/core";

export type HeaderProps = {
  businessName?: string;
  announcement?: string;
  id?: string;
};

export const Header = ({ businessName, announcement }: HeaderProps) => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
            Edge Marketplace
          </p>
          <h1 className="text-xl font-semibold text-gray-950">
            {businessName || "Your business"}
          </h1>
        </div>
        <div className="text-sm text-gray-600">{announcement || "Deterministic storefront blueprint"}</div>
      </div>
    </header>
  );
};

export const headerConfig: ComponentConfig<HeaderProps> = {
  render: Header,
  fields: {
    businessName: { type: "text" },
    announcement: { type: "text" },
  },
  defaultProps: {
    businessName: "Your business",
    announcement: "Deterministic storefront blueprint",
  },
};
