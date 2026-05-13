import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductBundleContent } from "../../data/products";
import styles from "./ProductBundle.module.css";

type ProductBundleProps = {
  brand: BrandId;
  content: ProductBundleContent;
};

export function ProductBundle({ brand, content }: ProductBundleProps) {
  const [selectedFilter, setSelectedFilter] = useState(content.filters[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={styles.bundle} data-brand={brand} data-node-id={content.nodeId}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2>{content.heading}</h2>
      </div>

      <div className={styles.filters} aria-label="Bundle type">
        {content.filters.map((filter) => (
          <button
            className={styles.filterButton}
            data-active={selectedFilter === filter ? "true" : "false"}
            type="button"
            aria-pressed={selectedFilter === filter}
            onClick={() => setSelectedFilter(filter)}
            key={filter}
          >
            {filter}
          </button>
        ))}
      </div>

      <article className={styles.bundleCard} aria-label={content.title}>
        <figure className={styles.hero}>
          <img src={content.heroImageSrc} alt={content.heroImageAlt} loading="lazy" decoding="async" />
          <span className={styles.saveBadge}>{content.saveLabel}</span>
          <button
            className={styles.wishlistButton}
            type="button"
            aria-label={isWishlisted ? `Remove ${content.title} from wishlist` : `Add ${content.title} to wishlist`}
            aria-pressed={isWishlisted}
            onClick={() => setIsWishlisted((current) => !current)}
          >
            <img src="/assets/pdp/bundles/bugaboo/heart.svg" alt="" loading="lazy" />
          </button>
          <figcaption className={styles.heroCaption}>
            <span>{content.brandLabel}</span>
            <strong>{content.title}</strong>
          </figcaption>
        </figure>

        <div className={styles.productGrid} aria-label="Bundle contents">
          {content.items.map((item, index) => (
            <div
              className={styles.productTile}
              data-large={index === 0 ? "true" : "false"}
              key={item.id}
            >
              <img src={item.imageSrc} alt={item.imageAlt} loading="lazy" decoding="async" draggable={false} />
              <img className={styles.plusIcon} src="/assets/pdp/bundles/bugaboo/plus.svg" alt="" loading="lazy" />
            </div>
          ))}
        </div>

        <motion.div
          className={styles.buyWidget}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.bundlePrice}>
            <span className={styles.thumbnail}>
              <img src={content.thumbnailSrc} alt={content.thumbnailAlt} loading="lazy" decoding="async" />
            </span>
            <span className={styles.compareAt}>{content.compareAtPrice}</span>
            <span className={styles.price}>{content.price}</span>
          </div>
          <motion.button
            className={styles.cta}
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          >
            {content.ctaLabel}
          </motion.button>
        </motion.div>
      </article>
    </section>
  );
}
