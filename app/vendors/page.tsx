"use client";

import { useState } from "react";

import { useMutation, useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

export default function VendorsPage() {
  const vendors = useQuery(api.vendors.listVendors);

  const createVendor = useMutation(
    api.vendors.createVendor
  );

  const [companyName, setCompanyName] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [website, setWebsite] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [contactEmail, setContactEmail] =
    useState("");

  async function handleSubmit() {
    if (!companyName || !category) return;

    await createVendor({
      companyName,
      category,
      website,
      description,
      contactEmail,
    });

    setCompanyName("");
    setCategory("");
    setWebsite("");
    setDescription("");
    setContactEmail("");
  }

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-3">
        Vendor Onboarding
      </h1>

      <p className="text-gray-600 mb-10">
        Create a vendor profile for Edge Marketplace.
      </p>

      <div className="border rounded-2xl p-6 space-y-4">
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) =>
            setCompanyName(e.target.value)
          }
        />

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Website"
          value={website}
          onChange={(e) =>
            setWebsite(e.target.value)
          }
        />

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Contact Email"
          value={contactEmail}
          onChange={(e) =>
            setContactEmail(e.target.value)
          }
        />

        <textarea
          className="w-full border rounded-lg p-3"
          placeholder="Company Description"
          rows={4}
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <button
          className="bg-black text-white px-5 py-3 rounded-lg"
          onClick={handleSubmit}
        >
          Submit Vendor
        </button>
      </div>

      <div className="mt-14">
        <h2 className="text-2xl font-bold mb-6">
          Vendor Directory
        </h2>

        <div className="space-y-5">
          {vendors?.map((vendor) => (
            <div
              key={vendor._id}
              className="border rounded-xl p-5"
            >
              <h3 className="text-xl font-semibold">
                {vendor.companyName}
              </h3>

              <p className="text-gray-600">
                {vendor.category}
              </p>

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
                <p className="mt-4">
                  {vendor.description}
                </p>
              )}

              <div className="mt-4 text-sm">
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
      </div>
    </main>
  );
}
