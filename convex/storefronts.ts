import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { compileStorefrontBlueprint } from "../lib/blueprints/compiler";
import { BLUEPRINT_VERSION } from "../lib/blueprints/registry";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export const createStorefrontFromBlueprint = mutation({
  args: {
    ownerUserId: v.id("users"),
    businessName: v.string(),
    vertical: v.string(),
    variationMode: v.string(),
    primaryGoal: v.optional(v.string()),
    offeringType: v.optional(
      v.union(v.literal("products"), v.literal("services"), v.literal("bookings"), v.literal("content"))
    ),
  },
  handler: async (ctx, args) => {
    const baseSlug = slugify(args.businessName);
    const existingWithSlug = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", baseSlug))
      .first();

    const tenantSlug = existingWithSlug ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

    const tenantId = await ctx.db.insert("tenants", {
      ownerUserId: args.ownerUserId,
      businessName: args.businessName,
      slug: tenantSlug,
      vertical: args.vertical,
      variationMode: args.variationMode,
      status: "draft",
      createdAt: Date.now(),
    });

    const puckData = compileStorefrontBlueprint({
      vertical: args.vertical as "retail",
      variation: args.variationMode as
        | "seller"
        | "pro"
        | "storyteller"
        | "minimalist"
        | "converter"
        | "local",
      metadata: {
        businessName: args.businessName,
        primaryGoal: args.primaryGoal,
        offeringType: args.offeringType,
      },
    });

    const storefrontId = await ctx.db.insert("storefronts", {
      tenantId,
      blueprintVersion: BLUEPRINT_VERSION,
      puckData,
      themeTokens: {
        primary: "#111827",
        accent: "#4f46e5",
        neutral: "#6b7280",
        surface: "#ffffff",
        text: "#111827",
      },
      draftVersion: 1,
      publishedVersion: 0,
      draftPuckData: puckData,
      publishedPuckData: undefined,
      lastPublishedAt: undefined,
      publishedBy: undefined,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    });

    return { tenantId, storefrontId, tenantSlug };
  },
});

export const getStorefrontByTenantSlug = query({
  args: { tenantSlug: v.string() },
  handler: async (ctx, args) => {
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", args.tenantSlug))
      .unique();

    if (!tenant) return null;

    const storefront = await ctx.db
      .query("storefronts")
      .withIndex("by_tenantId", (q) => q.eq("tenantId", tenant._id))
      .unique();

    if (!storefront) return null;

    return {
      tenant,
      storefront,
      renderData: storefront.publishedPuckData ?? storefront.draftPuckData,
      isPublished: storefront.publishedVersion > 0,
    };
  },
});

export const updateDraftPuckData = mutation({
  args: {
    storefrontId: v.id("storefronts"),
    draftPuckData: v.any(),
  },
  handler: async (ctx, args) => {
    const storefront = await ctx.db.get(args.storefrontId);
    if (!storefront) {
      throw new Error("Storefront not found");
    }

    await ctx.db.patch(args.storefrontId, {
      draftPuckData: args.draftPuckData,
      puckData: args.draftPuckData,
      draftVersion: storefront.draftVersion + 1,
      updatedAt: Date.now(),
    });

    return { ok: true };
  },
});

export const publishStorefront = mutation({
  args: {
    storefrontId: v.id("storefronts"),
    publishedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const storefront = await ctx.db.get(args.storefrontId);
    if (!storefront) {
      throw new Error("Storefront not found");
    }

    await ctx.db.patch(args.storefrontId, {
      publishedPuckData: storefront.draftPuckData,
      publishedVersion: storefront.publishedVersion + 1,
      lastPublishedAt: Date.now(),
      publishedBy: args.publishedBy,
      updatedAt: Date.now(),
    });

    return { ok: true };
  },
});
