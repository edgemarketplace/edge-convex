export type BlockCode = "H" | "O" | "P" | "C" | "A" | "F";

export type Vertical = "retail" | "services" | "content";

export type VariationMode =
  | "seller"
  | "pro"
  | "storyteller"
  | "minimalist"
  | "converter"
  | "local";

export type PrimaryGoal = "products" | "services" | "bookings" | "content";

export interface BusinessMetadata {
  businessName: string;
  vertical: Vertical;
  variationMode: VariationMode;
  primaryGoal?: PrimaryGoal;
  description?: string;
  contactEmail?: string;
  locationLabel?: string;
  medusaCollectionId?: string;
}

export const blueprints: Record<Vertical, Record<VariationMode, BlockCode[]>> = {
  retail: {
    seller: ["H", "O", "P", "F", "A"],
    pro: ["H", "O", "O", "P", "A"],
    storyteller: ["H", "C", "O", "P", "F", "A"],
    minimalist: ["H", "O", "A"],
    converter: ["H", "O", "P", "O", "A"],
    local: ["H", "C", "P", "A"],
  },
  services: {
    seller: ["H", "C", "P", "A"],
    pro: ["H", "C", "P", "F", "A"],
    storyteller: ["H", "C", "C", "P", "A"],
    minimalist: ["H", "C", "A"],
    converter: ["H", "P", "C", "A"],
    local: ["H", "C", "P", "F", "A"],
  },
  content: {
    seller: ["H", "C", "P", "A"],
    pro: ["H", "C", "C", "P", "A"],
    storyteller: ["H", "C", "C", "P", "F", "A"],
    minimalist: ["H", "C", "A"],
    converter: ["H", "C", "P", "A"],
    local: ["H", "C", "P", "A"],
  },
};

export const defaultThemeTokens = {
  color: {
    brand: "#111827",
    accent: "#2563eb",
    surface: "#ffffff",
    muted: "#f3f4f6",
  },
  radius: {
    card: "1rem",
    button: "9999px",
  },
};
