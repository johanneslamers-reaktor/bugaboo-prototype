import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductReasonsCarouselContent } from "../../data/products";
import styles from "./ProductReasonsCarousel.module.css";

const AUTOPLAY_INTERVAL_MS = 4000;

type Props = {
  brand: BrandId;
  content: ProductReasonsCarouselContent;
};

export function ProductReasonsCarousel({ brand, content }: Props) {
  const items = content.items;
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || isPaused || items.length < 2) return;
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [shouldReduceMotion, isPaused, items.length]);

  if (items.length === 0) return null;
  const item = items[index]!;

  return (
    <section
      className={styles.section}
      data-brand={brand}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-label="Reasons to buy"
    >
      <div className={styles.card}>
        <motion.div
          key={item.id}
          className={styles.row}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          aria-live="polite"
        >
          <img
            className={styles.icon}
            src={item.iconSrc}
            alt=""
            draggable={false}
            loading="lazy"
          />
          <span className={styles.label}>{item.label}</span>
        </motion.div>
        <div className={styles.dashes}>
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              className={styles.dash}
              data-active={i === index}
              onClick={() => setIndex(i)}
              aria-label={`Show reason ${i + 1}: ${it.label}`}
              aria-current={i === index ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
