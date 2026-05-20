"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const variations = ["seller", "pro", "storyteller", "minimalist", "converter", "local"] as const;

export default function StorefrontOnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [vertical, setVertical] = useState("retail");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [offeringType, setOfferingType] = useState<"products" | "services" | "bookings" | "content">("products");
  const [variationMode, setVariationMode] = useState<(typeof variations)[number]>("seller");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = useQuery(api.users.currentUser, user ? { clerkId: user.id } : "skip");
  const storefrontApi = (api as any).storefronts;
  const createStorefrontFromBlueprint = useMutation(storefrontApi.createStorefrontFromBlueprint);
  const publishStorefront = useMutation(storefrontApi.publishStorefront);

  async function handleGenerate() {
    if (!currentUser || !businessName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await createStorefrontFromBlueprint({
        ownerUserId: currentUser._id,
        businessName: businessName.trim(),
        vertical,
        variationMode,
        primaryGoal: primaryGoal.trim() || undefined,
        offeringType,
      });

      await publishStorefront({
        storefrontId: result.storefrontId,
        publishedBy: currentUser._id,
      });

      router.push(`/storefront/${result.tenantSlug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate storefront");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return <main className="p-10">Please sign in.</main>;
  }

  return (
    <main className="max-w-3xl mx-auto p-10 space-y-8">
      <h1 className="text-3xl font-bold">Storefront Onboarding</h1>

      <section className="border rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Step 1</h2>
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Business vertical"
          value={vertical}
          onChange={(e) => setVertical(e.target.value)}
        />
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Primary goal"
          value={primaryGoal}
          onChange={(e) => setPrimaryGoal(e.target.value)}
        />
        <select
          className="w-full border rounded-lg p-3"
          value={offeringType}
          onChange={(e) => setOfferingType(e.target.value as "products" | "services" | "bookings" | "content")}
        >
          <option value="products">Products</option>
          <option value="services">Services</option>
          <option value="bookings">Bookings</option>
          <option value="content">Content</option>
        </select>
      </section>

      <section className="border rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Step 2: Variation mode</h2>
        <div className="grid grid-cols-2 gap-3">
          {variations.map((v) => (
            <button
              key={v}
              type="button"
              className={`border rounded-lg px-4 py-2 text-left ${variationMode === v ? "bg-black text-white" : ""}`}
              onClick={() => setVariationMode(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </section>

      <section className="border rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-semibold">Step 3: Generate storefront</h2>
        <button
          type="button"
          className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
          disabled={submitting || !currentUser || !businessName.trim()}
          onClick={handleGenerate}
        >
          {submitting ? "Generating..." : "Generate storefront"}
        </button>
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      </section>
    </main>
  );
}
