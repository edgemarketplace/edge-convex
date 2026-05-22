"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function OrganizationsPage() {
  const { user } = useUser();
  const [name, setName] = useState("");

  const currentUser = useQuery(
    api.users.currentUser,
    user ? { clerkId: user.id } : "skip"
  );

  const organizations = useQuery(
    api.organizations.listByOwner,
    currentUser ? { ownerId: currentUser._id } : "skip"
  );

  const createOrganization = useMutation(
    api.organizations.createOrganization
  );

  async function handleCreate() {
    if (!name || !currentUser) return;

    await createOrganization({
      ownerId: currentUser._id,
      name,
    });

    setName("");
  }

  if (!user) {
    return <main className="p-10">Please sign in.</main>;
  }

  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-3">
        Organizations
      </h1>

      <p className="text-gray-600 mb-8">
        Create and manage company accounts for Edge Marketplace.
      </p>

      <div className="border rounded-2xl p-6 space-y-4">
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Organization name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="bg-black text-white px-5 py-3 rounded-lg"
          onClick={handleCreate}
        >
          Create Organization
        </button>
      </div>

      <div className="mt-10 space-y-4">
        {organizations?.map((org: any) => (
          <div key={org._id} className="border rounded-xl p-5">
            <h2 className="text-xl font-semibold">{org.name}</h2>
            <p className="text-gray-600">/{org.slug}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
