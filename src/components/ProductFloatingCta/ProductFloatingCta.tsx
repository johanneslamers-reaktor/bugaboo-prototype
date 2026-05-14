import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import styles from "./ProductFloatingCta.module.css";

type ProductFloatingCtaProps = {
  brand: BrandId;
  compareAtPrice?: string;
  financing?: {
    monthlyPrice: string;
    provider: string;
  };
  price: string;
  productTitle: string;
  /** Optional handler — double-clicking the CTA triggers it (easter egg). */
  onDoubleClick?: () => void;
};

export function ProductFloatingCta({
  brand,
  compareAtPrice,
  financing,
  price,
  productTitle,
  onDoubleClick,
}: ProductFloatingCtaProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <aside
      className={styles.floatingCta}
      data-brand={brand}
      data-node-id={brand === "joolz" ? "8677:5183" : "8681:5052"}
      aria-label={`Purchase ${productTitle}`}
    >
      <motion.div
        className={styles.shell}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.priceGroup}>
          {compareAtPrice ? (
            <span className={styles.compareAtPrice}>{compareAtPrice}</span>
          ) : null}
          <span className={styles.price}>{price}</span>
        </div>

        <motion.button
          className={styles.button}
          type="button"
          aria-label={`Add ${productTitle} to cart`}
          onDoubleClick={onDoubleClick}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        >
          Add to cart
        </motion.button>
      </motion.div>

      {financing ? (
        <div className={styles.financing}>
          <span>From</span>
          <span className={styles.financingAmount}>{financing.monthlyPrice}</span>
          <span>with</span>
          <span className={styles.financingProvider}>{financing.provider}</span>
          <img
            src={brand === "joolz" ? "/assets/pdp/cta/joolz-info.svg" : "/assets/pdp/cta/bugaboo-info.svg"}
            alt=""
            loading="lazy"
          />
        </div>
      ) : null}
    </aside>
  );
}
