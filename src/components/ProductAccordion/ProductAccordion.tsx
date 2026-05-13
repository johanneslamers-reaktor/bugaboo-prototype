import { useId, useState } from "react";
import { AnimatePresence, motion, type Transition, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductAccordionItem } from "../../data/products";
import styles from "./ProductAccordion.module.css";

type ProductAccordionProps = {
  brand: BrandId;
  items: ProductAccordionItem[];
};

export function ProductAccordion({ brand, items }: ProductAccordionProps) {
  const baseId = useId();
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const panelTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : {
        height: { duration: 0.36, ease: smoothEase },
        opacity: { duration: 0.18, ease: "easeOut" },
      };
  const iconTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: smoothEase };

  return (
    <section className={styles.accordion} data-brand={brand} data-node-id="8618:3520">
      {items.map((item, index) => {
        const isOpen = openItemId === item.id;
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <motion.div
            className={styles.item}
            data-open={isOpen ? "true" : "false"}
            layout
            key={item.id}
          >
            <h2 className={styles.heading}>
              <button
                className={styles.trigger}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                id={buttonId}
                data-node-id={getListItemNodeId(brand, index)}
                onClick={() => setOpenItemId((current) => (current === item.id ? null : item.id))}
              >
                <span>{item.title}</span>
                <motion.span
                  className={styles.iconShell}
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={iconTransition}
                >
                  <PlusIcon />
                </motion.span>
              </button>
            </h2>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  className={styles.panel}
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={panelTransition}
                >
                  <div className={styles.panelInner}>
                    <PanelContent item={item} />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </section>
  );
}

function PanelContent({ item }: { item: ProductAccordionItem }) {
  if (!item.panel) {
    return (
      <div className={styles.fallbackContent}>
        {item.content?.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    );
  }

  if (item.panel.type === "features") {
    return (
      <div className={styles.featurePanel} data-node-id={item.panel.nodeId}>
        <section className={styles.featureDetailSection}>
          <h3 className={styles.panelHeading}>{item.panel.heading}</h3>
          <ul className={styles.featureList}>
            {item.panel.features.map((feature) => (
              <li className={styles.featureItem} key={feature.title}>
                <span className={styles.featureMedia}>
                  <img
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    loading="lazy"
                    decoding="async"
                    style={{
                      objectPosition: feature.imagePosition,
                      transform: feature.imageScale ? `scale(${feature.imageScale})` : undefined,
                    }}
                  />
                </span>
                <span className={styles.featureText}>{feature.title}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.keyFeatureSection}>
          <h3 className={styles.panelHeading}>{item.panel.otherHeading}</h3>
          <ul className={styles.bulletList}>
            {item.panel.otherFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  if (item.panel.type === "specifications") {
    return (
      <div className={styles.specPanel} data-node-id={item.panel.nodeId}>
        {item.panel.sections.map((section, index) => (
          <section
            className={styles.specSection}
            data-image={section.imageSrc ? "true" : "false"}
            key={`${section.title ?? section.imageSrc}-${index}`}
          >
            {section.imageSrc ? (
              <img
                className={styles.specImage}
                src={section.imageSrc}
                alt={section.imageAlt ?? ""}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <>
                {section.title ? <h3 className={styles.panelHeading}>{section.title}</h3> : null}
                {section.bullets ? (
                  <ul className={styles.bulletList}>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {section.text ? <p className={styles.specText}>{section.text}</p> : null}
              </>
            )}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.boxPanel} data-node-id={item.panel.nodeId}>
      <figure className={styles.boxHero}>
        <img src={item.panel.imageSrc} alt={item.panel.imageAlt} loading="lazy" decoding="async" />
      </figure>
      <div className={styles.boxList}>
        {item.panel.items.map((boxItem) => (
          <article className={styles.boxItem} key={boxItem.title}>
            <h3>{boxItem.title}</h3>
            <p>{boxItem.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function getListItemNodeId(brand: BrandId, index: number) {
  if (brand === "joolz") {
    return ["8677:5083", "8677:5093", "8677:5103"][index] ?? "8677:5083";
  }

  if (index === 0) {
    return "8618:3522";
  }

  if (index === 1) {
    return "8618:3532";
  }

  return "8618:3542";
}

function PlusIcon() {
  return (
    <svg className={styles.plusIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
