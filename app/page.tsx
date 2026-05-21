import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-10 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-indigo-300 font-medium tracking-wide uppercase mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Platform v2.0 Live
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40">
          Edge <span className="text-indigo-500">Marketplace</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl font-light leading-relaxed">
          The autonomous, multi-tenant commerce operating system. Generative storefronts backed by Medusa logic.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 w-full">
          <Link
            href="/onboarding/storefront"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-full hover:bg-indigo-700 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:-translate-y-0.5"
          >
            Create Storefront
            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
          </Link>

          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 backdrop-blur-md"
          >
            Explore Markets
          </Link>
        </div>

        <Show when="signed-out">
          <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-gray-400 text-sm">Operator access</span>
            <SignInButton mode="modal">
              <button className="text-sm font-medium hover:text-indigo-400 transition-colors">Log in</button>
            </SignInButton>
            <div className="w-px h-4 bg-white/20" />
            <SignUpButton mode="modal">
              <button className="text-sm font-medium hover:text-indigo-400 transition-colors">Sign up</button>
            </SignUpButton>
          </div>
        </Show>

        <Show when="signed-in">
          <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl">
            <div className="px-4">
              <UserButton />
            </div>
            
            <div className="w-px h-6 bg-white/20" />

            <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            
            <Link href="/vendors" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Vendor Portal
            </Link>
            
            <Link href="/rfqs" className="px-4 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Manage RFQs
            </Link>
          </div>
        </Show>
      </div>
    </main>
  );
}
