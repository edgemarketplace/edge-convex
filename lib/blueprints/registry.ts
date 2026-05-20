export type StorefrontVertical = "retail";

export type VariationMode =
  | "seller"
  | "pro"
  | "storyteller"
  | "minimalist"
  | "converter"
  | "local";

export type BlockCode = "H" | "O" | "P" | "C" | "A" | "F";

export const BLUEPRINT_VERSION = "v1";

export const blueprintRegistry: Record<
  StorefrontVertical,
  Partial<Record<VariationMode, BlockCode[]>>
> = {
  retail: {
    seller: ["H", "O", "P", "F", "A"],
    pro: ["H", "O", "O", "P", "A"],
    storyteller: ["H", "C", "P", "F", "A"],
    minimalist: ["H", "O", "A"],
    converter: ["H", "P", "O", "F", "A"],
    local: ["H", "C", "O", "A"],
  },
};
