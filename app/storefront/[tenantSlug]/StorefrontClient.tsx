"use client"

import { puckComponents } from "@/lib/puck/components";

export default function StorefrontClient({
  data,
}: {
  data: {
    tenant: any;
    storefront: { puckData: any };
  };
}) {
  const puckData = data.storefront.puckData || [];

  return (
    <div className="min-h-screen">
      {puckData.map((block: any, index: number) => {
        const Component = puckComponents[block.type as keyof typeof puckComponents];
        if (!Component) return <div key={index}>Unknown block: {block.type}</div>;
        return <Component key={index} {...block.props} />;
      })}
    </div>
  );
}
