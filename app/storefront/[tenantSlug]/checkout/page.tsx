"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.tenantSlug as string;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate Medusa cart conversion & Stripe init
    setTimeout(() => {
      setLoading(false);
      alert("MVP Checkout complete!\n\nIn Phase 6, this will pass the Medusa Cart ID to Stripe Connect for multi-tenant payment splits.");
      router.push(`/storefront/${slug}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-black p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Secure Checkout</h1>
          <p className="text-sm opacity-80 mt-1">{slug}</p>
        </div>

        <form onSubmit={handleCheckout} className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Contact Information</h2>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input 
                id="email"
                name="email"
                autoComplete="email"
                type="email" 
                required 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Shipping Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First Name</label>
                <input id="first-name" name="firstName" autoComplete="given-name" type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input id="last-name" name="lastName" autoComplete="family-name" type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
              </div>
              <div className="col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input id="address" name="address" autoComplete="street-address" type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input id="city" name="city" autoComplete="address-level2" type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                <input id="zip" name="postalCode" autoComplete="postal-code" type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
              </div>
            </div>
          </div>

          <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information (Stripe)</h2>
            <p className="text-sm text-gray-500 mb-4">
              Stripe Elements will mount here in Phase 6. For now, click Complete to simulate the flow.
            </p>
            <div className="h-12 bg-white border border-gray-300 rounded-md flex items-center px-4 text-gray-400">
              Card number, expiration, CVC
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {loading ? "Processing..." : "Complete Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
