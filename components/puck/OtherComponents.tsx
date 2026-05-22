import { ComponentConfig } from "@puckeditor/core";

// SocialProof
export type SocialProofProps = { headline?: string };
export const SocialProof: React.FC<SocialProofProps> = ({ headline }) => (
  <section className="bg-gray-50 py-12">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-8 text-center">{headline || "What Our Customers Say"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">"Great service and products!"</p>
            <p className="font-semibold">Customer {i}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
export const socialProofConfig: ComponentConfig<SocialProofProps> = {
  fields: { headline: { type: "text" } },
  defaultProps: { headline: "What Our Customers Say" },
};

// AccordionFAQ
export type AccordionFAQProps = { headline?: string };
export const AccordionFAQ: React.FC<AccordionFAQProps> = ({ headline }) => (
  <section className="max-w-7xl mx-auto px-4 py-12">
    <h2 className="text-2xl font-bold mb-8">{headline || "Frequently Asked Questions"}</h2>
    {[1,2,3].map(i => (
      <details key={i} className="mb-4 border rounded-lg p-4">
        <summary className="font-semibold cursor-pointer">Question {i}</summary>
        <p className="mt-2 text-gray-600">Answer to question {i}.</p>
      </details>
    ))}
  </section>
);
export const accordionFAQConfig: ComponentConfig<AccordionFAQProps> = {
  fields: { headline: { type: "text" } },
  defaultProps: { headline: "Frequently Asked Questions" },
};

// ContactForm
export type ContactFormProps = { headline?: string };
export const ContactForm: React.FC<ContactFormProps> = ({ headline }) => (
  <section className="bg-blue-50 py-12">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-8 text-center">{headline || "Get in Touch"}</h2>
      <form className="max-w-md mx-auto space-y-4">
        <input type="text" placeholder="Name" className="w-full border p-2 rounded" />
        <input type="email" placeholder="Email" className="w-full border p-2 rounded" />
        <textarea placeholder="Message" className="w-full border p-2 rounded h-32"></textarea>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Send Message
        </button>
      </form>
    </div>
  </section>
);
export const contactFormConfig: ComponentConfig<ContactFormProps> = {
  fields: { headline: { type: "text" } },
  defaultProps: { headline: "Get in Touch" },
};

// ContentBlock
export type ContentBlockProps = { content?: string };
export const ContentBlock: React.FC<ContentBlockProps> = ({ content }) => (
  <section className="max-w-7xl mx-auto px-4 py-12">
    <div className="prose max-w-none">
      {content || <p>Add your content here.</p>}
    </div>
  </section>
);
export const contentBlockConfig: ComponentConfig<ContentBlockProps> = {
  fields: { content: { type: "textarea" } },
  defaultProps: { content: "Learn more about our business." },
};
