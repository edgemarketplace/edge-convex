import { ComponentConfig } from "@puckeditor/core";
import { Header } from "../../components/puck/Header";
import { Footer } from "../../components/puck/Footer";
import { HeroSection } from "../../components/puck/HeroSection";
import { ProductGrid } from "../../components/puck/ProductGrid";
import { SocialProof, SocialProofProps } from "../../components/puck/OtherComponents";
import { AccordionFAQ } from "../../components/puck/OtherComponents";
import { ContactForm } from "../../components/puck/OtherComponents";
import { ContentBlock } from "../../components/puck/OtherComponents";

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
  Header: { render: Header, fields: { businessName: { type: "text" }, vertical: { type: "text" } }, defaultProps: { businessName: "Your Business", vertical: "retail" } },
  Footer: { render: Footer, fields: { businessName: { type: "text" }, year: { type: "number" } }, defaultProps: { businessName: "Your Business", year: new Date().getFullYear() } },
  HeroSection: { render: HeroSection, fields: { headline: { type: "text" }, subheadline: { type: "text" } }, defaultProps: { headline: "Welcome", subheadline: "Your store" } },
  ProductGrid: { render: ProductGrid, fields: { source: { type: "select", options: [{ label: "Medusa", value: "medusa" }] }, itemsPerView: { type: "number" } }, defaultProps: { source: "medusa", itemsPerView: 8 } },
  SocialProof: { render: SocialProof, fields: { headline: { type: "text" } }, defaultProps: { headline: "What Our Customers Say" } },
  AccordionFAQ: { render: AccordionFAQ, fields: { headline: { type: "text" } }, defaultProps: { headline: "FAQ" } },
  ContactForm: { render: ContactForm, fields: { headline: { type: "text" } }, defaultProps: { headline: "Contact Us" } },
  ContentBlock: { render: ContentBlock, fields: { content: { type: "textarea" } }, defaultProps: { content: "Your content here" } },
};
