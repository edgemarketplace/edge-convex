import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createVendor = mutation({
  args: {
    companyName: v.string(),
    category: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("vendors", {
      companyName: args.companyName,
      category: args.category,
      approved: false,
      createdAt: Date.now(),
    });
  },
});

export const listVendors = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db.query("vendors").collect();
  },
});
