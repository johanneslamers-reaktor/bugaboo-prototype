import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductBundleContent } from "../../data/products";
import { ENTRANCE_ZOOM } from "../../lib/motion-presets";
import styles from "./ProductBundle.module.css";

type ProductBundleProps = {
  brand: BrandId;
  content: ProductBundleContent;
};

export function ProductBundle({ brand, content }: ProductBundleProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(content.variants[0]?.id);
  const [wishlistedByVariant, setWishlistedByVariant] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();
  const variant = content.variants.find((v) => v.id === selectedVariantId) ?? content.variants[0];

  // Preload all variant images on mount so tab switches feel instant.
  useEffect(() => {
    content.variants.forEach((v) => {
      [v.heroImageSrc, v.thumbnailSrc, ...v.items.map((i) => i.imageSrc)].forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
  }, [content.variants]);

  if (!variant) return null;
  const isWishlisted = wishlistedByVariant[variant.id] === true;

  return (
    <section className={styles.bundle} data-brand={brand} data-node-id={content.nodeId}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2>{content.heading}</h2>
      </div>

      <div className={styles.filters} aria-label="Bundle type">
        {content.variants.map((v) => (
          <button
            className={styles.filterButton}
            data-active={selectedVariantId === v.id ? "true" : "false"}
            type="button"
            aria-pressed={selectedVariantId === v.id}
            onClick={() => setSelectedVariantId(v.id)}
            key={v.id}
          >
            {v.label}
          </button>
        ))}
      </div>

      <article className={styles.bundleCard} aria-label={variant.title}>
        <figure className={styles.hero}>
          <motion.img
            {...(shouldReduceMotion ? {} : ENTRANCE_ZOOM)}
            src={variant.heroImageSrc}
            alt={variant.heroImageAlt}
            loading="eager"
            decoding="async"
          />
          <span className={styles.saveBadge}>{variant.saveLabel}</span>
          <button
            className={styles.wishlistButton}
            type="button"
            aria-label={isWishlisted ? `Remove ${variant.title} from wishlist` : `Add ${variant.title} to wishlist`}
            aria-pressed={isWishlisted}
            onClick={() =>
              setWishlistedByVariant((current) => ({
                ...current,
                [variant.id]: !current[variant.id],
              }))
            }
          >
            <img src="/assets/pdp/bundles/bugaboo/heart.svg" alt="" loading="eager" />
          </button>
          <figcaption className={styles.heroCaption}>
            <span>
              {variant.brandLabel}
              {variant.productHighlight ? (
                <em className={styles.captionHighlight}>{variant.productHighlight}</em>
              ) : null}
            </span>
            <strong>{variant.title}</strong>
          </figcaption>
        </figure>

        <div
          className={styles.productGrid}
          data-tile-count={variant.items.length}
          aria-label="Bundle contents"
        >
          {variant.items.map((item, index) => (
            <div
              className={styles.productTile}
              data-large={index === 0 ? "true" : "false"}
              key={item.id}
            >
              <img src={item.imageSrc} alt={item.imageAlt} loading="eager" decoding="async" draggable={false} />
              <img className={styles.plusIcon} src="/assets/pdp/bundles/bugaboo/plus.svg" alt="" loading="eager" />
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
              <img src={variant.thumbnailSrc} alt={variant.thumbnailAlt} loading="eager" decoding="async" />
            </span>
            <span className={styles.compareAt}>{variant.compareAtPrice}</span>
            <span className={styles.price}>{variant.price}</span>
          </div>
          <motion.button
            className={styles.cta}
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          >
            {variant.ctaLabel}
          </motion.button>
        </motion.div>
      </article>
    </section>
  );
}
