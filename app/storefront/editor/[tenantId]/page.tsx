"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Puck } from "@puckeditor/core";
import { puckConfig } from "@/lib/puck/components";
import type { Data } from "@puckeditor/core";
import type { Id } from "@/convex/_generated/dataModel";
import type { PuckComponentName, PuckComponentProps, StorefrontPuckData } from "@/lib/puck/types";

const componentNames: PuckComponentName[] = [
  "Header",
  "Footer",
  "HeroSection",
  "ProductGrid",
  "SocialProof",
  "AccordionFAQ",
  "ContactForm",
  "ContentBlock",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizePuckContent(rawPuckData: unknown): StorefrontPuckData {
  if (!Array.isArray(rawPuckData)) return [];

  return rawPuckData.flatMap((block, index) => {
    if (!isRecord(block) || typeof block.type !== "string") return [];
    if (!componentNames.includes(block.type as PuckComponentName)) return [];

    const props = isRecord(block.props) ? block.props : {};
    return [{
      type: block.type as PuckComponentName,
      props: {
        ...props,
        id: typeof props.id === "string" ? props.id : `${block.type}-${index}`,
      },
    }];
  }) as StorefrontPuckData;
}

export default function StorefrontEditorPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.tenantId as Id<"tenants">;

  const storefrontData = useQuery(api.storefronts.getStorefrontByTenantId, {
    tenantId,
  });
  const updateDraft = useMutation(api.storefronts.updateDraftPuckData);
  const publishStorefront = useMutation(api.storefronts.publishStorefront);

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const handleChange = async (data: Data<PuckComponentProps>) => {
    setSaving(true);
    try {
      // Puck sends full Data { root, content }; store only content array
      // to stay compatible with StorefrontClient.tsx renderer
      await updateDraft({ tenantId, puckData: data.content });
      setLastSavedAt(new Date());
    } catch (err) {
      console.error("Failed to save draft:", err);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await publishStorefront({ tenantId });
    } catch (err) {
      console.error("Failed to publish:", err);
    } finally {
      setPublishing(false);
    }
  };

  if (storefrontData === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    );
  }

  if (!storefrontData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Storefront Not Found</h1>
          <p className="text-gray-500 mb-4">
            Could not find a storefront for this tenant.
          </p>
          <button
            onClick={() => router.push("/onboarding/storefront")}
            className="text-blue-600 hover:underline"
          >
            Create a new storefront
          </button>
        </div>
      </div>
    );
  }

  const rawPuckData = storefrontData.storefront.puckData;
  const puckContent = normalizePuckContent(rawPuckData);

  const initialData: Data<PuckComponentProps> = {
    root: { props: {} },
    content: puckContent,
  };

  const tenant = storefrontData.tenant!;

  return (
    <div className="h-screen flex flex-col">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-gray-900">
            {tenant.businessName}
          </h1>
          <span className="text-xs text-gray-400">
            v{storefrontData.storefront.draftVersion || 0}
          </span>
          {saving && (
            <span className="text-xs text-yellow-600">Saving...</span>
          )}
          {!saving && lastSavedAt && (
            <span className="text-xs text-green-600">
              Saved {lastSavedAt.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/storefront/${tenant.slug}`}
            target="_blank"
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            View live
          </a>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {publishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Puck editor */}
      <div className="flex-1 overflow-hidden">
        <Puck
          config={puckConfig}
          data={initialData}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
