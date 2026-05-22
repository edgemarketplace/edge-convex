"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

type OnboardingStep = 1 | 2 | 3;

export default function StorefrontOnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [businessName, setBusinessName] = useState("");
  const [vertical, setVertical] = useState("retail");
  const [primaryGoal, setPrimaryGoal] = useState("products");
  const [variationMode, setVariationMode] = useState("seller");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useUser();
  const router = useRouter();
  const createStorefront = useAction(api.storefronts.createStorefrontFromBlueprint);

  const handleStep1Next = () => {
    if (!businessName.trim()) {
      setError("Business name is required");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleStep2Next = () => {
    setError("");
    setStep(3);
  };

  const handleGenerate = async () => {
    if (!user) {
      setError("You must be logged in");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await createStorefront({
        ownerUserId: user.id,
        businessName,
        slug: businessName.toLowerCase().replace(/\s+/g, "-"),
        vertical,
        variationMode,
        metadata: { primaryGoal },
      });
      router.push(`/storefront/editor/${result.tenantId}`);
    } catch (err: any) {
      setError(err.message || "Failed to generate storefront");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Your Storefront</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {/* Step 1: Business Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 1: Business Details</h2>
          <div>
            <label className="block mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Acme Retail"
            />
          </div>
          <div>
            <label className="block mb-1">Vertical</label>
            <select
              value={vertical}
              onChange={(e) => setVertical(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="retail">Retail</option>
              <option value="pro">Professional Services</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Primary Goal</label>
            <select
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="products">Sell Products</option>
              <option value="services">Offer Services</option>
              <option value="bookings">Take Bookings</option>
              <option value="content">Share Content</option>
            </select>
          </div>
          <button
            onClick={handleStep1Next}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Variation Mode */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 2: Choose Layout Style</h2>
          <div className="grid grid-cols-2 gap-4">
            {["seller", "pro", "storyteller", "minimalist", "converter", "local"].map((mode) => (
              <button
                key={mode}
                onClick={() => setVariationMode(mode)}
                className={`p-4 border rounded capitalize ${
                  variationMode === mode ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="border px-4 py-2 rounded hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleStep2Next}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Generate */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 3: Generate Storefront</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p><strong>Business Name:</strong> {businessName}</p>
            <p><strong>Vertical:</strong> {vertical}</p>
            <p><strong>Primary Goal:</strong> {primaryGoal}</p>
            <p><strong>Layout Style:</strong> {variationMode}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="border px-4 py-2 rounded hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Storefront"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
