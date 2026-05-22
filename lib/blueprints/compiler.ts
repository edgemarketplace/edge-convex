import { blueprints, BLOCK_KEY_MAP } from "./registry";
import type { StorefrontPuckData } from "../puck/types";
import type { Vertical } from "./registry";

export type BusinessMetadata = {
  businessName: string;
  vertical: string;
  variationMode: string;
};

type PuckComponent = StorefrontPuckData[number];

/**
 * Compile a deterministic storefront blueprint into Puck-compatible component array
 * Follows Phase 3 spec: pure function, returns valid Puck JSON
 */
export function compileStorefrontBlueprint({
  vertical,
  variation,
  metadata,
}: {
  vertical: Vertical;
  variation: string;
  metadata: BusinessMetadata;
}): PuckComponent[] {
  // Get block keys for this vertical + variation
  const blueprint = blueprints[vertical];
  if (!blueprint) throw new Error(`Unsupported vertical: ${vertical}`);
  const blockKeys = blueprint[variation as keyof typeof blueprint];
  if (!blockKeys) throw new Error(`Unsupported variation: ${variation} for vertical: ${vertical}`);

  const components: PuckComponent[] = [];

  // 1. Add global Header
  components.push({
    type: "Header",
    props: {
      id: "header",
      businessName: metadata.businessName,
      vertical: metadata.vertical,
    },
  });

  // 2. Add dynamic blocks from blueprint
  blockKeys.forEach((key) => {
    const componentType = BLOCK_KEY_MAP[key];
    if (!componentType) return;

    const baseProps: Record<string, string | number | boolean> = {
      id: `${componentType}-${components.length}`,
      businessName: metadata.businessName,
    };

    // Add opinionated default props per component type
    switch (componentType) {
      case "HeroSection":
        baseProps.headline = `Welcome to ${metadata.businessName}`;
        baseProps.subheadline = `Your trusted ${metadata.vertical} partner`;
        break;
      case "ProductGrid":
        baseProps.source = "medusa";
        baseProps.itemsPerView = 8;
        baseProps.filterCategories = true;
        break;
      case "SocialProof":
        baseProps.headline = "What our customers say";
        break;
      case "AccordionFAQ":
        baseProps.headline = "Frequently Asked Questions";
        break;
      case "ContactForm":
        baseProps.headline = "Get in Touch";
        break;
      case "ContentBlock":
        baseProps.content = `Learn more about ${metadata.businessName}`;
        break;
    }

    components.push({
      type: componentType,
      props: baseProps,
    } as PuckComponent);
  });

  // 3. Add global Footer
  components.push({
    type: "Footer",
    props: {
      id: "footer",
      businessName: metadata.businessName,
      year: new Date().getFullYear(),
    },
  });

  return components;
}
