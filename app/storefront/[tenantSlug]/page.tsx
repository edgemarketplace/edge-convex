"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { StorefrontRenderer } from "@/components/storefront/StorefrontRenderer";

export default function TenantStorefrontPage() {
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;

  const storefrontApi = (api as any).storefronts;
  const data = useQuery(storefrontApi.getStorefrontByTenantSlug, { tenantSlug });

  if (data === undefined) {
    return <main className="p-10">Loading storefront...</main>;
  }

  if (!data) {
    return <main className="p-10">Storefront not found.</main>;
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">Tenant: {data.tenant.slug}</p>
        <a href={`/storefront/${data.tenant.slug}/edit`} className="text-sm underline">
          Edit draft
        </a>
      </div>
      <StorefrontRenderer data={data.renderData ?? {}} />
    </main>
  );
}
