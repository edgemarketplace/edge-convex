import type { Config, Data } from "@puckeditor/core";
import type { HeaderProps } from "../../components/puck/Header";
import type { FooterProps } from "../../components/puck/Footer";
import type { HeroSectionProps } from "../../components/puck/HeroSection";
import type { ProductGridProps } from "../../components/puck/ProductGrid";
import type {
  AccordionFAQProps,
  ContactFormProps,
  ContentBlockProps,
  SocialProofProps,
} from "../../components/puck/OtherComponents";

export type PuckComponentName =
  | "Header"
  | "Footer"
  | "HeroSection"
  | "ProductGrid"
  | "SocialProof"
  | "AccordionFAQ"
  | "ContactForm"
  | "ContentBlock";

export type PuckComponentProps = {
  Header: HeaderProps;
  Footer: FooterProps;
  HeroSection: HeroSectionProps;
  ProductGrid: ProductGridProps;
  SocialProof: SocialProofProps;
  AccordionFAQ: AccordionFAQProps;
  ContactForm: ContactFormProps;
  ContentBlock: ContentBlockProps;
};

export type StorefrontPuckConfig = Config<PuckComponentProps>;
export type PuckConfigMap = StorefrontPuckConfig["components"];
export type StorefrontEditorData = Data<PuckComponentProps>;
export type StorefrontPuckData = StorefrontEditorData["content"];
export type StorefrontBlock = StorefrontPuckData[number];
