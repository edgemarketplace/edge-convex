import { BLUEPRINT_REGISTRY } from "./registry";

export interface BusinessMetadata {
  businessName: string;
  tagline?: string;
  contactEmail?: string;
}

export interface CompileBlueprintInput {
  vertical: string;
  variation: string;
  metadata: BusinessMetadata;
}

type PuckBlock = {
  type: "Header" | "HeroSection" | "ProductGrid" | "SocialProof" | "ContentBlock" | "AccordionFAQ" | "ContactForm" | "Footer";
  props: Record<string, string | number | boolean>;
};

export function compileStorefrontBlueprint({ vertical, variation, metadata }: CompileBlueprintInput) {
  // Fallbacks if vertical or variation are missing from registry
  const verticalBlueprints = BLUEPRINT_REGISTRY[vertical] || BLUEPRINT_REGISTRY["retail"];
  const blocks = verticalBlueprints[variation] || verticalBlueprints["seller"];

  const content: PuckBlock[] = [];

  // Generate deterministic unique IDs for Puck elements
  const generateId = (type: string, index: string | number) => `${type}-${index}`;

  // 1. Always inject the Global Header
  content.push({
    type: "Header",
    props: {
      title: metadata.businessName,
    },
  });

  // 2. Inject the dynamic sequence of blocks
  blocks.forEach((blockKey) => {
    switch (blockKey) {
      case "H":
        content.push({
          type: "HeroSection",
          props: {
            title: `Welcome to ${metadata.businessName}`,
            subtitle: metadata.tagline || "Discover our curated collection.",
          },
        });
        break;
      case "O":
        content.push({
          type: "ProductGrid",
          props: {
            source: "medusa",
            collectionId: "default", // To be hydrated by Medusa later
            itemsPerView: 8,
            filterCategories: true,
          },
        });
        break;
      case "P":
        content.push({
          type: "SocialProof",
          props: {
            heading: "What our customers are saying",
          },
        });
        break;
      case "C":
        content.push({
          type: "ContentBlock",
          props: {
            heading: `About ${metadata.businessName}`,
            content: "We are committed to delivering the best quality and service.",
          },
        });
        break;
      case "F":
        content.push({
          type: "AccordionFAQ",
          props: {
            heading: "Frequently Asked Questions",
          },
        });
        break;
      case "A":
        content.push({
          type: "ContactForm",
          props: {
            email: metadata.contactEmail || "contact@example.com",
          },
        });
        break;
    }
  });

  // 3. Always inject the Global Footer
  content.push({
    type: "Footer",
    props: {
      text: `© ${new Date().getFullYear()} ${metadata.businessName}. All rights reserved.`,
    },
  });

  // Puck requires each item in content to have a unique string id.
  // We'll map through our constructed array to inject IDs just before returning.
  const puckContent = content.map((item, index) => ({
    ...item,
    // Provide a simple unique ID for Puck compatibility
    props: { ...item.props, id: generateId(item.type, index) },
  }));

  // Output valid Puck JSON
  return {
    content: puckContent,
    root: { props: {} },
    zones: {},
  };
}
