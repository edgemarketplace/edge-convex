import { ComponentConfig } from "@puckeditor/core";

export type HeroSectionProps = {
  headline?: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  id?: string;
};

export const HeroSection = ({
  headline,
  subheadline,
  ctaLabel,
  ctaHref,
}: HeroSectionProps) => {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-24">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          Blueprint-generated storefront
        </p>
        <h2 className="mb-6 text-4xl font-semibold tracking-tight text-gray-950 md:text-6xl">
          {headline || "Launch with confidence"}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
          {subheadline || "Turn your tenant metadata into a clean commerce-ready landing page."}
        </p>
        <a
          href={ctaHref || "#products"}
          className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {ctaLabel || "Browse products"}
        </a>
      </div>
    </section>
  );
};

export const heroSectionConfig: ComponentConfig<HeroSectionProps> = {
  render: HeroSection,
  fields: {
    headline: { type: "text" },
    subheadline: { type: "textarea" },
    ctaLabel: { type: "text" },
    ctaHref: { type: "text" },
  },
  defaultProps: {
    headline: "Launch with confidence",
    subheadline: "Turn your tenant metadata into a clean commerce-ready landing page.",
    ctaLabel: "Browse products",
    ctaHref: "#products",
  },
};
