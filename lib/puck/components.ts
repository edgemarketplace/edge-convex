import type { PuckConfigMap, StorefrontPuckConfig } from "./types";
import { Header, headerConfig } from "../../components/puck/Header";
import { Footer, footerConfig } from "../../components/puck/Footer";
import { HeroSection, heroSectionConfig } from "../../components/puck/HeroSection";
import { ProductGrid, productGridConfig } from "../../components/puck/ProductGrid";
import {
  AccordionFAQ,
  accordionFAQConfig,
  ContactForm,
  contactFormConfig,
  ContentBlock,
  contentBlockConfig,
  SocialProof,
  socialProofConfig,
} from "../../components/puck/OtherComponents";

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

export const puckComponentConfigs: PuckConfigMap = {
  Header: headerConfig,
  Footer: footerConfig,
  HeroSection: heroSectionConfig,
  ProductGrid: productGridConfig,
  SocialProof: socialProofConfig,
  AccordionFAQ: accordionFAQConfig,
  ContactForm: contactFormConfig,
  ContentBlock: contentBlockConfig,
};

export const puckConfig: StorefrontPuckConfig = {
  components: puckComponentConfigs,
};
