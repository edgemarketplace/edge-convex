"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function OperatorPage() {
  const vendors = useQuery(api.vendors.listAllVendors);

  const approveVendor = useMutation(api.vendors.approveVendor);
  const rejectVendor = useMutation(api.vendors.rejectVendor);

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-3">
        Operator Console
      </h1>

      <p className="text-gray-600 mb-10">
        Review and approve vendor profiles for Edge Marketplace.
      </p>

      <div className="space-y-5">
        {vendors?.map((vendor: any) => (
          <div key={vendor._id} className="border rounded-xl p-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {vendor.companyName}
                </h2>

                <p className="text-gray-600">{vendor.category}</p>

                {vendor.website && (
                  <a
                    href={vendor.website}
                    target="_blank"
                    className="text-blue-600 block mt-2"
                  >
                    {vendor.website}
                  </a>
                )}

                {vendor.contactEmail && (
                  <p className="mt-2 text-sm">
                    {vendor.contactEmail}
                  </p>
                )}

                {vendor.description && (
                  <p className="mt-4">{vendor.description}</p>
                )}

                <div className="mt-4 text-sm">
                  {vendor.approved ? (
                    <span className="text-green-600">Approved</span>
                  ) : (
                    <span className="text-yellow-600">
                      Pending Approval
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="bg-black text-white px-4 py-2 rounded-lg"
                  onClick={() =>
                    approveVendor({
                      vendorId: vendor._id,
                    })
                  }
                >
                  Approve
                </button>

                <button
                  className="border px-4 py-2 rounded-lg"
                  onClick={() =>
                    rejectVendor({
                      vendorId: vendor._id,
                    })
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
