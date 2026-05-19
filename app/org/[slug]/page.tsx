"use client";

import { useParams } from "next/navigation";

import { useQuery } from "convex/react";

import { api } from "../../../convex/_generated/api";

export default function OrganizationStorefrontPage() {
  const params = useParams();

  const slug = params.slug as string;

  const organization = useQuery(
    api.organizations.getBySlug,
    {
      slug,
    }
  );

  const vendor = useQuery(
    api.vendors.getApprovedVendorByOrganization,
    organization
      ? {
          organizationId: organization._id,
        }
      : "skip"
  );

  if (organization === undefined) {
    return (
      <main className="p-10">
        Loading storefront...
      </main>
    );
  }

  if (!organization) {
    return (
      <main className="p-10">
        Organization not found.
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-10">
      <div className="border rounded-3xl p-10">
        <p className="text-sm text-gray-500 mb-3">
          Edge Marketplace Storefront
        </p>

        <h1 className="text-5xl font-bold">
          {organization.name}
        </h1>

        {vendor ? (
          <>
            <p className="text-xl text-gray-600 mt-4">
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
          </>
        ) : (
          <p className="mt-6 text-gray-600">
            No approved vendor profile yet.
          </p>
        )}

        <div className="mt-10 border-t pt-6">
          <h2 className="text-2xl font-semibold mb-3">
            Coming Soon
          </h2>

          <p className="text-gray-600">
            Products, RFQs, AI procurement,
            demos, and Medusa-powered commerce.
          </p>
        </div>
      </div>
    </main>
  );
}
