import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    role: v.union(
      v.literal("buyer"),
      v.literal("vendor"),
      v.literal("admin")
    ),
    createdAt: v.number(),
  }),

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.optional(v.id("users")),
    createdAt: v.number(),
  }),

  vendors: defineTable({
    organizationId: v.optional(v.id("organizations")),
    companyName: v.string(),
    category: v.string(),
    approved: v.boolean(),
    createdAt: v.number(),
  }),

  sites: defineTable({
    organizationId: v.optional(v.id("organizations")),
    name: v.string(),
    slug: v.string(),
    published: v.boolean(),
    createdAt: v.number(),
  }),
});
