"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import type { PrimaryGoal, VariationMode, Vertical } from "@/lib/blueprints/registry";

type OnboardingStep = 1 | 2 | 3;

const verticalOptions: Array<{ value: Vertical; label: string; description: string }> = [
  { value: "retail", label: "Retail", description: "Merchandise, catalogs, and direct commerce." },
  { value: "services", label: "Services", description: "Consulting, B2B offers, and procurement." },
  { value: "content", label: "Content", description: "Publishing-led storefronts and media catalogs." },
];

const primaryGoalOptions: Array<{ value: PrimaryGoal; label: string }> = [
  { value: "products", label: "Products" },
  { value: "services", label: "Services" },
  { value: "bookings", label: "Bookings" },
  { value: "content", label: "Content" },
];

const variationOptions: Array<{ value: VariationMode; label: string; description: string }> = [
  { value: "seller", label: "Seller", description: "Strong hero, featured products, trust, FAQ, contact." },
  { value: "pro", label: "Pro", description: "More commerce-heavy layout for catalog-first storefronts." },
  { value: "storyteller", label: "Storyteller", description: "More narrative content before the transaction layer." },
  { value: "minimalist", label: "Minimalist", description: "Smallest useful launch footprint." },
  { value: "converter", label: "Converter", description: "Push visitors toward a clear commercial next step." },
  { value: "local", label: "Local", description: "Best for geo-aware, operator-supported businesses." },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function StorefrontOnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [businessName, setBusinessName] = useState("");
  const [vertical, setVertical] = useState<Vertical>("retail");
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal>("products");
  const [variationMode, setVariationMode] = useState<VariationMode>("seller");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { user } = useUser();
  const createStorefront = useAction(api.storefronts.createStorefrontFromBlueprint);

  async function handleGenerate() {
    if (!user) {
      setError("You must be signed in to generate a storefront.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createStorefront({
        businessName,
        slug: slugify(businessName),
        vertical,
        variationMode,
        metadata: {
          primaryGoal,
          description,
        },
      });

      router.push(`/storefront/editor/${result.tenantId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate storefront.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Storefront onboarding</p>
        <h1 className="mt-2 text-4xl font-semibold text-gray-950">Generate a multi-tenant storefront draft</h1>
        <p className="mt-3 text-lg text-gray-600">
          Start with deterministic blueprint compilation. Layer commerce and fulfillment behind it later.
        </p>
      </div>

      {error ? <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="mb-8 flex gap-3 text-sm text-gray-500">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className={`rounded-full px-3 py-1 ${step === index ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}
          >
            Step {index}
          </div>
        ))}
      </div>

      {step === 1 ? (
        <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div>
            <label htmlFor="business-name" className="mb-2 block text-sm font-medium text-gray-700">Business name</label>
            <input
              id="business-name"
              name="businessName"
              autoComplete="organization"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3"
              placeholder="Edge Procurement Supply"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">Positioning</label>
            <textarea
              id="description"
              name="description"
              autoComplete="off"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-28 w-full rounded-2xl border border-gray-300 px-4 py-3"
              placeholder="What do you sell, and why should buyers trust this storefront?"
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-gray-700">Vertical</p>
            <div className="grid gap-3 md:grid-cols-3">
              {verticalOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setVertical(option.value)}
                  className={`rounded-2xl border p-4 text-left ${vertical === option.value ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"}`}
                >
                  <div className="font-medium text-gray-950">{option.label}</div>
                  <div className="mt-2 text-sm text-gray-600">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="primary-goal" className="mb-2 block text-sm font-medium text-gray-700">Primary goal</label>
            <select
              id="primary-goal"
              name="primaryGoal"
              autoComplete="off"
              value={primaryGoal}
              onChange={(event) => setPrimaryGoal(event.target.value as PrimaryGoal)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3"
            >
              {primaryGoalOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!businessName.trim()) {
                setError("Business name is required.");
                return;
              }
              setError("");
              setStep(2);
            }}
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold text-gray-950">Choose a variation mode</h2>
            <p className="mt-2 text-sm text-gray-600">These are deterministic layout patterns, not AI-generated randomness.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {variationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setVariationMode(option.value)}
                className={`rounded-2xl border p-4 text-left ${variationMode === option.value ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"}`}
              >
                <div className="font-medium capitalize text-gray-950">{option.label}</div>
                <div className="mt-2 text-sm text-gray-600">{option.description}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="rounded-full border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Back</button>
            <button type="button" onClick={() => setStep(3)} className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Review</button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold text-gray-950">Generate the draft storefront</h2>
            <p className="mt-2 text-sm text-gray-600">This creates the tenant, compiles the blueprint, and saves draft Puck data in Convex.</p>
          </div>

          <dl className="grid gap-4 rounded-2xl bg-gray-50 p-6 md:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Business</dt>
              <dd className="mt-1 text-sm text-gray-900">{businessName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Vertical</dt>
              <dd className="mt-1 text-sm text-gray-900">{vertical}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Goal</dt>
              <dd className="mt-1 text-sm text-gray-900">{primaryGoal}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Variation</dt>
              <dd className="mt-1 text-sm text-gray-900">{variationMode}</dd>
            </div>
          </dl>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="rounded-full border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Back</button>
            <button type="button" disabled={loading} onClick={() => void handleGenerate()} className="rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Generating..." : "Generate storefront"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
