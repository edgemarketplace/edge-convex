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
  }).index("by_clerkId", ["clerkId"]),

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

  tenants: defineTable({
    ownerUserId: v.id("users"),
    businessName: v.string(),
    slug: v.string(),
    vertical: v.string(),
    variationMode: v.string(),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"])
    .index("by_owner", ["ownerUserId"]),

  storefronts: defineTable({
    tenantId: v.id("tenants"),
    blueprintVersion: v.string(),
    puckData: v.any(),
    themeTokens: v.any(),
    publishedVersion: v.optional(v.number()),
    draftVersion: v.optional(v.number()),
  }).index("by_tenant", ["tenantId"]),
});
