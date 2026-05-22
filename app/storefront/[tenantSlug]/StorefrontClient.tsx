"use client"

import { puckComponents } from "@/lib/puck/components";
import type { Doc } from "@/convex/_generated/dataModel";
import type { PuckComponentName, StorefrontPuckData } from "@/lib/puck/types";

type StorefrontClientData = {
  tenant: Doc<"tenants">;
  storefront: Doc<"storefronts">;
};

export default function StorefrontClient({
  data,
}: {
  data: StorefrontClientData;
}) {
  const rawPuckData = data.storefront.puckData;
  const puckData: StorefrontPuckData = Array.isArray(rawPuckData)
    ? rawPuckData as StorefrontPuckData
    : [];

  return (
    <div className="min-h-screen">
      {puckData.map((block, index) => {
        const Component = puckComponents[block.type as PuckComponentName];
        if (!Component) return <div key={index}>Unknown block: {block.type}</div>;
        return <Component key={index} {...block.props} />;
      })}
    </div>
  );
}
