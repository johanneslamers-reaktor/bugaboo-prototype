import type { BrandId } from "../../brands/brands";
import type { FooterContent } from "../../data/footer";
import styles from "./Footer.module.css";

type FooterProps = {
  brand: BrandId;
  content: FooterContent;
};

/**
 * Static brand footer for the prototype. Modeled on joolz.com and
 * bugaboo.com so test participants see the rest of the site context
 * below the PDP without us implementing real navigation, login, or
 * the newsletter form. Every interactive control is decorative.
 */
export function Footer({ brand, content }: FooterProps) {
  return (
    <footer className={styles.footer} data-brand={brand}>
      <div className={styles.inner}>
        {brand === "bugaboo" ? (
          <span className={styles.brandMark} aria-label={content.logoLabel}>
            <BugabooMark />
          </span>
        ) : (
          <p className={styles.wordmark}>{content.logoLabel}</p>
        )}

        <ul className={styles.sections}>
          {content.sections.map((section) => (
            <li className={styles.section} key={section.heading}>
              <button className={styles.sectionTrigger} type="button" aria-expanded="false">
                <span>{section.heading}</span>
                <ChevronDown />
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.newsletter}>
          <h3 className={styles.newsletterHeading}>{content.newsletter.heading}</h3>
          <p className={styles.newsletterSubheading}>{content.newsletter.subheading}</p>

          <div className={styles.field}>
            <span className={styles.fieldInput}>{content.newsletter.emailPlaceholder}</span>
          </div>

          {content.newsletter.ownerQuestion ? (
            <div className={styles.ownerRow}>
              <p className={styles.ownerLabel}>{content.newsletter.ownerQuestion.label}</p>
              <div className={styles.ownerOptions}>
                {content.newsletter.ownerQuestion.options.map((option) => (
                  <span className={styles.radio} key={option}>
                    <span className={styles.radioDot} aria-hidden="true" />
                    {option}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {content.newsletter.dueMonthLabel ? (
            <div className={styles.field}>
              <span className={styles.fieldInput}>{content.newsletter.dueMonthLabel}</span>
              <CalendarIcon />
            </div>
          ) : null}

          {content.newsletter.consentText ? (
            <label className={styles.consent}>
              <span className={styles.checkbox} aria-hidden="true" />
              <span>
                {content.newsletter.consentText}{" "}
                {content.newsletter.consentLinkLabel ? (
                  <a className={styles.consentLink}>{content.newsletter.consentLinkLabel}</a>
                ) : null}
              </span>
            </label>
          ) : null}

          <button className={styles.submit} type="button">
            {content.newsletter.submitLabel}
          </button>

          {content.newsletter.privacyDisclaimer ? (
            <p className={styles.disclaimer}>{content.newsletter.privacyDisclaimer}</p>
          ) : null}
          {content.newsletter.marketingDisclaimer ? (
            <p className={styles.disclaimerMuted}>{content.newsletter.marketingDisclaimer}</p>
          ) : null}
        </div>

        {brand === "bugaboo" ? <BCorpBadge /> : null}

        <div className={styles.payments}>
          <p className={styles.paymentsHeading}>{content.payments.heading}</p>
          <ul className={styles.paymentList}>
            {content.payments.methods.map((method) => (
              <li className={styles.paymentBadge} key={method}>
                {method}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.contact}>
          <div className={styles.contactLeft}>
            <p className={styles.countryRow}>
              <CountrySwatch />
              <span className={styles.countryLabel}>
                <span className={styles.countryAccent}>country selector</span>
                <span>{content.contact.countryLabel}</span>
              </span>
            </p>
            <ul className={styles.utilityList}>
              {content.contact.utilityLinks.map((link) => (
                <li className={styles.utilityItem} key={link.label}>
                  {link.icon === "user" ? <UserIcon /> : <PinIcon />}
                  <span>{link.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.contactRight}>
            <h4 className={styles.contactHeading}>{content.contact.contactHeading}</h4>
            <p className={styles.contactPhone}>{content.contact.phone}</p>
            <p className={styles.contactHours}>{content.contact.hours}</p>
          </div>
        </div>
      </div>

      <div className={styles.legal}>
        <ul className={styles.legalLinks}>
          {content.legal.links.map((link, index) => (
            <li key={link.label} className={styles.legalLink}>
              <span>{link.label}</span>
              {index < content.legal.links.length - 1 ? (
                <span className={styles.legalSeparator} aria-hidden="true">
                  |
                </span>
              ) : null}
            </li>
          ))}
        </ul>
        <p className={styles.copyright}>{content.copyright}</p>
      </div>
    </footer>
  );
}

function ChevronDown() {
  return (
    <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className={styles.utilityIcon} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M4 20c1.4-3.6 4.4-5 8-5s6.6 1.4 8 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className={styles.utilityIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7-7.1-7-12a7 7 0 1 1 14 0c0 4.9-7 12-7 12z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BugabooMark() {
  // Real Bugaboo circular brand mark, traced from their safari-pinned-tab
  // favicon at bugaboo.com. Rendered as <img> so the 13 KB single-path
  // SVG isn't inlined into the JS bundle.
  return (
    <img className={styles.brandMarkSvg} src="/assets/brand/bugaboo-mark.svg" alt="" />
  );
}

function BCorpBadge() {
  return (
    <div className={styles.bcorp} aria-label="Certified B Corporation">
      <span className={styles.bcorpEyebrow}>Certified</span>
      <svg className={styles.bcorpMark} viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" fill="none" />
        <path
          d="M19 14h8c3 0 5 2 5 4.5 0 2-1 3.4-2.5 4 1.9.5 3.5 2 3.5 4.4 0 3.2-2.5 5.1-6 5.1h-8V14z"
          fill="currentColor"
        />
        <path d="M22 18v4h4.5c1 0 1.7-.7 1.7-1.9 0-1.2-.7-2-1.7-2H22zm0 7v4.5h5c1.2 0 2-.8 2-2.2s-.8-2.3-2-2.3h-5z" fill="#000000" />
      </svg>
      <span className={styles.bcorpFoot}>Corporation</span>
    </div>
  );
}

function CountrySwatch() {
  return (
    <svg className={styles.countrySwatch} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1" fill="#ffffff" />
      <rect x="1" y="4.5" width="22" height="5" fill="#ae1c28" />
      <rect x="1" y="14.5" width="22" height="5" fill="#21468b" />
    </svg>
  );
}
