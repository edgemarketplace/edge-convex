"use client";

import { useEffect, useState } from "react";
import type { JSX } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Puck } from "@puckeditor/core";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { puckConfig } from "@/lib/puck/components";
import { toPuckEditorData } from "@/lib/puck/data";
import type { StorefrontEditorData } from "@/lib/puck/types";

const TypedPuck = Puck as unknown as (props: {
  config: unknown;
  data: unknown;
  onChange: (data: StorefrontEditorData) => void | Promise<void>;
}) => JSX.Element;

function patchEditorFormFieldAttributes() {
  const fields = document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    "input, select, textarea",
  );

  fields.forEach((field, index) => {
    const label = field.getAttribute("title") || field.getAttribute("aria-label") || field.getAttribute("placeholder");
    const generatedName = label
      ? label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      : `editor-field-${index}`;

    if (!field.id) field.id = generatedName;
    if (!field.name) field.name = generatedName;
    if (!field.autocomplete) field.autocomplete = "off";
  });
}

export default function StorefrontEditorPage() {
  const params = useParams<{ tenantId: string }>();
  const tenantId = params.tenantId as Id<"tenants">;

  const storefrontData = useQuery(api.storefronts.getStorefrontByTenantId, { tenantId });
  const updateDraftPuckData = useMutation(api.storefronts.updateDraftPuckData);
  const publishStorefront = useMutation(api.storefronts.publishStorefront);

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  useEffect(() => {
    patchEditorFormFieldAttributes();

    const observer = new MutationObserver(() => {
      patchEditorFormFieldAttributes();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  async function handleChange(data: StorefrontEditorData) {
    setSaving(true);
    setPublishMessage(null);

    try {
      await updateDraftPuckData({
        tenantId,
        puckData: data.content,
      });
      setLastSavedAt(new Date());
    } catch (error) {
      console.error("Failed to save draft storefront", error);
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    setPublishMessage(null);

    try {
      const version = await publishStorefront({ tenantId });
      setPublishMessage(`Published v${version}`);
    } catch (error) {
      setPublishMessage(error instanceof Error ? error.message : "Failed to publish storefront.");
    } finally {
      setPublishing(false);
    }
  }

  if (storefrontData === undefined) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Loading storefront editor...</div>;
  }

  if (storefrontData === null) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-950">Storefront not found</h1>
          <p className="mt-3 text-sm text-gray-600">Generate a tenant storefront first, then return to the editor.</p>
          <a href="/onboarding/storefront" className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Create storefront</a>
        </div>
      </div>
    );
  }

  const initialData = toPuckEditorData(storefrontData.storefront.draftPuckData);

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-sm font-semibold text-gray-950">{storefrontData.tenant.businessName}</div>
            <div className="text-xs text-gray-500">Draft v{storefrontData.storefront.draftVersion}</div>
          </div>
          {saving ? <span className="text-xs text-amber-600">Saving...</span> : null}
          {!saving && lastSavedAt ? <span className="text-xs text-emerald-600">Saved {lastSavedAt.toLocaleTimeString()}</span> : null}
          {publishMessage ? <span className="text-xs text-blue-700">{publishMessage}</span> : null}
        </div>

        <div className="flex items-center gap-3">
          <a href={`/storefront/${storefrontData.tenant.slug}`} target="_blank" className="text-xs font-medium text-gray-600 underline hover:text-gray-900">View live storefront</a>
          <button
            type="button"
            onClick={() => void handlePublish()}
            disabled={publishing}
            className="rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {publishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {TypedPuck({ config: puckConfig, data: initialData, onChange: handleChange })}
      </div>
    </div>
  );
}
