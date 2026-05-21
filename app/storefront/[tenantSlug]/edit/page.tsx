"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import "@puckeditor/core/puck.css";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Puck } from "@puckeditor/core";
import { api } from "../../../../convex/_generated/api";
import { storefrontPuckConfig } from "@/components/storefront/StorefrontRenderer";

type StorefrontDraftData = {
  root?: { props?: Record<string, unknown> };
  content?: Array<{ type: string; props: Record<string, unknown> }>;
};

export default function StorefrontDraftEditorPage() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params.tenantSlug as string;

  const storefrontApi = (api as any).storefronts;
  const data = useQuery(storefrontApi.getStorefrontByTenantSlug, { tenantSlug });
  const updateDraftPuckData = useMutation(storefrontApi.updateDraftPuckData);
  const publishStorefront = useMutation(storefrontApi.publishStorefront);

  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const latestDraftRef = useRef<StorefrontDraftData | null>(null);

  const storefrontId = data?.storefront?._id;
  const defaultPublisherUserId = data?.tenant?.ownerUserId;

  async function handleSaveDraft(nextData: StorefrontDraftData) {
    if (!storefrontId) return;
    setBusy(true);
    setStatus(null);
    try {
      latestDraftRef.current = nextData;
      await updateDraftPuckData({ storefrontId, draftPuckData: nextData });
      setStatus("Draft saved.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to save draft.");
    } finally {
      setBusy(false);
    }
  }

  async function handlePublishLive() {
    if (!storefrontId || !defaultPublisherUserId) return;
    setBusy(true);
    setStatus(null);
    try {
      const latestDraft = latestDraftRef.current ?? (data?.storefront?.draftPuckData as StorefrontDraftData | undefined);
      if (latestDraft) {
        await updateDraftPuckData({ storefrontId, draftPuckData: latestDraft });
      }
      await publishStorefront({ storefrontId, publishedBy: defaultPublisherUserId });
      setStatus("Published.");
      router.push(`/storefront/${tenantSlug}`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to publish.");
    } finally {
      setBusy(false);
    }
  }

  if (data === undefined) return <main className="p-10">Loading editor...</main>;
  if (!data) return <main className="p-10">Storefront not found.</main>;

  const initialData = (data.storefront.draftPuckData ?? {}) as StorefrontDraftData;
  if (latestDraftRef.current == null) {
    latestDraftRef.current = initialData;
  }

  return (
    <main className="max-w-[1400px] mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Storefront Editor</h1>
          <p className="text-gray-600 text-sm">Tenant: {tenantSlug}</p>
        </div>
        <div className="flex items-center gap-2">
          {status ? <p className="text-sm text-gray-700">{status}</p> : null}
          <button
            type="button"
            className="border px-4 py-2 rounded-lg disabled:opacity-50"
            disabled={busy}
            onClick={handlePublishLive}
          >
            Publish Live
          </button>
        </div>
      </div>

      <Puck
        key={`${tenantSlug}:${data.storefront.draftVersion}`}
        config={storefrontPuckConfig}
        data={initialData as any}
        onChange={(nextData) => {
          latestDraftRef.current = nextData as StorefrontDraftData;
        }}
        onPublish={(nextData) => {
          void handleSaveDraft(nextData as StorefrontDraftData);
        }}
      />
    </main>
  );
}
