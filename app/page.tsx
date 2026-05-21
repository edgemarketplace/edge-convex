import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

const features = [
  {
    title: "Deterministic Storefront Builder",
    description:
      "Generate multi-tenant storefronts from blueprint variations using Convex + Puck.",
  },
  {
    title: "Medusa Commerce Backbone",
    description:
      "Products, variants, inventory, carts, and orders powered by Medusa integration.",
  },
  {
    title: "RFQ + Vendor Workflows",
    description:
      "Built-in procurement foundation with vendor onboarding, approvals, and RFQ response threads.",
  },
  {
    title: "Single Shared Runtime",
    description:
      "One Vercel app serves all tenant storefronts via slug/domain routing and Convex state.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide uppercase text-gray-500 mb-4">Edge Marketplace</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Multi-tenant commerce + procurement platform
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Launch AI-assisted storefronts with deterministic blueprints, then layer in full commerce and procurement workflows.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/onboarding/storefront" className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90">
              Start now
            </Link>
            <Link href="/marketplace" className="border px-6 py-3 rounded-lg hover:bg-gray-100">
              Explore marketplace
            </Link>
            <Link href="/rfqs" className="border px-6 py-3 rounded-lg hover:bg-gray-100">
              View RFQs
            </Link>
          </div>

          <Show when="signed-out">
            <div className="flex gap-3">
              <SignInButton mode="modal">
                <button className="border px-6 py-3 rounded-lg hover:bg-gray-100">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="border px-6 py-3 rounded-lg hover:bg-gray-100">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <div className="flex flex-wrap items-center gap-4">
              <UserButton />
              <Link href="/dashboard" className="border px-5 py-3 rounded-lg hover:bg-gray-100">
                Dashboard
              </Link>
              <Link href="/vendors" className="border px-5 py-3 rounded-lg hover:bg-gray-100">
                Vendor Portal
              </Link>
            </div>
          </Show>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-6">Platform features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <article key={feature.title} className="border rounded-2xl p-5">
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
