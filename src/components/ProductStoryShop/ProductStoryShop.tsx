import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductStoryShopContent } from "../../data/products";
import styles from "./ProductStoryShop.module.css";

type ProductStoryShopProps = {
  brand: BrandId;
  content: ProductStoryShopContent;
};

type RevealVariant = "lead" | "body";

const fallbackLineLengths: Record<BrandId, Record<RevealVariant, number>> = {
  bugaboo: {
    lead: 28,
    body: 42,
  },
  joolz: {
    lead: 24,
    body: 38,
  },
};

const revealTextMetrics: Record<BrandId, Record<RevealVariant, { font: string; lineHeight: number }>> = {
  bugaboo: {
    lead: {
      font: '400 28px "Aeonik Pro"',
      lineHeight: 29.4,
    },
    body: {
      font: '400 18px "Aeonik Pro"',
      lineHeight: 18.9,
    },
  },
  joolz: {
    lead: {
      font: '500 26px "Value Sans Pro"',
      lineHeight: 29.9,
    },
    body: {
      font: '400 20px "Value Sans Pro"',
      lineHeight: 23,
    },
  },
};

export function ProductStoryShop({ brand, content }: ProductStoryShopProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
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
            brand={brand}
            className={styles.lead}
            progress={scrollYProgress}
            range={[0.02, 0.32]}
            shouldReduceMotion={shouldReduceMotion}
            text={leadText}
            variant="lead"
          />
          <RevealParagraph
            brand={brand}
            className={styles.body}
            progress={scrollYProgress}
            range={[0.3, 0.56]}
            shouldReduceMotion={shouldReduceMotion}
            text={content.body}
            variant="body"
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

function RevealParagraph({
  brand,
  className,
  progress,
  range,
  shouldReduceMotion,
  text,
  variant,
}: {
  brand: BrandId;
  className: string;
  progress: MotionValue<number>;
  range: [number, number];
  shouldReduceMotion: boolean | null;
  text: string;
  variant: RevealVariant;
}) {
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const fallbackLines = useMemo(() => splitTextIntoLines(text, fallbackLineLengths[brand][variant]), [brand, text, variant]);
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [lines, setLines] = useState(fallbackLines);

  useEffect(() => {
    const paragraph = paragraphRef.current;

    if (!paragraph) {
      return undefined;
    }

    const updateWidth = () => {
      const nextWidth = Math.floor(paragraph.getBoundingClientRect().width);
      setLayoutWidth((currentWidth) => (Math.abs(currentWidth - nextWidth) > 1 ? nextWidth : currentWidth));
    };
    const observer = new ResizeObserver(updateWidth);

    updateWidth();
    observer.observe(paragraph);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const updateLines = () => {
      if (isCancelled) {
        return;
      }

      setLines(measureTextLines(text, brand, variant, layoutWidth, fallbackLines));
    };

    updateLines();
    void document.fonts?.ready.then(updateLines);

    return () => {
      isCancelled = true;
    };
  }, [brand, fallbackLines, layoutWidth, text, variant]);

  return (
    <p className={`${className} ${styles.revealParagraph}`} aria-label={text} ref={paragraphRef}>
      <span className={styles.revealLineStack} aria-hidden="true">
        {lines.map((line, index) => (
          <RevealLine
            key={`${line}-${index}`}
            index={index}
            progress={progress}
            range={range}
            shouldReduceMotion={shouldReduceMotion}
            text={line}
            total={lines.length}
          />
        ))}
      </span>
    </p>
  );
}

function measureTextLines(
  text: string,
  brand: BrandId,
  variant: RevealVariant,
  width: number,
  fallbackLines: string[],
) {
  if (width <= 0 || typeof document === "undefined") {
    return fallbackLines;
  }

  try {
    const metrics = revealTextMetrics[brand][variant];
    const prepared = prepareWithSegments(text, metrics.font);
    const layout = layoutWithLines(prepared, width, metrics.lineHeight);
    const lines = layout.lines.map((line) => line.text.trim()).filter(Boolean);

    return lines.length > 0 ? lines : fallbackLines;
  } catch {
    return fallbackLines;
  }
}

function RevealLine({
  index,
  progress,
  range,
  shouldReduceMotion,
  text,
  total,
}: {
  index: number;
  progress: MotionValue<number>;
  range: [number, number];
  shouldReduceMotion: boolean | null;
  text: string;
  total: number;
}) {
  const rangeSize = range[1] - range[0];
  const lineSegment = rangeSize / Math.max(total, 1);
  const lineStart = range[0] + lineSegment * index;
  const lineEnd = Math.min(range[1], lineStart + lineSegment * 0.92);
  const lineReveal = useTransform(progress, [lineStart, lineEnd], ["-2%", "103%"]);
  const lineStyle = {
    "--story-line-reveal": shouldReduceMotion ? "100%" : lineReveal,
  } as CSSProperties;

  return (
    <motion.span className={styles.revealLine} style={lineStyle}>
      {text}
    </motion.span>
  );
}

function splitTextIntoLines(text: string, targetLength: number) {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > targetLength && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      return;
    }

    currentLine = nextLine;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length > 1 && lines[lines.length - 1].length < targetLength * 0.45) {
    const previousWords = lines[lines.length - 2].split(" ");
    const movedWords = previousWords.splice(Math.max(previousWords.length - 2, 1));

    lines[lines.length - 2] = previousWords.join(" ");
    lines[lines.length - 1] = `${movedWords.join(" ")} ${lines[lines.length - 1]}`;
  }

  return lines;
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
