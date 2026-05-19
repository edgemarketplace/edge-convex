"use client";

import { useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

export default function MarketplacePage() {
  const vendors = useQuery(
    api.vendors.listApprovedVendors
  );

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-5xl font-bold mb-3">
        Edge Marketplace
      </h1>

      <p className="text-gray-600 mb-10">
        Discover approved vendors across
        finance, emerging technology,
        procurement, and commerce.
      </p>

      <div className="grid md:grid-cols-2 gap-5">
        {vendors?.map((vendor) => (
          <div
            key={vendor._id}
            className="border rounded-2xl p-6"
          >
            <h2 className="text-2xl font-semibold">
              {vendor.companyName}
            </h2>

            <p className="text-gray-600 mt-1">
              {vendor.category}
            </p>

            {vendor.description && (
              <p className="mt-4">
                {vendor.description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`/org/${vendor.companyName
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Visit Storefront
              </a>

              {vendor.website && (
                <a
                  href={vendor.website}
                  target="_blank"
                  className="border px-4 py-2 rounded-lg"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {vendors?.length === 0 && (
        <p className="text-gray-600">
          No approved vendors yet.
        </p>
      )}
    </main>
  );
}
