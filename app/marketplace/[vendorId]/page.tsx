"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function VendorDetailPage() {
  const params = useParams();

  const vendorId = params.vendorId as Id<"vendors">;

  const vendor = useQuery(api.vendors.getApprovedVendor, {
    vendorId,
  });

  if (vendor === undefined) {
    return <main className="p-10">Loading vendor...</main>;
  }

  if (vendor === null) {
    return (
      <main className="p-10">
        Vendor not found or not approved.
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-10">
      <Link
        href="/marketplace"
        className="text-blue-600 inline-block mb-8"
      >
        ← Back to Marketplace
      </Link>

      <div className="border rounded-2xl p-8">
        <p className="text-sm text-green-600 mb-3">
          Approved Vendor
        </p>

        <h1 className="text-5xl font-bold">
          {vendor.companyName}
        </h1>

        <p className="text-xl text-gray-600 mt-3">
          {vendor.category}
        </p>

        {vendor.description && (
          <p className="mt-8 text-lg leading-8">
            {vendor.description}
          </p>
        )}

        <div className="mt-8 space-y-3">
          {vendor.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={vendor.website}
                target="_blank"
                className="text-blue-600"
              >
                {vendor.website}
              </a>
            </p>
          )}

          {vendor.contactEmail && (
            <p>
              <strong>Contact:</strong>{" "}
              <a
                href={`mailto:${vendor.contactEmail}`}
                className="text-blue-600"
              >
                {vendor.contactEmail}
              </a>
            </p>
          )}
        </div>

        <div className="mt-10 border-t pt-6">
          <h2 className="text-2xl font-semibold mb-3">
            Coming Next
          </h2>

          <p className="text-gray-600">
            Products, RFQs, demo requests, and Medusa-powered checkout
            will be connected to this vendor profile.
          </p>
        </div>
      </div>
    </main>
  );
}
