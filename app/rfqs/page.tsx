"use client";

import { useState } from "react";

import { useUser } from "@clerk/nextjs";

import { useMutation, useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

export default function RFQsPage() {
  const { user } = useUser();

  const currentUser = useQuery(
    api.users.currentUser,
    user
      ? {
          clerkId: user.id,
        }
      : "skip"
  );

  const organizations = useQuery(
    api.organizations.listByOwner,
    currentUser
      ? {
          ownerId: currentUser._id,
        }
      : "skip"
  );

  const rfqs = useQuery(api.rfqs.listRFQs);

  const createRFQ = useMutation(
    api.rfqs.createRFQ
  );

  const [organizationId, setOrganizationId] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [budget, setBudget] =
    useState("");

  async function handleSubmit() {
    if (
      !organizationId ||
      !title ||
      !category ||
      !description
    )
      return;

    await createRFQ({
      organizationId:
        organizationId as any,

      title,

      category,

      description,

      budget,
    });

    setTitle("");
    setCategory("");
    setDescription("");
    setBudget("");
  }

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-5xl font-bold mb-3">
        Procurement RFQs
      </h1>

      <p className="text-gray-600 mb-10">
        Create and review procurement requests across Edge Marketplace.
      </p>

      <div className="border rounded-2xl p-6 space-y-4">
        <select
          className="w-full border rounded-lg p-3"
          value={organizationId}
          onChange={(e) =>
            setOrganizationId(e.target.value)
          }
        >
          <option value="">
            Select Organization
          </option>

          {organizations?.map((org) => (
            <option
              key={org._id}
              value={org._id}
            >
              {org.name}
            </option>
          ))}
        </select>

        <input
          className="w-full border rounded-lg p-3"
          placeholder="RFQ Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
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
          placeholder="Budget"
          value={budget}
          onChange={(e) =>
            setBudget(e.target.value)
          }
        />

        <textarea
          rows={5}
          className="w-full border rounded-lg p-3"
          placeholder="Describe procurement requirements..."
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <button
          className="bg-black text-white px-5 py-3 rounded-lg"
          onClick={handleSubmit}
        >
          Create RFQ
        </button>
      </div>

      <div className="mt-14 space-y-5">
        {rfqs?.map((rfq) => (
          <div
            key={rfq._id}
            className="border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {rfq.title}
              </h2>

              <span className="text-sm text-blue-600">
                {rfq.status}
              </span>
            </div>

            <p className="text-gray-600 mt-1">
              {rfq.category}
            </p>

            {rfq.budget && (
              <p className="mt-3">
                <strong>Budget:</strong>{" "}
                {rfq.budget}
              </p>
            )}

            <p className="mt-4 leading-7">
              {rfq.description}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
