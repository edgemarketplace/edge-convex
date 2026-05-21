import {
  blueprintRegistry,
  type BlockCode,
  type StorefrontVertical,
  type VariationMode,
} from "./registry";

export type BusinessMetadata = {
  businessName: string;
  primaryGoal?: string;
  offeringType?: "products" | "services" | "bookings" | "content";
};

export type PuckBlock = {
  type:
    | "Header"
    | "HeroSection"
    | "ProductGrid"
    | "SocialProof"
    | "ContentBlock"
    | "ContactForm"
    | "AccordionFAQ"
    | "Footer";
  props: Record<string, unknown>;
};

const blockCodeToType: Record<BlockCode, PuckBlock["type"]> = {
  H: "HeroSection",
  O: "ProductGrid",
  P: "SocialProof",
  C: "ContentBlock",
  A: "ContactForm",
  F: "AccordionFAQ",
};

function blockProps(type: PuckBlock["type"], metadata: BusinessMetadata): Record<string, unknown> {
  switch (type) {
    case "HeroSection":
      return {
        headline: `${metadata.businessName} on Edge Marketplace`,
        subheadline: metadata.primaryGoal ?? "Discover products and services built for your needs.",
        ctaLabel: "Explore now",
      };
    case "ProductGrid":
      return {
        source: "medusa",
        collectionId: "default",
        itemsPerView: 8,
        filterCategories: true,
        categoryIds: "",
      };
    case "SocialProof":
      return {
        title: "Trusted by growing teams",
        item1: "Fast onboarding",
        item2: "Verified sellers",
        item3: "Secure transactions",
      };
    case "ContentBlock":
      return {
        title: "Why choose us",
        body: "We combine curated suppliers with streamlined procurement workflows.",
      };
    case "ContactForm":
      return {
        title: "Talk to our team",
        submitLabel: "Send inquiry",
      };
    case "AccordionFAQ":
      return {
        title: "Frequently asked questions",
        q1: "How fast is onboarding?",
        a1: "Most teams launch in under a day.",
        q2: "Can I request quotes?",
        a2: "Yes, RFQs are supported out of the box.",
      };
    default:
      return {};
  }
}

export function compileStorefrontBlueprint(args: {
  vertical: StorefrontVertical;
  variation: VariationMode;
  metadata: BusinessMetadata;
}): { root: { props: { title: string } }; content: PuckBlock[] } {
  const blocks = blueprintRegistry[args.vertical]?.[args.variation];
  if (!blocks || blocks.length === 0) {
    throw new Error(`No blueprint found for ${args.vertical}/${args.variation}`);
  }

  const compiled: PuckBlock[] = [
    {
      type: "Header",
      props: {
        brand: args.metadata.businessName,
        links: ["Products", "About", "Contact"],
      },
    },
    ...blocks.map((code) => {
      const type = blockCodeToType[code];
      return {
        type,
        props: blockProps(type, args.metadata),
      };
    }),
    {
      type: "Footer",
      props: {
        copyright: `© {{YEAR}} ${args.metadata.businessName}`,
      },
    },
  ];

  return {
    root: {
      props: {
        title: `${args.metadata.businessName} storefront`,
      },
    },
    content: compiled,
  };
}
