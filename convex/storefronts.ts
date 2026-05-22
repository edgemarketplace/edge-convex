import { query, mutation, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { compileStorefrontBlueprint } from "../lib/blueprints/compiler";
import { BusinessMetadata } from "../lib/blueprints/registry";

// ========== Queries ==========

export const getStorefrontByTenantId = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    const storefront = await ctx.db
      .query("storefronts")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .unique();
    if (!storefront) return null;
    
    const tenant = await ctx.db.get(storefront.tenantId);
    
    return {
      tenant,
      storefront,
    };
  },
});

export const getStorefrontByTenantSlug = query({
  args: { tenantSlug: v.string() },
  handler: async (ctx, args) => {
    // Lookup tenant by slug
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", args.tenantSlug))
      .unique();
    if (!tenant) return null;

    // Lookup storefront by tenantId
    const storefront = await ctx.db
      .query("storefronts")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenant._id))
      .unique();
    if (!storefront) return null;

    return { tenant, storefront };
  },
});

// ========== Mutations ==========

export const updateDraftPuckData = mutation({
  args: {
    tenantId: v.id("tenants"),
    puckData: v.any(),
  },
  handler: async (ctx, args) => {
    const storefront = await ctx.db
      .query("storefronts")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .unique();
    if (!storefront) throw new Error("Storefront not found for tenant");

    const newDraftVersion = (storefront.draftVersion || 0) + 1;
    await ctx.db.patch(storefront._id, {
      puckData: args.puckData,
      draftVersion: newDraftVersion,
    });
    return newDraftVersion;
  },
});

export const publishStorefront = mutation({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    const storefront = await ctx.db
      .query("storefronts")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .unique();
    if (!storefront) throw new Error("Storefront not found for tenant");
    if (!storefront.puckData) throw new Error("No draft puckData to publish");

    const newPublishedVersion = (storefront.publishedVersion || 0) + 1;
    await ctx.db.patch(storefront._id, {
      publishedVersion: newPublishedVersion,
      // Copy draft puckData to published version
      puckData: storefront.puckData,
    });
    return newPublishedVersion;
  },
});

// ========== Internal Mutations ==========

export const createTenant = internalMutation({
  args: {
    ownerUserId: v.id("users"),
    businessName: v.string(),
    slug: v.string(),
    vertical: v.string(),
    variationMode: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("tenants", {
      ownerUserId: args.ownerUserId,
      businessName: args.businessName,
      slug: args.slug,
      vertical: args.vertical,
      variationMode: args.variationMode,
      status: "active",
      createdAt: now,
    });
  },
});

export const createStorefront = internalMutation({
  args: {
    tenantId: v.id("tenants"),
    blueprintVersion: v.string(),
    puckData: v.any(),
    themeTokens: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("storefronts", {
      tenantId: args.tenantId,
      blueprintVersion: args.blueprintVersion,
      puckData: args.puckData,
      themeTokens: args.themeTokens || {},
      draftVersion: 1,
      publishedVersion: undefined,
    });
  },
});

// ========== Actions ==========

export const createStorefrontFromBlueprint = action({
  args: {
    ownerUserId: v.id("users"),
    businessName: v.string(),
    slug: v.string(),
    vertical: v.string(),
    variationMode: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // 1. Create tenant
    const tenantId = await ctx.runMutation(internal.storefronts.createTenant, {
      ownerUserId: args.ownerUserId,
      businessName: args.businessName,
      slug: args.slug,
      vertical: args.vertical,
      variationMode: args.variationMode,
    }) as Id<"tenants">;

    // 2. Compile blueprint
    const businessMetadata: BusinessMetadata = {
      businessName: args.businessName,
      vertical: args.vertical,
      variationMode: args.variationMode,
    };
    const puckData = compileStorefrontBlueprint({
      vertical: args.vertical as any,
      variation: args.variationMode,
      metadata: businessMetadata,
    });

    // 3. Create storefront with compiled puckData
    const storefrontId = await ctx.runMutation(internal.storefronts.createStorefront, {
      tenantId,
      blueprintVersion: `${args.vertical}-${args.variationMode}-1.0`,
      puckData,
      themeTokens: { primaryColor: "#000000", secondaryColor: "#ffffff" },
    }) as Id<"storefronts">;

    return { tenantId, storefrontId };
  },
});
