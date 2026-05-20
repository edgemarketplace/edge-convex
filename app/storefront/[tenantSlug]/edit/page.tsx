"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

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
  const draftRef = useRef<HTMLTextAreaElement | null>(null);

  const storefrontId = data?.storefront?._id;
  const defaultPublisherUserId = data?.tenant?.ownerUserId;

  function parseDraftFromTextarea() {
    const raw = draftRef.current?.value ?? "{}";
    return JSON.parse(raw);
  }

  async function handleSaveDraft() {
    if (!storefrontId) return;
    setBusy(true);
    setStatus(null);
    try {
      const parsed = parseDraftFromTextarea();
      await updateDraftPuckData({ storefrontId, draftPuckData: parsed });
      setStatus("Draft saved.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to save draft.");
    } finally {
      setBusy(false);
    }
  }

  async function handlePublish() {
    if (!storefrontId || !defaultPublisherUserId) return;
    setBusy(true);
    setStatus(null);
    try {
      const parsed = parseDraftFromTextarea();
      await updateDraftPuckData({ storefrontId, draftPuckData: parsed });
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

  const defaultDraft = JSON.stringify(data.storefront.draftPuckData ?? {}, null, 2);

  return (
    <main className="max-w-5xl mx-auto p-8 space-y-4">
      <h1 className="text-3xl font-bold">Draft Storefront Editor</h1>
      <p className="text-gray-600">Tenant: {tenantSlug}</p>

      <textarea
        ref={draftRef}
        className="w-full h-[520px] border rounded-lg p-4 font-mono text-sm"
        defaultValue={defaultDraft}
      />

      {status ? <p className="text-sm text-gray-700">{status}</p> : null}

      <div className="flex gap-3">
        <button
          type="button"
          className="bg-black text-white px-5 py-2 rounded-lg disabled:opacity-50"
          disabled={busy}
          onClick={handleSaveDraft}
        >
          Save Draft
        </button>
        <button
          type="button"
          className="border px-5 py-2 rounded-lg disabled:opacity-50"
          disabled={busy}
          onClick={handlePublish}
        >
          Publish
        </button>
      </div>
    </main>
  );
}
