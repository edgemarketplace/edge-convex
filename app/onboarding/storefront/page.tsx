"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type OfferingType = "products" | "services" | "bookings" | "content";
type VariationMode = "seller" | "pro" | "storyteller" | "minimalist" | "converter" | "local";
type Vertical = "retail" | "fashion" | "food" | "wellness" | "services" | "education";
type PrimaryGoal = "sell_online" | "generate_leads" | "showcase_portfolio" | "book_appointments" | "build_brand";

const verticalOptions: Array<{ value: Vertical; label: string }> = [
  { value: "retail", label: "Retail" },
  { value: "fashion", label: "Fashion" },
  { value: "food", label: "Food & Beverage" },
  { value: "wellness", label: "Wellness" },
  { value: "services", label: "Professional Services" },
  { value: "education", label: "Education" },
];

const goalOptions: Array<{ value: PrimaryGoal; label: string }> = [
  { value: "sell_online", label: "Sell online" },
  { value: "generate_leads", label: "Generate leads" },
  { value: "showcase_portfolio", label: "Showcase portfolio" },
  { value: "book_appointments", label: "Book appointments" },
  { value: "build_brand", label: "Build brand" },
];

const offeringOptions: Array<{ value: OfferingType; label: string }> = [
  { value: "products", label: "Products" },
  { value: "services", label: "Services" },
  { value: "bookings", label: "Bookings" },
  { value: "content", label: "Content" },
];

const variationOptions: Array<{ mode: VariationMode; title: string; description: string }> = [
  {
    mode: "seller",
    title: "Seller",
    description: "Product-first layout for catalogs, pricing visibility, and direct conversion.",
  },
  {
    mode: "pro",
    title: "Pro",
    description: "Trust + offer depth for B2B/professional buyers who compare options carefully.",
  },
  {
    mode: "storyteller",
    title: "Storyteller",
    description: "Narrative-led experience highlighting brand story, mission, and social proof.",
  },
  {
    mode: "minimalist",
    title: "Minimalist",
    description: "Clean, lightweight layout with minimal sections for fast launch and clarity.",
  },
  {
    mode: "converter",
    title: "Converter",
    description: "CTA-heavy flow optimized for inquiries, quotes, and high-intent actions.",
  },
  {
    mode: "local",
    title: "Local",
    description: "Community-focused storefront for nearby discovery, contact, and location context.",
  },
];

export default function StorefrontOnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [businessName, setBusinessName] = useState("Edge Marketplace");
  const [vertical, setVertical] = useState<Vertical>("retail");
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal>("sell_online");
  const [offeringType, setOfferingType] = useState<OfferingType>("products");
  const [variationMode, setVariationMode] = useState<VariationMode>("seller");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = useQuery(api.users.currentUser, user ? { clerkId: user.id } : "skip");
  const storefrontApi = (api as { storefronts?: Record<string, unknown> }).storefronts as {
    createStorefrontFromBlueprint: typeof api.users.createUser;
    publishStorefront: typeof api.users.createUser;
  };
  const createStorefrontFromBlueprint = useMutation(storefrontApi.createStorefrontFromBlueprint as any);
  const publishStorefront = useMutation(storefrontApi.publishStorefront as any);

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
        primaryGoal,
        offeringType,
      });

      await publishStorefront({
        storefrontId: result.storefrontId,
        publishedBy: currentUser._id,
      });

      router.push(`/storefront/${result.tenantSlug}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to generate storefront";
      if (message.includes("Could not find public function for 'storefronts:createStorefrontFromBlueprint'")) {
        setError(
          "Storefront Convex functions are not deployed for this environment yet. Run `npx convex dev` (local) or `npx convex deploy` (production), then redeploy Next.js."
        );
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return <main className="p-10">Please sign in.</main>;
  }

  return (
    <main className="max-w-4xl mx-auto p-10 space-y-8">
      <h1 className="text-3xl font-bold">Storefront Onboarding</h1>

      <section className="border rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Step 1</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Business name</label>
          <input
            className="w-full border rounded-lg p-3"
            placeholder="Business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Business vertical</label>
            <select
              className="w-full border rounded-lg p-3"
              value={vertical}
              onChange={(e) => setVertical(e.target.value as Vertical)}
            >
              {verticalOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Primary goal</label>
            <select
              className="w-full border rounded-lg p-3"
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value as PrimaryGoal)}
            >
              {goalOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">What are you offering?</label>
          <select
            className="w-full border rounded-lg p-3"
            value={offeringType}
            onChange={(e) => setOfferingType(e.target.value as OfferingType)}
          >
            {offeringOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="border rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Step 2: Variation mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {variationOptions.map((variation) => (
            <button
              key={variation.mode}
              type="button"
              className={`border rounded-xl px-4 py-3 text-left transition ${
                variationMode === variation.mode ? "bg-black text-white border-black" : "bg-white"
              }`}
              onClick={() => setVariationMode(variation.mode)}
            >
              <p className="font-semibold">{variation.title}</p>
              <p className={`text-sm mt-1 ${variationMode === variation.mode ? "text-gray-200" : "text-gray-600"}`}>
                {variation.description}
              </p>
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
        {error ? <p className="text-red-600 text-sm whitespace-pre-wrap">{error}</p> : null}
      </section>
    </main>
  );
}
