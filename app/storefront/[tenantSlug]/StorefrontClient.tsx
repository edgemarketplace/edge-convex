"use client";

import { Render } from "@puckeditor/core";
import type { JSX } from "react";
import { puckConfig } from "@/lib/puck/components";
import { toPuckEditorData } from "@/lib/puck/data";

type StorefrontClientData = {
  tenant: {
    _id: string;
    businessName: string;
    slug: string;
    vertical: string;
    variationMode: string;
    status: string;
  };
  storefront: {
    blueprintVersion: string;
    publishedPuckData: unknown;
    publishedVersion: number | null;
    lastPublishedAt: number | null;
    themeTokens: unknown;
    medusaCollectionId: string | null;
  };
};

const TypedRender = Render as unknown as (args: {
  config: unknown;
  data: unknown;
}) => JSX.Element;

export default function StorefrontClient({ data }: { data: StorefrontClientData }) {
  const publishedData = data.storefront.publishedPuckData;

  if (!Array.isArray(publishedData) || publishedData.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">Unpublished storefront</p>
          <h1 className="mt-3 text-3xl font-semibold text-gray-950">{data.tenant.businessName} is not live yet</h1>
          <p className="mt-3 text-sm text-gray-600">Publish the current draft from the storefront editor to render the public experience here.</p>
        </div>
      </div>
    );
  }

  const renderData = toPuckEditorData(publishedData);

  return (
    <div className="min-h-screen bg-white">
      {TypedRender({ config: puckConfig, data: renderData })}
    </div>
  );
}
