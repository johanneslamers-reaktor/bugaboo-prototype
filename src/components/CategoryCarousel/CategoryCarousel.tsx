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
import { CategoryCard } from "./CategoryCard";
import styles from "./CategoryCarousel.module.css";

const CARD_WIDTH = 270;
const AUTOPLAY_DURATION = 4.25;
const BUFFER_CYCLES = 3;
const CENTER_CYCLE = 1;

type CategoryCarouselProps = {
  brand: BrandId;
  content: CategoryCarouselContent;
};

export function CategoryCarousel({ brand, content }: CategoryCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const itemCount = content.items.length;
  const rawX = useMotionValue(0);
  const autoplayProgress = useMotionValue(0);
  const dragOriginRef = useRef(0);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const autoplayRef = useRef<AnimationPlaybackControls | null>(null);
  const hasInteractedRef = useRef(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [autoplayCycle, setAutoplayCycle] = useState(0);
  const cycleWidth = itemCount * CARD_WIDTH;
  const trackStart = brand === "joolz" ? 22 : 18;
  const initialX = trackStart - cycleWidth * CENTER_CYCLE;
  const bufferedItems = Array.from({ length: BUFFER_CYCLES }, (_, cycle) =>
    content.items.map((item) => ({ cycle, item })),
  ).flat();

  const normalizeX = useCallback((value: number) => {
    let nextValue = value;
    const min = trackStart - cycleWidth * (BUFFER_CYCLES - 1);
    const max = trackStart;

    while (nextValue <= min) {
      nextValue += cycleWidth;
    }

    while (nextValue > max) {
      nextValue -= cycleWidth;
    }

    return nextValue;
  }, [cycleWidth, trackStart]);

  const snapToCard = useCallback((value: number) => (
    trackStart + Math.round((value - trackStart) / CARD_WIDTH) * CARD_WIDTH
  ), [trackStart]);

  const stopAutoplay = useCallback(() => {
    if (hasInteractedRef.current) {
      return;
    }

    hasInteractedRef.current = true;
    setHasInteracted(true);
    autoplayRef.current?.stop();
    autoplayProgress.set(0);
  }, [autoplayProgress]);

  const animateTo = useCallback((target: number, source: "user" | "autoplay" = "user") => {
    animationRef.current?.stop();
    const snappedTarget = snapToCard(target);

    if (shouldReduceMotion) {
      rawX.set(normalizeX(snappedTarget));
      if (source === "autoplay" && !hasInteractedRef.current) {
        setAutoplayCycle((current) => current + 1);
      }
      return;
    }

    animationRef.current = animate(rawX, snappedTarget, {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        rawX.set(normalizeX(rawX.get()));
        animationRef.current = null;

        if (source === "autoplay" && !hasInteractedRef.current) {
          setAutoplayCycle((current) => current + 1);
        }
      },
    });
  }, [normalizeX, rawX, shouldReduceMotion, snapToCard]);

  const move = useCallback((direction: 1 | -1, source: "user" | "autoplay" = "user") => {
    const snappedX = snapToCard(rawX.get());
    animateTo(snappedX - direction * CARD_WIDTH, source);
  }, [animateTo, rawX, snapToCard]);

  useEffect(() => {
    animationRef.current?.stop();
    autoplayRef.current?.stop();
    rawX.set(initialX);
    autoplayProgress.set(0);
    hasInteractedRef.current = false;
    setHasInteracted(false);
    setAutoplayCycle(0);

    return () => {
      animationRef.current?.stop();
      autoplayRef.current?.stop();
    };
  }, [autoplayProgress, brand, initialX, rawX]);

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
          move(1, "autoplay");
        }
      },
    });

    return () => autoplayRef.current?.stop();
  }, [autoplayCycle, autoplayProgress, brand, hasInteracted, move, shouldReduceMotion]);

  const settleDrag = (offset: number, velocity: number) => {
    const current = rawX.get();

    if (offset < -48 || velocity < -450) {
      animateTo(current - CARD_WIDTH);
      return;
    }

    if (offset > 48 || velocity > 450) {
      animateTo(current + CARD_WIDTH);
      return;
    }

    animateTo(current);
  };

  const updateDragPosition = (offset: number) => {
    const next = dragOriginRef.current + offset;
    const normalized = normalizeX(next);
    const adjustment = normalized - next;

    if (Math.abs(adjustment) > 0.5) {
      dragOriginRef.current += adjustment;
    }

    rawX.set(normalized);
  };

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
        <motion.div
          className={styles.track}
          style={{ x: rawX }}
          onPanStart={() => {
            stopAutoplay();
            animationRef.current?.stop();
            dragOriginRef.current = rawX.get();
          }}
          onPan={(_, info) => updateDragPosition(info.offset.x)}
          onPanEnd={(_, info) => settleDrag(info.offset.x, info.velocity.x)}
        >
          {bufferedItems.map(({ cycle, item }) => (
            <div
              className={styles.cardSlot}
              aria-hidden={cycle !== CENTER_CYCLE}
              key={`${cycle}-${item.id}`}
            >
              <CategoryCard brand={brand} item={item} />
            </div>
          ))}
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
            onClick={() => move(-1, "user")}
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            className={`${styles.arrowButton} ${styles.arrowNext}`}
            type="button"
            aria-label="Next category"
            onClick={() => move(1, "user")}
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
