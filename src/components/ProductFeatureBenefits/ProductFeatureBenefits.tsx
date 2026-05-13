import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductFeatureBenefitsContent } from "../../data/products";
import styles from "./ProductFeatureBenefits.module.css";

type ProductFeatureBenefitsProps = {
  brand: BrandId;
  content: ProductFeatureBenefitsContent;
};

type DragGesture = {
  isHorizontal: boolean;
  startIndex: number;
  startScrollLeft: number;
  startX: number;
  startY: number;
};

export function ProductFeatureBenefits({ brand, content }: ProductFeatureBenefitsProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const dragGestureRef = useRef<DragGesture | null>(null);
  // Debounce activeIndex updates so they only land once scroll settles.
  // Without this, intermediate scroll positions during a programmatic scrollTo
  // (or even native momentum scroll) flip prev/next disabled state and
  // create a visible flicker on the button background-color transition.
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [openHotspots, setOpenHotspots] = useState<Record<string, string | null>>({});
  const shouldReduceMotion = useReducedMotion();

  const computeNearestIndex = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return 0;
    const cards = Array.from(scroller.children) as HTMLElement[];
    return cards.reduce((closestIndex, card, index) => {
      const closestDistance = Math.abs(getCardTargetLeft(scroller, cards[closestIndex]) - scroller.scrollLeft);
      const distance = Math.abs(getCardTargetLeft(scroller, card) - scroller.scrollLeft);
      return distance < closestDistance ? index : closestIndex;
    }, 0);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const clampedIndex = Math.max(0, Math.min(index, content.items.length - 1));
    const card = scroller.children.item(clampedIndex) as HTMLElement | null;

    if (!card) {
      return;
    }

    // Commit the index immediately; debounced handleScroll won't overwrite
    // it with intermediate positions during the smooth scroll.
    setActiveIndex(clampedIndex);
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }

    scroller.scrollTo({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      left: getCardTargetLeft(scroller, card),
    });
  }, [content.items.length, shouldReduceMotion]);

  const handleScroll = useCallback(() => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
    }
    // Only commit activeIndex once scroll has been quiet for 100ms.
    settleTimerRef.current = setTimeout(() => {
      setActiveIndex(computeNearestIndex());
    }, 100);
  }, [computeNearestIndex]);

  const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;

    if (!scroller || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
      return;
    }

    scroller.scrollLeft += event.deltaX;
  }, []);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;

    // Native scroll-snap handles touch beautifully on its own - never intercept.
    // Only mouse drag goes through manual pointer override.
    if (event.pointerType !== "mouse") {
      return;
    }

    if (!scroller || event.button !== 0 || isInteractiveElement(event.target)) {
      return;
    }

    dragGestureRef.current = {
      isHorizontal: false,
      startIndex: activeIndex,
      startScrollLeft: scroller.scrollLeft,
      startX: event.clientX,
      startY: event.clientY,
    };
  }, [activeIndex]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    const gesture = dragGestureRef.current;

    if (!scroller || !gesture) {
      return;
    }

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;

    if (!gesture.isHorizontal) {
      if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) {
        return;
      }

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        dragGestureRef.current = null;
        return;
      }

      gesture.isHorizontal = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
    scroller.scrollLeft = gesture.startScrollLeft - deltaX * 1.18;
  }, []);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
      }
    };
  }, []);

  const finishPointerGesture = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const gesture = dragGestureRef.current;

    dragGestureRef.current = null;

    if (!gesture?.isHorizontal) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const deltaX = event.clientX - gesture.startX;
    const direction = deltaX < 0 ? 1 : -1;
    const shouldStep = Math.abs(deltaX) > 28;
    const nextIndex = shouldStep ? gesture.startIndex + direction : activeIndex;

    setIsDragging(false);
    scrollToIndex(nextIndex);
  }, [activeIndex, scrollToIndex]);

  return (
    <section className={styles.section} data-brand={brand} data-node-id={content.nodeId}>
      <h2 className={styles.heading}>{content.title}</h2>

      <motion.div
        className={styles.scroller}
        ref={scrollerRef}
        onScroll={handleScroll}
        onPointerCancel={finishPointerGesture}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerGesture}
        onWheel={handleWheel}
        data-dragging={isDragging ? "true" : "false"}
        aria-label={content.title}
      >
        {content.items.map((item, index) => (
          <motion.article
            className={styles.card}
            data-active={index === activeIndex ? "true" : "false"}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.38, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
            key={item.id}
          >
            <figure className={styles.media}>
              {item.media.type === "video" ? (
                <video
                  src={item.media.src}
                  poster={item.media.posterSrc}
                  aria-label={item.media.alt}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{ objectPosition: item.media.objectPosition }}
                />
              ) : (
                <img
                  src={item.media.src}
                  alt={item.media.alt}
                  loading={index <= activeIndex + 1 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  style={{ objectPosition: item.media.objectPosition }}
                />
              )}
              {item.media.overlayTitle ? (
                <figcaption className={styles.overlayTitle}>{item.media.overlayTitle}</figcaption>
              ) : null}
              {item.hotspots?.map((hotspot) => {
                const isOpen = openHotspots[item.id] === hotspot.id;

                return (
                  <span className={styles.hotspotLayer} key={hotspot.id}>
                    <motion.button
                      className={styles.hotspot}
                      type="button"
                      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, x: "-50%", y: "-50%" }}
                      aria-label={isOpen ? `Close ${hotspot.title}` : `Open ${hotspot.title}`}
                      aria-expanded={isOpen}
                      onClick={() => {
                        setOpenHotspots((current) => ({
                          ...current,
                          [item.id]: current[item.id] === hotspot.id ? null : hotspot.id,
                        }));
                      }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                    />
                    {isOpen ? (
                      <motion.div
                        className={styles.hotspotPanel}
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {hotspot.imageSrc ? (
                          <img src={hotspot.imageSrc} alt={hotspot.imageAlt ?? ""} loading="lazy" />
                        ) : null}
                        <p>
                          <strong>{hotspot.title}</strong>
                          <span>{hotspot.body}</span>
                        </p>
                        <button
                          className={styles.hotspotClose}
                          type="button"
                          aria-label={`Close ${hotspot.title}`}
                          onClick={() => {
                            setOpenHotspots((current) => ({ ...current, [item.id]: null }));
                          }}
                        >
                          <CloseIcon />
                        </button>
                      </motion.div>
                    ) : null}
                  </span>
                );
              })}
              {item.media.type === "video" ? (
                <span className={styles.playBadge} aria-hidden="true">
                  {brand === "bugaboo" ? <PauseIcon /> : <PlayIcon />}
                </span>
              ) : null}
            </figure>

            <div className={styles.copyRow}>
              {item.iconSrc ? (
                <span className={styles.iconFrame} aria-hidden="true">
                  <img src={item.iconSrc} alt="" loading="lazy" draggable={false} />
                </span>
              ) : null}
              <div className={styles.copy}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      <div className={styles.controls} aria-label={`${content.title} controls`}>
        <motion.button
          className={styles.control}
          type="button"
          aria-label="Previous feature"
          disabled={activeIndex === 0}
          onClick={() => scrollToIndex(activeIndex - 1)}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        >
          <ChevronIcon direction="previous" />
        </motion.button>
        <motion.button
          className={styles.control}
          type="button"
          aria-label="Next feature"
          disabled={activeIndex === content.items.length - 1}
          onClick={() => scrollToIndex(activeIndex + 1)}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        >
          <ChevronIcon direction="next" />
        </motion.button>
      </div>
    </section>
  );
}

function getCardTargetLeft(scroller: HTMLElement, card: HTMLElement) {
  const firstCard = scroller.children.item(0) as HTMLElement | null;

  return Math.max(0, card.offsetLeft - (firstCard?.offsetLeft ?? 0));
}

function isInteractiveElement(target: EventTarget) {
  return target instanceof Element && target.closest("button, a, input, select, textarea") !== null;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 4.25v7.5l5.5-3.75L6 4.25Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5.25 3.8h1.7v8.4h-1.7V3.8Zm3.8 0h1.7v8.4h-1.7V3.8Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m4.25 4.25 7.5 7.5M11.75 4.25l-7.5 7.5" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" data-direction={direction}>
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}
