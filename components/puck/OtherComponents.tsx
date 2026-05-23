import { ComponentConfig } from "@puckeditor/core";

export type SocialProofProps = {
  headline?: string;
  subheadline?: string;
  id?: string;
};

export const SocialProof = ({ headline, subheadline }: SocialProofProps) => (
  <section className="bg-gray-50 py-16">
    <div className="mx-auto max-w-7xl px-4">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          Social proof
        </p>
        <h3 className="mt-2 text-3xl font-semibold text-gray-950">
          {headline || "Why buyers trust this storefront"}
        </h3>
        <p className="mt-3 text-base text-gray-600">
          {subheadline || "Opinionated defaults give every tenant a polished starting point."}
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          "Fast vendor onboarding for operators and sellers.",
          "Blueprint-generated landing pages that stay editable in Puck.",
          "Commerce data hydrated live from Medusa instead of copied into content JSON.",
        ].map((quote) => (
          <div key={quote} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">{quote}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const socialProofConfig: ComponentConfig<SocialProofProps> = {
  render: SocialProof,
  fields: {
    headline: { type: "text" },
    subheadline: { type: "textarea" },
  },
  defaultProps: {
    headline: "Why buyers trust this storefront",
    subheadline: "Opinionated defaults give every tenant a polished starting point.",
  },
};

export type AccordionFAQProps = {
  headline?: string;
  id?: string;
};

export const AccordionFAQ = ({ headline }: AccordionFAQProps) => (
  <section className="mx-auto max-w-4xl px-4 py-16">
    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">FAQ</p>
    <h3 className="mt-2 text-3xl font-semibold text-gray-950">
      {headline || "Frequently asked questions"}
    </h3>
    <div className="mt-8 space-y-4">
      {[
        ["How is this storefront generated?", "A deterministic compiler selects a blueprint sequence and fills opinionated Puck block props from tenant metadata."],
        ["Where do products come from?", "Commerce data stays in Medusa. ProductGrid only stores references like collection IDs and display preferences."],
        ["Can operators edit the page later?", "Yes. Drafts stay in Convex and open directly in the visual Puck editor."],
      ].map(([question, answer]) => (
        <details key={question} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <summary className="cursor-pointer font-medium text-gray-950">{question}</summary>
          <p className="mt-3 text-sm text-gray-600">{answer}</p>
        </details>
      ))}
    </div>
  </section>
);

export const accordionFAQConfig: ComponentConfig<AccordionFAQProps> = {
  render: AccordionFAQ,
  fields: {
    headline: { type: "text" },
  },
  defaultProps: {
    headline: "Frequently asked questions",
  },
};

export type ContactFormProps = {
  headline?: string;
  description?: string;
  submitLabel?: string;
  id?: string;
};

export const ContactForm = ({ headline, description, submitLabel }: ContactFormProps) => (
  <section className="bg-blue-50 py-16">
    <div className="mx-auto max-w-3xl px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Lead capture</p>
      <h3 className="mt-2 text-3xl font-semibold text-gray-950">
        {headline || "Talk to the team"}
      </h3>
      <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
        {description || "Use this block to capture pre-checkout procurement inquiries while the MVP storefront stays simple."}
      </p>
      <form className="mx-auto mt-8 grid max-w-xl gap-4 rounded-3xl bg-white p-6 text-left shadow-sm">
        <label htmlFor="contact-name" className="text-sm font-medium text-gray-700">Name</label>
        <input id="contact-name" name="name" autoComplete="name" type="text" className="rounded-xl border border-gray-300 px-4 py-3" placeholder="Jordan Smith" />
        <label htmlFor="contact-email" className="text-sm font-medium text-gray-700">Email</label>
        <input id="contact-email" name="email" autoComplete="email" type="email" className="rounded-xl border border-gray-300 px-4 py-3" placeholder="jordan@example.com" />
        <label htmlFor="contact-message" className="text-sm font-medium text-gray-700">Message</label>
        <textarea id="contact-message" name="message" autoComplete="off" className="min-h-32 rounded-xl border border-gray-300 px-4 py-3" placeholder="Tell us what you need" />
        <button type="submit" className="inline-flex justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
          {submitLabel || "Send inquiry"}
        </button>
      </form>
    </div>
  </section>
);

export const contactFormConfig: ComponentConfig<ContactFormProps> = {
  render: ContactForm,
  fields: {
    headline: { type: "text" },
    description: { type: "textarea" },
    submitLabel: { type: "text" },
  },
  defaultProps: {
    headline: "Talk to the team",
    description: "Use this block to capture pre-checkout procurement inquiries while the MVP storefront stays simple.",
    submitLabel: "Send inquiry",
  },
};

export type ContentBlockProps = {
  headline?: string;
  body?: string;
  id?: string;
};

export const ContentBlock = ({ headline, body }: ContentBlockProps) => (
  <section className="mx-auto max-w-4xl px-4 py-16">
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Story</p>
      <h3 className="mt-2 text-3xl font-semibold text-gray-950">
        {headline || "Tell your story"}
      </h3>
      <p className="mt-4 whitespace-pre-line text-base leading-7 text-gray-600">
        {body || "Explain what this storefront sells, why it matters, and what should happen next."}
      </p>
    </div>
  </section>
);

export const contentBlockConfig: ComponentConfig<ContentBlockProps> = {
  render: ContentBlock,
  fields: {
    headline: { type: "text" },
    body: { type: "textarea" },
  },
  defaultProps: {
    headline: "Tell your story",
    body: "Explain what this storefront sells, why it matters, and what should happen next.",
  },
};
