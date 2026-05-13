import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductStoryShopContent } from "../../data/products";
import styles from "./ProductStoryShop.module.css";

type ProductStoryShopProps = {
  brand: BrandId;
  content: ProductStoryShopContent;
};

export function ProductStoryShop({ brand, content }: ProductStoryShopProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const scrollToIndex = useCallback((index: number) => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const nextIndex = Math.max(0, Math.min(content.products.length - 1, index));
    const card = rail.children.item(nextIndex) as HTMLElement | null;

    if (!card) {
      return;
    }

    rail.scrollTo({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      left: card.offsetLeft - rail.offsetLeft,
    });
    setActiveIndex(nextIndex);
  }, [content.products.length, shouldReduceMotion]);

  const handleScroll = useCallback(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const cards = Array.from(rail.children) as HTMLElement[];
    const nearestIndex = cards.reduce((closestIndex, card, index) => {
      const closestDistance = Math.abs(cards[closestIndex].offsetLeft - rail.scrollLeft);
      const distance = Math.abs(card.offsetLeft - rail.scrollLeft);

      return distance < closestDistance ? index : closestIndex;
    }, 0);

    setActiveIndex(nearestIndex);
  }, []);

  const controls = (
    <div className={styles.controls} aria-label="Shoppable products">
      <motion.button
        className={styles.control}
        type="button"
        aria-label="Previous product"
        disabled={activeIndex === 0}
        onClick={() => scrollToIndex(activeIndex - 1)}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
      >
        <span aria-hidden="true" />
      </motion.button>
      <motion.button
        className={styles.control}
        type="button"
        aria-label="Next product"
        disabled={activeIndex === content.products.length - 1}
        onClick={() => scrollToIndex(activeIndex + 1)}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
      >
        <span aria-hidden="true" />
      </motion.button>
    </div>
  );

  return (
    <section className={styles.section} data-brand={brand} data-node-id={content.nodeId}>
      {content.decorationSrc ? (
        <img className={styles.decoration} src={content.decorationSrc} alt={content.decorationAlt ?? ""} aria-hidden="true" />
      ) : null}

      <div className={styles.copy}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <StoryTitle title={content.title} />
        <div className={styles.author}>
          <img src={content.author.avatarSrc} alt={content.author.avatarAlt} loading="lazy" decoding="async" />
          <p>
            <strong>{content.author.name}</strong>
            <span>{content.author.role}</span>
          </p>
        </div>

        <div className={styles.storyCopy}>
          <p className={styles.lead}>
            <span>{content.lead.strong}</span>
            <span>{content.lead.muted}</span>
          </p>
          <p className={styles.body}>{content.body}</p>
        </div>

        <a className={styles.storyLink} href="#stories">
          <span className={styles.storyLinkIcon} aria-hidden="true" />
          <span>{content.ctaLabel}</span>
        </a>
      </div>

      <div className={styles.mediaArea}>
        <motion.figure
          className={styles.inspiration}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={content.inspirationImage.src}
            alt={content.inspirationImage.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            style={{ objectPosition: content.inspirationImage.objectPosition }}
          />
        </motion.figure>

        <div className={styles.productRail} ref={railRef} onScroll={handleScroll} aria-label="Shoppable product carousel">
          {content.products.map((product) => (
            <motion.button
              className={styles.productCard}
              type="button"
              key={product.id}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
            >
              <span className={styles.productImage}>
                <img src={product.imageSrc} alt={product.imageAlt} loading="lazy" decoding="async" draggable={false} />
              </span>
              <span className={styles.productCopy}>
                <strong>{product.label}</strong>
                <span>{product.title}</span>
                <span>{product.subtitle}</span>
              </span>
              <span className={styles.productIcon} aria-hidden="true" />
            </motion.button>
          ))}
        </div>

        {controls}
      </div>
    </section>
  );
}

function StoryTitle({ title }: { title: ProductStoryShopContent["title"] }) {
  if (title.kind === "highlight") {
    return (
      <h2 className={styles.title}>
        {title.lines.map((line) => (
          <mark key={`${line.text}-${line.emphasis ?? ""}`}>
            {line.text}
            {line.emphasis ? <em>{line.emphasis}</em> : null}
          </mark>
        ))}
      </h2>
    );
  }

  return (
    <h2 className={styles.title}>
      {title.lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </h2>
  );
}
