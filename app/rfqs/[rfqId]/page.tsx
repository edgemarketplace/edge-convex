"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

type RFQResponse = Doc<"rfqResponses"> & {
  organizationName: string;
  organizationSlug: string;
};

export default function RFQDetailPage() {
  const { user } = useUser();
  const params = useParams();

  const rfqId = params.rfqId as Id<"rfqs">;

  const rfq = useQuery(api.rfqs.getRFQ, {
    rfqId,
  });

  const responses = useQuery(api.rfqs.listRFQResponses, {
    rfqId,
  });

  const currentUser = useQuery(
    api.users.currentUser,
    user ? { clerkId: user.id } : "skip"
  );

  const organizations = useQuery(
    api.organizations.listByOwner,
    currentUser ? { ownerId: currentUser._id } : "skip"
  );

  const createResponse = useMutation(api.rfqs.createRFQResponse);
  const updateStatus = useMutation(api.rfqs.updateRFQStatus);

  const [organizationId, setOrganizationId] = useState("");
  const [message, setMessage] = useState("");
  const [proposedBudget, setProposedBudget] = useState("");

  async function handleSubmit() {
    if (!organizationId || !message) return;

    await createResponse({
      rfqId,
      organizationId: organizationId as Id<"organizations">,
      message,
      proposedBudget,
    });

    setMessage("");
    setProposedBudget("");
  }

  if (!rfq) {
    return <main className="p-10">Loading RFQ...</main>;
  }

  return (
    <main className="max-w-5xl mx-auto p-10">
      <Link href="/rfqs" className="text-blue-600 inline-block mb-8">
        ← Back to RFQs
      </Link>

      <div className="border rounded-3xl p-8">
        <div className="flex items-center justify-between gap-6">
          <h1 className="text-5xl font-bold">{rfq.title}</h1>

          <span className="text-blue-600">{rfq.status}</span>
        </div>

        <p className="text-xl text-gray-600 mt-3">{rfq.category}</p>

        {rfq.budget && (
          <p className="mt-4">
            <strong>Budget:</strong> {rfq.budget}
          </p>
        )}

        <p className="mt-8 leading-8 text-lg">{rfq.description}</p>

        <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
          <button
            className="border px-4 py-2 rounded-lg"
            onClick={() =>
              updateStatus({
                rfqId,
                status: "open",
              })
            }
          >
            Mark Open
          </button>

          <button
            className="border px-4 py-2 rounded-lg"
            onClick={() =>
              updateStatus({
                rfqId,
                status: "in_review",
              })
            }
          >
            Mark In Review
          </button>

          <button
            className="bg-black text-white px-4 py-2 rounded-lg"
            onClick={() =>
              updateStatus({
                rfqId,
                status: "closed",
              })
            }
          >
            Mark Closed
          </button>
        </div>
      </div>

      <div className="mt-10 border rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-6">Vendor Response</h2>

        <div className="space-y-4">
          <select
            className="w-full border rounded-lg p-3"
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
          >
            <option value="">Select Organization</option>

            {organizations?.map((org: Doc<"organizations">) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
          </select>

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Proposed Budget"
            value={proposedBudget}
            onChange={(e) => setProposedBudget(e.target.value)}
          />

          <textarea
            rows={5}
            className="w-full border rounded-lg p-3"
            placeholder="Vendor response..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            className="bg-black text-white px-5 py-3 rounded-lg"
            onClick={handleSubmit}
          >
            Submit Response
          </button>
        </div>
      </div>

      <div className="mt-10 space-y-5">
        <h2 className="text-3xl font-bold">Responses</h2>

        {responses?.map((response: RFQResponse) => (
          <div key={response._id} className="border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  {response.organizationName}
                </h3>

                {response.organizationSlug && (
                  <a
                    href={`/org/${response.organizationSlug}`}
                    className="text-blue-600 text-sm"
                  >
                    Visit Storefront
                  </a>
                )}
              </div>

              {response.proposedBudget && (
                <p className="text-sm">
                  <strong>Budget:</strong> {response.proposedBudget}
                </p>
              )}
            </div>

            <p className="mt-5 leading-7">{response.message}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
