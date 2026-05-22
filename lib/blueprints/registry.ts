// Blueprint registry: hard-coded first, database later
export type Vertical = "retail" | "pro";
export type VariationMode = "seller" | "pro" | "storyteller" | "minimalist" | "converter" | "local";

// Block type keys matching Phase 2 definitions
type BlockKey = "H" | "O" | "P" | "F" | "A" | "C";

export type BusinessMetadata = {
  businessName: string;
  vertical: string;
  variationMode: string;
};

// Blueprint definition: array of block keys in order
type BlueprintDefinition = Record<VariationMode, BlockKey[]>;

export const blueprints: Record<Vertical, BlueprintDefinition> = {
  retail: {
    seller: ["H", "O", "P", "F", "A"],
    pro: ["H", "O", "O", "P", "A"],
    storyteller: ["H", "C", "P", "F", "A"],
    minimalist: ["H", "O", "A"],
    converter: ["H", "O", "P", "A"],
    local: ["H", "O", "P", "F", "A"],
  },
  pro: {
    seller: ["H", "O", "P", "F", "A"],
    pro: ["H", "O", "O", "P", "A"],
    storyteller: ["H", "C", "P", "F", "A"],
    minimalist: ["H", "O", "A"],
    converter: ["H", "O", "P", "A"],
    local: ["H", "O", "P", "F", "A"],
  },
};

// Map block keys to Puck component types
export const BLOCK_KEY_MAP: Record<BlockKey, string> = {
  H: "HeroSection",
  O: "ProductGrid",
  P: "SocialProof",
  F: "AccordionFAQ",
  A: "ContactForm",
  C: "ContentBlock",
};
