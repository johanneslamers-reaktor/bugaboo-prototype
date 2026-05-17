import type { BrandId } from "../brands/brands";

/**
 * Static footer content. Mirrors what is on joolz.com / bugaboo.com today
 * so the prototype PDPs feel anchored to the real product when shown to
 * test participants. Nothing here is interactive — links don't navigate,
 * the newsletter form doesn't submit, the country selector doesn't open.
 */
export type FooterContent = {
  brand: BrandId;
  /** Brand wordmark / logo line. */
  logoLabel: string;
  /** Collapsible link sections. Rendered visually closed in the prototype. */
  sections: FooterSection[];
  newsletter: FooterNewsletter;
  payments: FooterPayments;
  contact: FooterContactBlock;
  legal: FooterLegal;
  copyright: string;
};

export type FooterSection = {
  heading: string;
  links: { label: string }[];
};

export type FooterNewsletter = {
  heading: string;
  subheading: string;
  emailPlaceholder: string;
  /** Joolz-style "are you a proud owner?" radio row. Omit on Bugaboo. */
  ownerQuestion?: {
    label: string;
    options: string[];
  };
  /** Bugaboo-style "Baby's due month" dropdown. Omit on Joolz. */
  dueMonthLabel?: string;
  /**
   * Joolz uses a small inline "I accept the privacy statement" checkbox.
   * Bugaboo has no checkbox — the form is followed by paragraphs of
   * disclaimer copy. Use whichever pattern matches the brand.
   */
  consentText?: string;
  consentLinkLabel?: string;
  /** Long Bugaboo-style paragraph that sits between the form and the button. */
  privacyDisclaimer?: string;
  /** Long Bugaboo-style paragraph that sits below the button. */
  marketingDisclaimer?: string;
  submitLabel: string;
};

export type FooterPayments = {
  heading: string;
  /** Identifiers rendered as small text marks inline (no logo licensing). */
  methods: string[];
};

export type FooterContactBlock = {
  countryLabel: string;
  /** Below the country selector — "Login / Register", "Locate Stores", etc. */
  utilityLinks: { label: string; icon: "user" | "pin" }[];
  contactHeading: string;
  phone: string;
  hours: string;
};

export type FooterLegal = {
  links: { label: string }[];
};

export const footerContent: Record<BrandId, FooterContent> = {
  joolz: {
    brand: "joolz",
    logoLabel: "JOOLZ",
    sections: [
      {
        heading: "Shop",
        links: [{ label: "Strollers" }, { label: "Accessories" }, { label: "Spare parts" }],
      },
      {
        heading: "About Joolz",
        links: [
          { label: "Our story" },
          { label: "Birth forest" },
          { label: "10-Year transferable warranty" },
          { label: "Reviews" },
        ],
      },
      {
        heading: "Customer service",
        links: [
          { label: "Frequently asked questions" },
          { label: "Store locator" },
          { label: "Manuals" },
          { label: "Contact us" },
        ],
      },
    ],
    newsletter: {
      heading: "Be the first to know",
      subheading: "Receive positive news, events and promotions.",
      emailPlaceholder: "Email",
      ownerQuestion: {
        label: "are you a proud owner of a Joolz stroller?",
        options: ["Yes", "No"],
      },
      consentText:
        "Sign me up for the Joolz newsletter. Yes, I understand and accept the",
      consentLinkLabel: "privacy statement",
      submitLabel: "Subscribe",
    },
    payments: {
      heading: "Secure payment via:",
      methods: ["iDEAL", "Mastercard", "VISA", "Klarna", "PayPal"],
    },
    contact: {
      countryLabel: "EN / NL",
      utilityLinks: [
        { label: "Login / Register", icon: "user" },
        { label: "Locate Stores", icon: "pin" },
      ],
      contactHeading: "Online store",
      phone: "+31 20 630 48 87",
      hours: "Monday to Friday:\n10:00h - 16:00h (GMT+2)",
    },
    legal: {
      links: [
        { label: "Sitemap" },
        { label: "Terms and Conditions" },
        { label: "Warranty conditions" },
        { label: "Privacy Policy" },
        { label: "Cookie policy" },
      ],
    },
    copyright: "© Joolz 2023",
  },
  bugaboo: {
    brand: "bugaboo",
    logoLabel: "bugaboo",
    sections: [
      {
        heading: "Shopping online",
        links: [
          { label: "Track your order" },
          { label: "Returns" },
          { label: "100 day money-back guarantee" },
          { label: "Cookie policy" },
          { label: "Cookie preferences" },
        ],
      },
      {
        heading: "Customer support",
        links: [
          { label: "Support" },
          { label: "Register your product" },
          { label: "Sign in" },
          { label: "Find a retailer" },
          { label: "FAQ's" },
          { label: "Warranty" },
        ],
      },
      {
        heading: "About us",
        links: [
          { label: "We are Bugaboo" },
          { label: "Sustainability" },
          { label: "Bugaboo jobs" },
          { label: "Press" },
          { label: "Blog" },
        ],
      },
      {
        heading: "Contact us",
        links: [
          { label: "Monday – Friday 09:00 – 17:00" },
          { label: "Contact us" },
        ],
      },
    ],
    newsletter: {
      heading: "Sign up to receive our newsletters",
      subheading: "",
      emailPlaceholder: "Your email *",
      dueMonthLabel: "Baby's Due Month (optional)",
      privacyDisclaimer:
        "Sharing your due month is entirely up to you. If you choose to do so, we'll use it to tailor our marketing communications so they're more relevant to you. You can find more details about how we use and protect your data in our Privacy Policy",
      marketingDisclaimer:
        "By clicking “Sign up”, I agree to receive marketing communications from Bugaboo in accordance with the Terms & Conditions. and Privacy Policy This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.",
      submitLabel: "Sign up",
    },
    payments: {
      heading: "We accept:",
      methods: ["VISA", "Mastercard", "Amex", "PayPal", "Klarna", "Apple Pay"],
    },
    contact: {
      countryLabel: "🇳🇱 Netherlands — EN",
      utilityLinks: [
        { label: "Sign in", icon: "user" },
        { label: "Find a retailer", icon: "pin" },
      ],
      contactHeading: "Contact us",
      phone: "+31 20 421 21 21",
      hours: "Monday – Friday\n09:00 – 17:00",
    },
    legal: {
      links: [
        { label: "Terms & Conditions" },
        { label: "Privacy Policy" },
        { label: "Cookie statement" },
        { label: "Accessibility" },
        { label: "Disclaimer" },
      ],
    },
    copyright: "© Bugaboo International B.V.",
  },
};
