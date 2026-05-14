import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductImpactContent, ProductImpactItem } from "../../data/products";
import { ENTRANCE_ZOOM } from "../../lib/motion-presets";
import styles from "./ProductImpact.module.css";

type ProductImpactProps = {
  brand: BrandId;
  content: ProductImpactContent;
};

export function ProductImpact({ brand, content }: ProductImpactProps) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section className={styles.impact} data-brand={brand} data-node-id={content.nodeId}>
      <div className={styles.hero}>
        <figure className={styles.heroMedia}>
          <motion.img
            {...(shouldReduceMotion ? {} : ENTRANCE_ZOOM)}
            src={content.hero.imageSrc}
            alt={content.hero.imageAlt}
            loading="eager"
            decoding="async"
          />
        </figure>
        <div className={styles.heroCopy}>
          <h2>{content.hero.title}</h2>
          <p>{content.hero.subtitle}</p>
        </div>
      </div>

      <ul className={styles.list} aria-label="Product benefits">
        {content.items.map((item, index) => (
          <li
            className={styles.item}
            data-node-id={getItemNodeId(brand, index)}
            key={item.label}
          >
            <span className={styles.iconFrame} aria-hidden="true">
              <ImpactIcon item={item} />
            </span>
            <span className={styles.itemLabel}>{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function getItemNodeId(brand: BrandId, index: number) {
  if (brand === "joolz") {
    return ["8677:5123", "8677:5128", "8677:5133"][index] ?? "8677:5123";
  }

  return ["8663:3992", "8663:3995", "8663:3998"][index] ?? "8663:3992";
}

function ImpactIcon({ item }: { item: ProductImpactItem }) {
  if (item.iconSrc) {
    return <img className={styles.iconImage} src={item.iconSrc} alt={item.iconAlt ?? ""} loading="lazy" />;
  }

  if (item.id === "footprint") {
    return (
      <svg className={styles.icon} viewBox="0 0 48 48" aria-hidden="true">
        <rect x="1" y="1" width="46" height="46" rx="8" />
        <path d="M26.4 13.4c5.4 1.2 8.6 5.1 8.6 10 0 5.8-4.5 10.6-10.7 10.6-6.6 0-11.3-4.8-11.3-10.7 0-3.9 2.1-7.2 5.2-9" />
        <path d="m27.1 10.9-.7 5.3 5.1-1.5" />
        <path d="M22.4 16.9c-1.3 2.4-4.4 3.3-4.4 6.1a4.4 4.4 0 0 0 8.8 0c0-2.8-3.1-3.7-4.4-6.1Z" />
      </svg>
    );
  }

  if (item.id === "warranty") {
    return (
      <svg className={styles.icon} viewBox="0 0 48 48" aria-hidden="true">
        <path d="m24 3.5 4.4 3.6 5.7-.5 2 5.3 4.9 2.9-1.5 5.5 1.5 5.5-4.9 2.9-2 5.3-5.7-.5L24 37.1l-4.4-3.6-5.7.5-2-5.3-4.9-2.9 1.5-5.5L7 14.8l4.9-2.9 2-5.3 5.7.5L24 3.5Z" />
        <circle cx="24" cy="20.3" r="10.8" />
        <path d="M24 15.2v10.2" />
        <path d="M20.3 19h3.7a3.2 3.2 0 0 1 0 6.4h-3.7" />
      </svg>
    );
  }

  return (
    <svg className={styles.icon} viewBox="0 0 48 48" aria-hidden="true">
      <rect x="1" y="1" width="46" height="46" rx="8" />
      <path d="M13 15.5h22" />
      <path d="M13 22.5h22" />
      <path d="M13 29.5h22" />
      <path d="M18.5 10.5v27" />
      <path d="M29.5 10.5v27" />
    </svg>
  );
}
