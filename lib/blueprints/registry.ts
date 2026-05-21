export type Vertical = "retail" | "service" | "content";
export type VariationMode = "seller" | "pro" | "storyteller" | "minimalist" | "converter" | "local";

// Block mapping keys:
// H = HeroSection
// O = ProductGrid
// P = SocialProof
// C = ContentBlock
// A = ContactForm
// F = AccordionFAQ

export const BLUEPRINT_REGISTRY: Record<string, Record<string, string[]>> = {
  retail: {
    seller: ["H", "O", "P", "F", "A"],
    pro: ["H", "O", "O", "P", "A"],
    storyteller: ["H", "C", "O", "P", "F", "A"],
    minimalist: ["H", "O", "A"],
    converter: ["H", "O", "P", "O", "A"],
    local: ["H", "C", "O", "A"],
  },
  // We can add other verticals like "service" or "content" here later
};
