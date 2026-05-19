import { mutation, query } from "./_generated/server";

import { v } from "convex/values";

export const createRFQ = mutation({
  args: {
    organizationId: v.id("organizations"),

    title: v.string(),

    category: v.string(),

    description: v.string(),

    budget: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("rfqs", {
      organizationId: args.organizationId,

      title: args.title,

      category: args.category,

      description: args.description,

      budget: args.budget,

      status: "open",

      createdAt: Date.now(),
    });
  },
});

export const listRFQs = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db
      .query("rfqs")
      .order("desc")
      .collect();
  },
});
