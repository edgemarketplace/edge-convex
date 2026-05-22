import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export const createOrganization = mutation({
  args: {
    ownerId: v.id("users"),
    name: v.string(),
  },

  handler: async (ctx, args) => {
    const slug = slugify(args.name);

    return await ctx.db.insert("organizations", {
      name: args.name,
      slug,
      ownerId: args.ownerId,
      createdAt: Date.now(),
    });
  },
});

export const listByOwner = query({
  args: {
    ownerId: v.id("users"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("organizations")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", args.ownerId))
      .take(100);
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});
