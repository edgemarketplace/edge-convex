import { ComponentConfig } from "@puckeditor/core";
import { Header } from "../../components/puck/Header";
import { Footer } from "../../components/puck/Footer";
import { HeroSection } from "../../components/puck/HeroSection";
import { ProductGrid } from "../../components/puck/ProductGrid";
import { SocialProof, SocialProofProps } from "../../components/puck/OtherComponents";
import { AccordionFAQ } from "../../components/puck/OtherComponents";
import { ContactForm } from "../../components/puck/OtherComponents";
import { ContentBlock } from "../../components/puck/OtherComponents";
import { headerConfig } from "../../components/puck/Header";
import { footerConfig } from "../../components/puck/Footer";
import { heroSectionConfig } from "../../components/puck/HeroSection";
import { productGridConfig } from "../../components/puck/ProductGrid";
import { socialProofConfig } from "../../components/puck/OtherComponents";
import { accordionFAQConfig } from "../../components/puck/OtherComponents";
import { contactFormConfig } from "../../components/puck/OtherComponents";
import { contentBlockConfig } from "../../components/puck/OtherComponents";

// Component map for Puck renderer
export const puckComponents = {
  Header,
  Footer,
  HeroSection,
  ProductGrid,
  SocialProof,
  AccordionFAQ,
  ContactForm,
  ContentBlock,
};

// Configs for Puck editor (used in editor page)
export const puckComponentConfigs: Record<string, ComponentConfig<any>> = {
  Header: headerConfig,
  Footer: footerConfig,
  HeroSection: heroSectionConfig,
  ProductGrid: productGridConfig,
  SocialProof: socialProofConfig,
  AccordionFAQ: accordionFAQConfig,
  ContactForm: contactFormConfig,
  ContentBlock: contentBlockConfig,
};