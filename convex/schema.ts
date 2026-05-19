import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
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
    website: v.optional(v.string()),
    description: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    approved: v.boolean(),
    createdAt: v.number(),
  }),

  rfqs: defineTable({
    organizationId: v.id("organizations"),

    title: v.string(),

    category: v.string(),

    description: v.string(),

    budget: v.optional(v.string()),

    status: v.union(
      v.literal("open"),
      v.literal("in_review"),
      v.literal("closed")
    ),

    createdAt: v.number(),
  }),

  rfqResponses: defineTable({
    rfqId: v.id("rfqs"),

    organizationId: v.id("organizations"),

    message: v.string(),

    proposedBudget: v.optional(v.string()),

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
