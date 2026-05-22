import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";

export const createVendor = mutation({
  args: {
    organizationId: v.id("organizations"),
    companyName: v.string(),
    category: v.string(),
    website: v.optional(v.string()),
    description: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("vendors", {
      organizationId: args.organizationId,
      companyName: args.companyName,
      category: args.category,
      ...(args.website ? { website: args.website } : {}),
      ...(args.description ? { description: args.description } : {}),
      ...(args.contactEmail ? { contactEmail: args.contactEmail } : {}),
      approved: false,
      createdAt: Date.now(),
    });
  },
});

export const listVendorsByOrganization = query({
  args: {
    organizationId: v.id("organizations"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("vendors")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", args.organizationId))
      .take(100);
  },
});

export const listApprovedVendors = query({
  args: {},

  handler: async (ctx) => {
    const vendors = await ctx.db
      .query("vendors")
      .withIndex("by_approved", (q) => q.eq("approved", true))
      .take(100);

    const enriched = await Promise.all(
      vendors.map(async (vendor) => {
        let organization: Doc<"organizations"> | null = null;

        if (vendor.organizationId) {
          organization = await ctx.db.get(
            vendor.organizationId as Id<"organizations">
          );
        }

        return {
          ...vendor,
          organizationSlug: organization?.slug || "",
          organizationName: organization?.name || "",
        };
      })
    );

    return enriched.filter((vendor) => vendor.organizationSlug);
  },
});

export const getApprovedVendor = query({
  args: {
    vendorId: v.id("vendors"),
  },

  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.vendorId);

    if (!vendor || !vendor.approved) {
      return null;
    }

    return vendor;
  },
});

export const getApprovedVendorByOrganization = query({
  args: {
    organizationId: v.id("organizations"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("vendors")
      .withIndex("by_organizationId_and_approved", (q) =>
        q.eq("organizationId", args.organizationId).eq("approved", true)
      )
      .first();
  },
});

export const listAllVendors = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db.query("vendors").take(100);
  },
});

export const approveVendor = mutation({
  args: {
    vendorId: v.id("vendors"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.vendorId, {
      approved: true,
    });
  },
});

export const rejectVendor = mutation({
  args: {
    vendorId: v.id("vendors"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.vendorId, {
      approved: false,
    });
  },
});
