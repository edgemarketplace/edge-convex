"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function DashboardPage() {
  const { user } = useUser();

  const createUser = useMutation(api.users.createUser);

  const currentUser = useQuery(
    api.users.currentUser,
    user ? { clerkId: user.id } : "skip"
  );

  useEffect(() => {
    if (!user) return;

    createUser({
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress || "",
      name: user.fullName || "",
    });
  }, [user, createUser]);

  if (!user) {
    return <main className="p-10">Please sign in.</main>;
  }

  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      <div className="border rounded-xl p-6">
        <p>
          <strong>Name:</strong> {currentUser?.name}
        </p>

        <p className="mt-2">
          <strong>Email:</strong> {currentUser?.email}
        </p>

        <p className="mt-2">
          <strong>Role:</strong> {currentUser?.role}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/dashboard/organizations"
            className="border px-5 py-3 rounded-lg hover:bg-gray-100"
          >
            Manage Organizations
          </a>

          <a
            href="/vendors"
            className="border px-5 py-3 rounded-lg hover:bg-gray-100"
          >
            Vendor Portal
          </a>

          <a
            href="/operator"
            className="border px-5 py-3 rounded-lg hover:bg-gray-100"
          >
            Operator Console
          </a>

          <a
            href="/onboarding/storefront"
            className="border px-5 py-3 rounded-lg hover:bg-gray-100"
          >
            Generate Storefront
          </a>
        </div>
      </div>
    </main>
  );
}
