import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { compileStorefrontBlueprint } from "../lib/blueprints/compiler";

export const createStorefrontFromBlueprint = mutation({
  args: {
    businessName: v.string(),
    vertical: v.string(),
    primaryGoal: v.string(),
    variationMode: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Authenticate user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    let user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      // Auto-create user if webhook hasn't fired or they bypassed initial login steps
      const newUserId = await ctx.db.insert("users", {
        clerkId: identity.subject,
        email: identity.email || "unknown@example.com",
        name: identity.name || identity.nickname || "Storefront Owner",
        role: "vendor",
        createdAt: Date.now(),
      });
      user = await ctx.db.get(newUserId);
    }

    if (!user) {
      throw new Error("Failed to resolve user account.");
    }

    // 2. Create the tenant slug
    const slug = args.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // 3. Create tenant
    const tenantId = await ctx.db.insert("tenants", {
      ownerUserId: user._id,
      businessName: args.businessName,
      slug,
      vertical: args.vertical,
      variationMode: args.variationMode,
      status: "active",
      createdAt: Date.now(),
    });

    // 4. Compile Puck layout
    const puckData = compileStorefrontBlueprint({
      vertical: args.vertical,
      variation: args.variationMode,
      metadata: {
        businessName: args.businessName,
      },
    });

    // 5. Save storefront draft
    const storefrontId = await ctx.db.insert("storefronts", {
      tenantId,
      blueprintVersion: "1.0",
      puckData,
      themeTokens: {},
      draftVersion: Date.now(),
    });

    return slug; // Return slug to redirect user to their editor
  },
});

export const getStorefrontByTenantSlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();

    if (!tenant) return null;

    const storefront = await ctx.db
      .query("storefronts")
      .filter((q) => q.eq(q.field("tenantId"), tenant._id))
      .first();

    return {
      tenant,
      storefront,
    };
  },
});

export const updateDraftPuckData = mutation({
  args: {
    storefrontId: v.id("storefronts"),
    puckData: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    await ctx.db.patch(args.storefrontId, {
      puckData: args.puckData,
      draftVersion: Date.now(),
    });
  },
});

export const publishStorefront = mutation({
  args: {
    storefrontId: v.id("storefronts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    await ctx.db.patch(args.storefrontId, {
      publishedVersion: Date.now(),
    });
  },
});
