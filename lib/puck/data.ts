import type { Data } from "@puckeditor/core";
import type { PuckComponentName, PuckComponentProps, StorefrontPuckData } from "./types";

const componentNames: PuckComponentName[] = [
  "Header",
  "Footer",
  "HeroSection",
  "ProductGrid",
  "SocialProof",
  "AccordionFAQ",
  "ContactForm",
  "ContentBlock",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function fallbackId(type: PuckComponentName, index: number) {
  if (type === "Header") return "header";
  if (type === "Footer") return "footer";
  return `${type.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}-${index + 1}`;
}

export function normalizeStorefrontContent(raw: unknown): StorefrontPuckData {
  const content = Array.isArray(raw)
    ? raw
    : isRecord(raw) && Array.isArray(raw.content)
      ? raw.content
      : [];

  return content.flatMap((block, index) => {
    if (!isRecord(block) || typeof block.type !== "string") return [];
    if (!componentNames.includes(block.type as PuckComponentName)) return [];

    const props = isRecord(block.props) ? block.props : {};
    return [
      {
        type: block.type as PuckComponentName,
        props: {
          ...props,
          id:
            typeof props.id === "string"
              ? props.id
              : fallbackId(block.type as PuckComponentName, index),
        },
      },
    ];
  }) as StorefrontPuckData;
}

export function toPuckEditorData(raw: unknown): Data<PuckComponentProps> {
  return {
    root: { props: {} },
    content: normalizeStorefrontContent(raw),
  };
}
