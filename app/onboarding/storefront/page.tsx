"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function StorefrontOnboarding() {
  const router = useRouter();
  
  const createStorefront = useMutation(api.storefronts.createStorefrontFromBlueprint);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    vertical: "retail",
    primaryGoal: "products",
    variationMode: "seller",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const tenantSlug = await createStorefront(formData);
      router.push(`/storefront/${tenantSlug}/editor`);
      
      console.log("Storefront generated:", tenantSlug);
    } catch (error: any) {
      console.error(error);
      setIsGenerating(false);
      alert(`Failed to generate storefront: ${error.message || error}`);
    }
  };

  const onboardingForm = (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {step === 1 ? "Tell us about your business" : "Choose your style"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Step {step} of 2
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label htmlFor="vertical" className="block text-sm font-medium text-gray-700">
                Business Type (Vertical)
              </label>
              <select
                id="vertical"
                value={formData.vertical}
                onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              >
                <option value="retail">Retail</option>
                <option value="service">Service</option>
                <option value="content">Content</option>
              </select>
            </div>

            <div>
              <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-700">
                Primary Goal
              </label>
              <select
                id="primaryGoal"
                value={formData.primaryGoal}
                onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              >
                <option value="products">Selling Products</option>
                <option value="services">Selling Services</option>
                <option value="bookings">Bookings/Appointments</option>
                <option value="content">Publishing Content</option>
              </select>
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.businessName}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-50"
            >
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="variationMode" className="block text-sm font-medium text-gray-700 mb-2">
                Variation Mode (Layout Style)
              </label>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {["seller", "pro", "storyteller", "minimalist", "converter", "local"].map((mode) => (
                  <div
                    key={mode}
                    onClick={() => setFormData({ ...formData, variationMode: mode })}
                    className={`cursor-pointer border rounded-lg p-4 text-center transition-all ${
                      formData.variationMode === mode
                        ? "border-black ring-1 ring-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="capitalize font-medium text-gray-900">{mode}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="w-1/3 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-2/3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Generate Storefront"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <SignedIn>
        {onboardingForm}
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center max-w-md w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-8">You must be logged in to generate a storefront and associate it with your account.</p>
            <SignInButton mode="modal">
              <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800">
                Log in to continue
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </>
  );
}
