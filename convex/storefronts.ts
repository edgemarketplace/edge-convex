import { action, internalMutation, mutation, query } from "./_generated/server";
import type { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";
import {
  compileStorefrontBlueprint,
  defaultTenantSlug,
} from "../lib/blueprints/compiler";
import {
  blueprints,
  type BusinessMetadata,
  type VariationMode,
  type Vertical,
} from "../lib/blueprints/registry";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function requireViewerUserId(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity?.subject) {
    throw new Error("Unauthorized");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!user) {
    throw new Error("Authenticated user is not synced in Convex");
  }

  return user._id;
}

async function requireViewerClerkId(ctx: ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity?.subject) {
    throw new Error("Unauthorized");
  }

  return identity.subject;
}

function assertTenantOwner(tenantOwnerUserId: Id<"users">, viewerUserId: Id<"users">) {
  if (tenantOwnerUserId !== viewerUserId) {
    throw new Error("Unauthorized");
  }
}

function normalizeMetadata(args: {
  businessName: string;
  vertical: string;
  variationMode: string;
  metadata?: Record<string, unknown> | null;
}): BusinessMetadata {
  const vertical = (args.vertical in blueprints ? args.vertical : "retail") as Vertical;
  const variation =
    args.variationMode in blueprints[vertical]
      ? (args.variationMode as VariationMode)
      : "seller";

  const metadata = args.metadata ?? {};
  const description = typeof metadata.description === "string" ? metadata.description : undefined;
  const contactEmail = typeof metadata.contactEmail === "string" ? metadata.contactEmail : undefined;
  const locationLabel = typeof metadata.locationLabel === "string" ? metadata.locationLabel : undefined;
  const medusaCollectionId =
    typeof metadata.medusaCollectionId === "string" ? metadata.medusaCollectionId : undefined;
  const primaryGoal =
    metadata.primaryGoal === "products" ||
    metadata.primaryGoal === "services" ||
    metadata.primaryGoal === "bookings" ||
    metadata.primaryGoal === "content"
      ? metadata.primaryGoal
      : undefined;

  return {
    businessName: args.businessName,
    vertical,
    variationMode: variation,
    primaryGoal,
    description,
    contactEmail,
    locationLabel,
    medusaCollectionId,
  };
}

export const getStorefrontByTenantId = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    const viewerUserId = await requireViewerUserId(ctx);
    const storefront = await ctx.db
      .query("storefronts")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .order("desc")
      .first();

    if (!storefront) return null;

    const tenant = await ctx.db.get(storefront.tenantId);
    if (!tenant) return null;

    assertTenantOwner(tenant.ownerUserId, viewerUserId);

    return { tenant, storefront };
  },
});

export const getStorefrontByTenantSlug = query({
  args: { tenantSlug: v.string() },
  handler: async (ctx, args) => {
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", slugify(args.tenantSlug)))
      .order("desc")
      .first();

    if (!tenant) return null;

    const storefront = await ctx.db
      .query("storefronts")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenant._id))
      .order("desc")
      .first();

    if (!storefront) return null;

    return {
      tenant: {
        _id: tenant._id,
        businessName: tenant.businessName,
        slug: tenant.slug,
        vertical: tenant.vertical,
        variationMode: tenant.variationMode,
        status: tenant.status,
      },
      storefront: {
        blueprintVersion: storefront.blueprintVersion,
        publishedPuckData: storefront.publishedPuckData ?? [],
        publishedVersion: storefront.publishedVersion ?? null,
        lastPublishedAt: storefront.lastPublishedAt ?? null,
        themeTokens: storefront.themeTokens,
        medusaCollectionId: storefront.medusaCollectionId ?? null,
      },
    };
  },
});

export const updateDraftPuckData = mutation({
  args: {
    tenantId: v.id("tenants"),
    puckData: v.any(),
  },
  handler: async (ctx, args) => {
    const viewerUserId = await requireViewerUserId(ctx);
    const storefront = await ctx.db
      .query("storefronts")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .order("desc")
      .first();

    if (!storefront) {
      throw new Error("Storefront not found for tenant");
    }

    const tenant = await ctx.db.get(storefront.tenantId);
    if (!tenant) {
      throw new Error("Tenant not found for storefront");
    }

    assertTenantOwner(tenant.ownerUserId, viewerUserId);

    const draftPuckData = Array.isArray(args.puckData) ? args.puckData : [];
    const draftVersion = storefront.draftVersion + 1;

    await ctx.db.patch(storefront._id, {
      draftPuckData,
      draftVersion,
    });

    return draftVersion;
  },
});

export const publishStorefront = mutation({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    const viewerUserId = await requireViewerUserId(ctx);
    const storefront = await ctx.db
      .query("storefronts")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .order("desc")
      .first();

    if (!storefront) {
      throw new Error("Storefront not found for tenant");
    }

    const tenant = await ctx.db.get(storefront.tenantId);
    if (!tenant) {
      throw new Error("Tenant not found for storefront");
    }

    assertTenantOwner(tenant.ownerUserId, viewerUserId);

    const draftPuckData = Array.isArray(storefront.draftPuckData)
      ? storefront.draftPuckData
      : [];

    if (draftPuckData.length === 0) {
      throw new Error("No draft storefront data to publish");
    }

    const publishedVersion = (storefront.publishedVersion ?? 0) + 1;

    await ctx.db.patch(storefront._id, {
      publishedPuckData: draftPuckData,
      publishedVersion,
      lastPublishedAt: Date.now(),
      publishedBy: viewerUserId,
    });

    await ctx.db.patch(tenant._id, {
      status: "active",
    });

    return publishedVersion;
  },
});

export const createTenant = internalMutation({
  args: {
    ownerUserId: v.id("users"),
    businessName: v.string(),
    slug: v.string(),
    vertical: v.string(),
    variationMode: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedSlug = slugify(args.slug);
    const existing = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", normalizedSlug))
      .first();

    const slug = existing
      ? `${normalizedSlug}-${Date.now().toString().slice(-6)}`
      : normalizedSlug;

    return ctx.db.insert("tenants", {
      ownerUserId: args.ownerUserId,
      businessName: args.businessName,
      slug,
      vertical: args.vertical,
      variationMode: args.variationMode,
      status: "draft",
      createdAt: Date.now(),
    });
  },
});

export const createStorefront = internalMutation({
  args: {
    tenantId: v.id("tenants"),
    blueprintVersion: v.string(),
    draftPuckData: v.any(),
    themeTokens: v.any(),
    medusaCollectionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("storefronts", {
      tenantId: args.tenantId,
      blueprintVersion: args.blueprintVersion,
      draftPuckData: args.draftPuckData,
      publishedPuckData: undefined,
      themeTokens: args.themeTokens,
      draftVersion: 1,
      medusaCollectionId: args.medusaCollectionId,
    });
  },
});

export const createStorefrontFromBlueprint = action({
  args: {
    businessName: v.string(),
    slug: v.optional(v.string()),
    vertical: v.string(),
    variationMode: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const clerkId = await requireViewerClerkId(ctx);
    const user = await ctx.runQuery(api.users.currentUser, {
      clerkId,
    });

    if (!user) {
      throw new Error(`User not found for clerkId: ${clerkId}`);
    }

    const businessMetadata = normalizeMetadata({
      businessName: args.businessName,
      vertical: args.vertical,
      variationMode: args.variationMode,
      metadata: args.metadata ?? undefined,
    });

    const compiled = compileStorefrontBlueprint({
      vertical: businessMetadata.vertical,
      variation: businessMetadata.variationMode,
      metadata: businessMetadata,
    });

    const requestedSlug = args.slug ? slugify(args.slug) : defaultTenantSlug(args.businessName);

    const tenantId = (await ctx.runMutation(internal.storefronts.createTenant, {
      ownerUserId: user._id,
      businessName: args.businessName,
      slug: requestedSlug,
      vertical: businessMetadata.vertical,
      variationMode: businessMetadata.variationMode,
    })) as Id<"tenants">;

    const storefrontId = (await ctx.runMutation(internal.storefronts.createStorefront, {
      tenantId,
      blueprintVersion: compiled.blueprintVersion,
      draftPuckData: compiled.puckData,
      themeTokens: compiled.themeTokens,
      medusaCollectionId: businessMetadata.medusaCollectionId,
    })) as Id<"storefronts">;

    return { tenantId, storefrontId };
  },
});
