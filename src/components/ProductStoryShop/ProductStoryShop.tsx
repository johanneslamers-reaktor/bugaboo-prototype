import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductStoryShopContent } from "../../data/products";
import { useScrollDrag } from "../../hooks/useScrollDrag";
import styles from "./ProductStoryShop.module.css";

type ProductStoryShopProps = {
  brand: BrandId;
  content: ProductStoryShopContent;
};

export function ProductStoryShop({ brand, content }: ProductStoryShopProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const railDrag = useScrollDrag(railRef);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 68%", "end 26%"],
  });
  const leadText = `${content.lead.strong}${content.lead.muted}`;

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
    <section className={styles.section} data-brand={brand} data-node-id={content.nodeId} ref={sectionRef}>
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
          <RevealParagraph
            className={styles.lead}
            progress={scrollYProgress}
            range={[0.02, 0.32]}
            shouldReduceMotion={shouldReduceMotion}
            text={leadText}
          />
          <RevealParagraph
            className={styles.body}
            progress={scrollYProgress}
            range={[0.3, 0.56]}
            shouldReduceMotion={shouldReduceMotion}
            text={content.body}
          />
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

        <div
          className={styles.productRail}
          ref={railRef}
          onScroll={handleScroll}
          data-dragging={railDrag.isDragging ? "true" : "false"}
          aria-label="Shoppable product carousel"
          {...railDrag.handlers}
        >
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

/**
 * Word-by-word reveal driven by scroll progress.
 *
 * Each word's opacity ramps from muted to active as scrollYProgress crosses
 * its slice of the `range`. Words remain inline so the browser wraps the
 * paragraph naturally — no nowrap, no pre-measured line counts, no overflow.
 */
function RevealParagraph({
  className,
  progress,
  range,
  shouldReduceMotion,
  text,
}: {
  className: string;
  progress: MotionValue<number>;
  range: [number, number];
  shouldReduceMotion: boolean | null;
  text: string;
}) {
  // Split on whitespace, keep words and spaces separately so layout matches source.
  const tokens = text.split(/(\s+)/);
  const wordCount = tokens.filter((token) => token.trim().length > 0).length;

  let wordIndex = -1;

  return (
    <p className={`${className} ${styles.revealParagraph}`} aria-label={text}>
      {tokens.map((token, index) => {
        if (token.trim().length === 0) {
          // Preserve whitespace as plain text so the browser wraps naturally.
          return <span key={`space-${index}`}>{token}</span>;
        }

        wordIndex += 1;
        return (
          <RevealWord
            key={`word-${index}`}
            wordIndex={wordIndex}
            wordCount={wordCount}
            progress={progress}
            range={range}
            shouldReduceMotion={shouldReduceMotion}
            text={token}
          />
        );
      })}
    </p>
  );
}

function RevealWord({
  wordIndex,
  wordCount,
  progress,
  range,
  shouldReduceMotion,
  text,
}: {
  wordIndex: number;
  wordCount: number;
  progress: MotionValue<number>;
  range: [number, number];
  shouldReduceMotion: boolean | null;
  text: string;
}) {
  const rangeSize = range[1] - range[0];
  // Each word reveals over ~1.6 word-slices so adjacent words overlap, giving
  // a sweeping read-along feel rather than choppy on/off transitions.
  const sliceSize = rangeSize / Math.max(wordCount, 1);
  const wordStart = range[0] + sliceSize * wordIndex;
  const wordEnd = Math.min(range[1], wordStart + sliceSize * 1.6);
  // Drive a 0%→100% mix between the muted and active story colors via
  // CSS `color-mix`. Per-brand colors are set in CSS; this just animates
  // the percentage so every word smoothly resolves to white (bugaboo)
  // or deep blue (joolz).
  const reveal = useTransform(progress, [wordStart, wordEnd], ["0%", "100%"]);

  if (shouldReduceMotion) {
    return <span className={styles.revealWord} style={{ "--word-reveal": "100%" } as React.CSSProperties}>{text}</span>;
  }

  return (
    <motion.span
      className={styles.revealWord}
      style={{ "--word-reveal": reveal } as React.CSSProperties}
    >
      {text}
    </motion.span>
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
