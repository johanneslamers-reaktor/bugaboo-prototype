import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  type AnimationPlaybackControls,
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { CategoryCarouselContent } from "../../data/homepage";
import { useCarouselTrack } from "../../hooks/useCarouselTrack";
import { CategoryCard } from "./CategoryCard";
import styles from "./CategoryCarousel.module.css";

const CARD_WIDTH = 270;
const AUTOPLAY_DURATION = 4.25;

type CategoryCarouselProps = {
  brand: BrandId;
  content: CategoryCarouselContent;
};

export function CategoryCarousel({ brand, content }: CategoryCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const trackStart = brand === "joolz" ? 22 : 18;
  const { trackProps, buffer, centerCycle, nextPage, prevPage, reset } = useCarouselTrack({
    count: content.items.length,
    itemSize: CARD_WIDTH,
    loop: true,
    trackStart,
  });

  const autoplayProgress = useMotionValue(0);
  const autoplayRef = useRef<AnimationPlaybackControls | null>(null);
  const hasInteractedRef = useRef(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [autoplayCycle, setAutoplayCycle] = useState(0);

  const stopAutoplay = useCallback(() => {
    if (hasInteractedRef.current) {
      return;
    }

    hasInteractedRef.current = true;
    setHasInteracted(true);
    autoplayRef.current?.stop();
    autoplayProgress.set(0);
  }, [autoplayProgress]);

  useEffect(() => {
    reset();
    autoplayRef.current?.stop();
    autoplayProgress.set(0);
    hasInteractedRef.current = false;
    setHasInteracted(false);
    setAutoplayCycle(0);

    return () => {
      autoplayRef.current?.stop();
    };
  }, [autoplayProgress, brand, reset]);

  useEffect(() => {
    autoplayRef.current?.stop();
    autoplayProgress.set(0);

    if (hasInteracted || shouldReduceMotion) {
      return;
    }

    autoplayRef.current = animate(autoplayProgress, [0, 1], {
      duration: AUTOPLAY_DURATION,
      ease: "linear",
      onComplete: () => {
        if (!hasInteractedRef.current) {
          nextPage();
          setAutoplayCycle((cycle) => cycle + 1);
        }
      },
    });

    return () => autoplayRef.current?.stop();
  }, [autoplayCycle, autoplayProgress, brand, hasInteracted, nextPage, shouldReduceMotion]);

  return (
    <section
      className={styles.carousel}
      data-brand={brand}
      data-node-id={content.nodeId}
      id="strollers"
      aria-labelledby={`${brand}-category-carousel-title`}
      onFocusCapture={stopAutoplay}
      onPointerDownCapture={stopAutoplay}
    >
      <h2 id={`${brand}-category-carousel-title`} className={styles.heading}>
        {content.title}
      </h2>

      <div className={styles.viewport}>
        <motion.div className={styles.track} {...trackProps}>
          {buffer?.map(({ cycle, index, key }) => {
            const item = content.items[index];
            return (
              <div
                className={styles.cardSlot}
                aria-hidden={cycle !== centerCycle}
                key={key}
              >
                <CategoryCard brand={brand} item={item} />
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className={styles.controls}>
        <a className={styles.cta} href={content.ctaHref}>
          <span className={styles.ctaInner}>{content.ctaLabel}</span>
        </a>

        <div className={styles.arrowControls} aria-label="Category carousel controls">
          <button
            className={`${styles.arrowButton} ${styles.arrowPrevious}`}
            type="button"
            aria-label="Previous category"
            onClick={() => {
              stopAutoplay();
              prevPage();
            }}
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            className={`${styles.arrowButton} ${styles.arrowNext}`}
            type="button"
            aria-label="Next category"
            onClick={() => {
              stopAutoplay();
              nextPage();
            }}
          >
            <AutoplayRing progress={autoplayProgress} isActive={!hasInteracted && !shouldReduceMotion} />
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </section>
  );
}

function AutoplayRing({
  isActive,
  progress,
}: {
  isActive: boolean;
  progress: MotionValue<number>;
}) {
  return (
    <svg
      className={styles.progressRing}
      data-active={isActive ? "true" : "false"}
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <circle className={styles.progressTrack} cx="16" cy="16" r="15" pathLength={1} />
      <motion.circle
        className={styles.progressIndicator}
        cx="16"
        cy="16"
        r="15"
        pathLength={1}
        style={{ pathLength: progress }}
      />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className={styles.arrowIcon}
      viewBox="0 0 20 20"
      aria-hidden="true"
      data-direction={direction}
    >
      {direction === "left" ? <path d="M12 5L7 10l5 5" /> : <path d="M8 5l5 5-5 5" />}
    </svg>
  );
}
