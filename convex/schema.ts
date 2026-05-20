import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("buyer"), v.literal("vendor"), v.literal("admin")),
    createdAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.optional(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_slug", ["slug"]),

  vendors: defineTable({
    organizationId: v.optional(v.id("organizations")),
    companyName: v.string(),
    category: v.string(),
    website: v.optional(v.string()),
    description: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    approved: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_approved", ["approved"])
    .index("by_organizationId_and_approved", ["organizationId", "approved"]),

  rfqs: defineTable({
    organizationId: v.id("organizations"),
    title: v.string(),
    category: v.string(),
    description: v.string(),
    budget: v.optional(v.string()),
    status: v.union(v.literal("open"), v.literal("in_review"), v.literal("closed")),
    createdAt: v.number(),
  }).index("by_organizationId", ["organizationId"]),

  rfqResponses: defineTable({
    rfqId: v.id("rfqs"),
    organizationId: v.id("organizations"),
    message: v.string(),
    proposedBudget: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_rfqId", ["rfqId"]),

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
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("archived")),
    createdAt: v.number(),
  })
    .index("by_ownerUserId", ["ownerUserId"])
    .index("by_slug", ["slug"]),

  storefronts: defineTable({
    tenantId: v.id("tenants"),
    blueprintVersion: v.string(),
    puckData: v.any(),
    themeTokens: v.optional(v.object({
      primary: v.optional(v.string()),
      accent: v.optional(v.string()),
      neutral: v.optional(v.string()),
      surface: v.optional(v.string()),
      text: v.optional(v.string()),
    })),
    draftVersion: v.number(),
    publishedVersion: v.number(),
    draftPuckData: v.any(),
    publishedPuckData: v.optional(v.any()),
    lastPublishedAt: v.optional(v.number()),
    publishedBy: v.optional(v.id("users")),
    updatedAt: v.number(),
    createdAt: v.number(),
  }).index("by_tenantId", ["tenantId"]),
});
