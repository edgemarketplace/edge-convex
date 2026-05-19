import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10">
      <h1 className="text-5xl font-bold mb-6">
        Edge Marketplace
      </h1>

      <p className="text-gray-600 mb-10 text-center max-w-xl">
        AI-powered procurement and multi-tenant commerce platform.
      </p>

      <Show when="signed-out">
        <div className="flex gap-3">
          <SignInButton mode="modal">
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90">
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
        <div className="flex items-center gap-4">
          <UserButton />

          <a
            href="/dashboard"
            className="border px-5 py-3 rounded-lg hover:bg-gray-100"
          >
            Dashboard
          </a>

          <a
            href="/vendors"
            className="border px-5 py-3 rounded-lg hover:bg-gray-100"
          >
            Vendor Portal
          </a>
        </div>
      </Show>
    </main>
  );
}
