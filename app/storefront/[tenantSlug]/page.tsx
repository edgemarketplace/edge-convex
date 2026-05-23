import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import StorefrontClient from "./StorefrontClient";

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const data = await fetchQuery(api.storefronts.getStorefrontByTenantSlug, { tenantSlug });

  if (!data) {
    return <div className="px-4 py-12 text-sm text-red-600">Storefront not found.</div>;
  }

  return <StorefrontClient data={data} />;
}
