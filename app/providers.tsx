"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";

const convex = new ConvexReactClient(
  // Force connecting to the prod deployment because Vercel preview environments lack the deploy key
  "https://academic-gopher-873.convex.cloud"
);

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
