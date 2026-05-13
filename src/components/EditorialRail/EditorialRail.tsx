import type { CSSProperties, KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { animate, type AnimationPlaybackControls, motion, useMotionValue, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { EditorialCardItem, EditorialRailContent } from "../../data/homepage";
import styles from "./EditorialRail.module.css";

const CARD_WIDTH = 344;
const CARD_GAP: Record<BrandId, number> = {
  bugaboo: 10,
  joolz: 8,
};

type EditorialRailProps = {
  brand: BrandId;
  content: EditorialRailContent;
};

function EditorialHeading({ content }: { content: EditorialRailContent }) {
  if (content.title.kind === "highlight") {
    return (
      <h2 className={styles.highlightTitle}>
        <span className={styles.highlightTitleBase}>{content.title.before}</span>
        <span className={styles.highlightTitleMark}>{content.title.highlight}</span>
      </h2>
    );
  }

  return (
    <h2 className={styles.plainTitle}>
      {content.title.lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </h2>
  );
}

function StoryTitle({ item }: { item: EditorialCardItem }) {
  return (
    <>
      {item.title.map((segment, index) => (
        <span className={segment.serif ? styles.serifSegment : undefined} key={`${segment.text}-${index}`}>
          {segment.text}
        </span>
      ))}
    </>
  );
}

function BugabooStoryCard({ item, index }: { item: EditorialCardItem; index: number }) {
  return (
    <article className={styles.storyCard} data-card={item.id}>
      <img
        className={styles.storyImage}
        src={item.imageSrc}
        alt={item.imageAlt}
        loading={index === 0 ? "eager" : "lazy"}
        draggable={false}
      />
      <div className={styles.bugabooStoryContent}>
        <div className={styles.bugabooStoryHeader}>
          <p className={styles.bugabooEyebrow}>{item.eyebrow}</p>
          <h3 className={styles.bugabooStoryTitle}>
            <StoryTitle item={item} />
          </h3>
        </div>
        <a className={styles.readMore} href="#stories">
          Read more
        </a>
      </div>
    </article>
  );
}

function JoolzStoryCard({ item, index }: { item: EditorialCardItem; index: number }) {
  return (
    <article
      className={styles.storyCard}
      data-card={item.id}
      style={{ "--story-color": item.color } as CSSProperties}
    >
      <div className={styles.joolzStoryContent}>
        <div className={styles.joolzStoryHeader}>
          <p className={styles.joolzEyebrow}>{item.eyebrow}</p>
          <h3 className={styles.joolzStoryTitle}>
            <StoryTitle item={item} />
          </h3>
        </div>
        <img
          className={styles.joolzStoryImage}
          src={item.imageSrc}
          alt={item.imageAlt}
          loading={index === 0 ? "eager" : "lazy"}
          draggable={false}
        />
        <a className={styles.readMore} href="#stories">
          Read more
        </a>
      </div>
    </article>
  );
}

export function EditorialRail({ brand, content }: EditorialRailProps) {
  const shouldReduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const activeIndexRef = useRef(0);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardInitial = shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 };
  const cardAnimate = shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 };
  const itemCount = content.items.length;
  const maxIndex = Math.max(itemCount - 1, 0);
  const cardStep = CARD_WIDTH + CARD_GAP[brand];
  const minX = -maxIndex * cardStep;

  const clampIndex = useCallback((index: number) => (
    Math.max(0, Math.min(maxIndex, index))
  ), [maxIndex]);

  const animateToIndex = useCallback((index: number) => {
    const nextIndex = clampIndex(index);
    const target = -nextIndex * cardStep;

    animationRef.current?.stop();
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);

    if (shouldReduceMotion) {
      rawX.set(target);
      return;
    }

    animationRef.current = animate(rawX, target, {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        animationRef.current = null;
      },
    });
  }, [cardStep, clampIndex, rawX, shouldReduceMotion]);

  const settleDrag = () => {
    const nearestIndex = Math.round(Math.abs(rawX.get()) / cardStep);
    animateToIndex(nearestIndex);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      animateToIndex(activeIndexRef.current + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      animateToIndex(activeIndexRef.current - 1);
    }
  };

  useEffect(() => {
    animationRef.current?.stop();
    activeIndexRef.current = 0;
    setActiveIndex(0);
    rawX.set(0);

    return () => animationRef.current?.stop();
  }, [brand, itemCount, rawX]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <section
      className={styles.editorial}
      data-brand={brand}
      data-node-id={content.nodeId}
      id="stories"
      aria-labelledby={`${brand}-editorial-title`}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <div id={`${brand}-editorial-title`}>
            <EditorialHeading content={content} />
          </div>
          <p className={styles.subtitle}>{content.subtitle}</p>
          <a className={styles.cta} href="#stories">
            <span className={styles.ctaIcon} aria-hidden="true">
              +
            </span>
            <span>{content.ctaLabel}</span>
          </a>
        </header>

        <div className={styles.railViewport}>
          <motion.div
            className={styles.rail}
            role="group"
            aria-label={`${content.title.kind === "plain" ? content.title.lines.join(" ") : `${content.title.before} ${content.title.highlight}`} stories`}
            aria-roledescription="carousel"
            tabIndex={0}
            style={{ x: rawX }}
            drag="x"
            dragConstraints={{ left: minX, right: 0 }}
            dragDirectionLock
            dragElastic={0.08}
            dragMomentum={false}
            onKeyDown={handleKeyDown}
            onDragStart={() => {
              animationRef.current?.stop();
            }}
            onDragEnd={settleDrag}
          >
            {content.items.map((item, index) => (
              <motion.div
                className={styles.cardSlot}
                aria-hidden={Math.abs(index - activeIndex) > 1}
                initial={cardInitial}
                whileInView={cardAnimate}
                viewport={{ once: true, amount: 0.01 }}
                transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                key={item.id}
              >
                {brand === "joolz" ? (
                  <JoolzStoryCard item={item} index={index} />
                ) : (
                  <BugabooStoryCard item={item} index={index} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
