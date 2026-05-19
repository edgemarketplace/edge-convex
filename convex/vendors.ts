import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

      website: args.website,

      description: args.description,

      contactEmail: args.contactEmail,

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
      .filter((q) =>
        q.eq(
          q.field("organizationId"),
          args.organizationId
        )
      )
      .collect();
  },
});
