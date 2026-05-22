import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import StorefrontClient from "./StorefrontClient";

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  // Fetch storefront data server-side
  const data = await fetchQuery(api.storefronts.getStorefrontByTenantSlug, {
    tenantSlug,
  });

  if (!data) {
    return <div className="p-6 text-red-600">Storefront not found</div>;
  }

  return <StorefrontClient data={data} />;
}
