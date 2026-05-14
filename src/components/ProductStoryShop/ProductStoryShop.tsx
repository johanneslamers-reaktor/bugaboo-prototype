import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductStoryShopContent, ProductStoryShopCard } from "../../data/products";
import { Carousel, useCarousel } from "../Carousel";
import styles from "./ProductStoryShop.module.css";

type ProductStoryShopProps = {
  brand: BrandId;
  content: ProductStoryShopContent;
};

export function ProductStoryShop({ brand, content }: ProductStoryShopProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 68%", "end 26%"],
  });
  const leadText = `${content.lead.strong}${content.lead.muted}`;

  const productItems = content.products.map((product) => (
    <ProductCard key={product.id} product={product} shouldReduceMotion={shouldReduceMotion ?? false} />
  ));

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

        <Carousel
          items={productItems}
          gap={12}
          inset={16}
          loop
          /*
           * Explicit itemSize prevents the auto-measure flicker on first
           * paint and matches the CSS fixed card widths so loop math is
           * stable from the first frame.
           */
          itemSize={brand === "joolz" ? 354 : 368}
          ariaLabel="Shoppable product carousel"
          className={styles.productCarousel}
        >
          <StoryControls shouldReduceMotion={shouldReduceMotion ?? false} />
        </Carousel>
      </div>
    </section>
  );
}

function StoryControls({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  const { nextPage, prevPage } = useCarousel();
  return (
    <div className={styles.controls} aria-label="Shoppable products">
      <motion.button
        className={styles.control}
        type="button"
        aria-label="Previous product"
        onClick={prevPage}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
      >
        <span aria-hidden="true" />
      </motion.button>
      <motion.button
        className={styles.control}
        type="button"
        aria-label="Next product"
        onClick={nextPage}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
      >
        <span aria-hidden="true" />
      </motion.button>
    </div>
  );
}

function ProductCard({ product, shouldReduceMotion }: { product: ProductStoryShopCard; shouldReduceMotion: boolean }) {
  return (
    <motion.button
      className={styles.productCard}
      type="button"
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
  );
}

/**
 * Word-by-word reveal driven by scroll progress.
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
  const tokens = text.split(/(\s+)/);
  const wordCount = tokens.filter((token) => token.trim().length > 0).length;

  let wordIndex = -1;

  return (
    <p className={`${className} ${styles.revealParagraph}`} aria-label={text}>
      {tokens.map((token, index) => {
        if (token.trim().length === 0) {
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
  const sliceSize = rangeSize / Math.max(wordCount, 1);
  const wordStart = range[0] + sliceSize * wordIndex;
  const wordEnd = Math.min(range[1], wordStart + sliceSize * 1.6);
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
