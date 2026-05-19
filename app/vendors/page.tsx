"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function VendorsPage() {
  const vendors = useQuery(api.vendors.listVendors);

  const createVendor = useMutation(
    api.vendors.createVendor
  );

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Edge Marketplace Vendors
      </h1>

      <p className="text-gray-600 mb-8">
        Real-time multi-tenant marketplace foundation powered by Convex.
      </p>

      <button
        className="bg-black text-white px-5 py-3 rounded-lg hover:opacity-90"
        onClick={() => {
          createVendor({
            companyName: "Edge AI Systems",
            category: "Artificial Intelligence",
          });
        }}
      >
        Add Vendor
      </button>

      <div className="mt-10 space-y-4">
        {vendors?.map((vendor) => (
          <div
            key={vendor._id}
            className="border rounded-xl p-5"
          >
            <h2 className="text-xl font-semibold">
              {vendor.companyName}
            </h2>

            <p className="text-gray-600">
              {vendor.category}
            </p>

            <div className="mt-2 text-sm">
              {vendor.approved ? (
                <span className="text-green-600">
                  Approved
                </span>
              ) : (
                <span className="text-yellow-600">
                  Pending Approval
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
