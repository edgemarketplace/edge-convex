import { mutation, query } from "./_generated/server";

import { v } from "convex/values";

import type { Doc } from "./_generated/dataModel";

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
    return await ctx.db.query("rfqs").order("desc").collect();
  },
});

export const getRFQ = query({
  args: {
    rfqId: v.id("rfqs"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.get(args.rfqId);
  },
});

export const updateRFQStatus = mutation({
  args: {
    rfqId: v.id("rfqs"),
    status: v.union(
      v.literal("open"),
      v.literal("in_review"),
      v.literal("closed")
    ),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.rfqId, {
      status: args.status,
    });
  },
});

export const createRFQResponse = mutation({
  args: {
    rfqId: v.id("rfqs"),
    organizationId: v.id("organizations"),
    message: v.string(),
    proposedBudget: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("rfqResponses", {
      rfqId: args.rfqId,
      organizationId: args.organizationId,
      message: args.message,
      proposedBudget: args.proposedBudget,
      createdAt: Date.now(),
    });
  },
});

export const listRFQResponses = query({
  args: {
    rfqId: v.id("rfqs"),
  },

  handler: async (ctx, args) => {
    const responses = await ctx.db
      .query("rfqResponses")
      .withIndex("by_rfqId", (q) => q.eq("rfqId", args.rfqId))
      .order("desc")
      .collect();

    const enriched = await Promise.all(
      responses.map(async (response) => {
        let organization: Doc<"organizations"> | null = null;

        if (response.organizationId) {
          organization = await ctx.db.get(response.organizationId);
        }

        return {
          ...response,
          organizationName:
            organization?.name || "Unknown Organization",
          organizationSlug: organization?.slug || "",
        };
      })
    );

    return enriched;
  },
});
