import type { StorefrontPuckData } from "../puck/types";
import { DEFAULT_MEDUSA_COLLECTION_ID } from "../medusa/config";
import {
  blueprints,
  defaultThemeTokens,
  type BusinessMetadata,
  type BlockCode,
  type VariationMode,
  type Vertical,
} from "./registry";

export interface CompileStorefrontBlueprintInput {
  vertical: Vertical;
  variation: VariationMode;
  metadata: BusinessMetadata;
}

export interface CompiledStorefrontBlueprint {
  blueprintVersion: string;
  puckData: StorefrontPuckData;
  themeTokens: typeof defaultThemeTokens;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function makeId(type: string, index: number) {
  const normalized = type.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
  return `${normalized}-${index + 1}`;
}

function makeHeader(metadata: BusinessMetadata) {
  return {
    type: "Header" as const,
    props: {
      id: "header",
      businessName: metadata.businessName,
      announcement: metadata.locationLabel ?? "Built for modern multi-tenant commerce",
    },
  };
}

function makeFooter(metadata: BusinessMetadata) {
  return {
    type: "Footer" as const,
    props: {
      id: "footer",
      businessName: metadata.businessName,
      tagline: metadata.description ?? "Powered by a deterministic storefront blueprint.",
    },
  };
}

function blockFromCode(
  blockCode: BlockCode,
  metadata: BusinessMetadata,
  index: number,
): StorefrontPuckData[number] {
  switch (blockCode) {
    case "H":
      return {
        type: "HeroSection",
        props: {
          id: makeId("hero-section", index),
          headline: `Launch ${metadata.businessName} with confidence`,
          subheadline:
            metadata.description ??
            "A generated storefront foundation that keeps layout deterministic while commerce stays in Medusa.",
          ctaLabel:
            metadata.primaryGoal === "services"
              ? "Book a consultation"
              : metadata.primaryGoal === "content"
                ? "Explore the catalog"
                : "Browse featured products",
          ctaHref: "#products",
        },
      };
    case "O":
      return {
        type: "ProductGrid",
        props: {
          id: makeId("product-grid", index),
          headline: metadata.primaryGoal === "services" ? "Featured offers" : "Featured products",
          source: "medusa",
          collectionId: metadata.medusaCollectionId ?? DEFAULT_MEDUSA_COLLECTION_ID,
          itemsPerView: 8,
          filterCategories: true,
          emptyStateMessage: "Products will appear here once this storefront is connected to a Medusa collection.",
        },
      };
    case "P":
      return {
        type: "SocialProof",
        props: {
          id: makeId("social-proof", index),
          headline: `Why teams choose ${metadata.businessName}`,
          subheadline: "Reusable blueprint defaults tuned for conversion, trust, and clarity.",
        },
      };
    case "C":
      return {
        type: "ContentBlock",
        props: {
          id: makeId("content-block", index),
          headline: `About ${metadata.businessName}`,
          body:
            metadata.description ??
            "Tell buyers what makes this offer credible, differentiated, and easy to buy from.",
        },
      };
    case "A":
      return {
        type: "ContactForm",
        props: {
          id: makeId("contact-form", index),
          headline: "Talk to the team",
          description: "Collect inbound leads without overbuilding CRM logic in the MVP.",
          submitLabel: "Send inquiry",
        },
      };
    case "F":
      return {
        type: "AccordionFAQ",
        props: {
          id: makeId("accordion-faq", index),
          headline: "Frequently asked questions",
        },
      };
  }
}

export function compileStorefrontBlueprint({
  vertical,
  variation,
  metadata,
}: CompileStorefrontBlueprintInput): CompiledStorefrontBlueprint {
  const verticalBlueprints = blueprints[vertical] ?? blueprints.retail;
  const sequence = verticalBlueprints[variation] ?? verticalBlueprints.seller;

  const puckData: StorefrontPuckData = [
    makeHeader(metadata),
    ...sequence.map((blockCode, index) => blockFromCode(blockCode, metadata, index)),
    makeFooter(metadata),
  ];

  return {
    blueprintVersion: `${vertical}-${variation}-v1`,
    puckData,
    themeTokens: {
      ...defaultThemeTokens,
      color: {
        ...defaultThemeTokens.color,
        accent:
          vertical === "services"
            ? "#7c3aed"
            : vertical === "content"
              ? "#0f766e"
              : defaultThemeTokens.color.accent,
      },
    },
  };
}

export function defaultTenantSlug(businessName: string) {
  return slugify(businessName);
}
