import {
  Children,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { useCarouselTrack } from "../../hooks/useCarouselTrack";
import styles from "./Carousel.module.css";

/**
 * Public API mirrored from motion.dev's Motion+ Carousel:
 *   <Carousel items={items} />
 *   <Carousel items={items} gap={0} align="start" />
 *   <Carousel items={items} overflow />
 *   <Carousel items={items} loop={false}>
 *     <Next />
 *   </Carousel>
 *
 * Custom controls (passed as children) call useCarousel() to read state
 * and trigger pagination — same pattern as motion-plus/react.
 */

export interface CarouselApi {
  nextPage: () => void;
  prevPage: () => void;
  gotoPage: (index: number) => void;
  isNextActive: boolean;
  isPrevActive: boolean;
  currentPage: number;
  totalPages: number;
}

const CarouselContext = createContext<CarouselApi | null>(null);

export function useCarousel(): CarouselApi {
  const value = useContext(CarouselContext);
  if (!value) {
    throw new Error("useCarousel must be called inside a <Carousel> component");
  }
  return value;
}

export interface CarouselProps {
  /** Items to display. Each becomes one slot. */
  items: ReactNode[];
  /** Gap between items in px. Default 8. */
  gap?: number;
  /** Off-axis alignment of items. Default "stretch". */
  align?: "start" | "center" | "end" | "stretch";
  /**
   * If true, items extend to viewport edges (no inset padding).
   * If false (default), the viewport has padding so items inset from edges.
   */
  overflow?: boolean;
  /** Cycle infinitely. Default false. */
  loop?: boolean;
  /**
   * Item size mode:
   * - "auto" (default): items keep their CSS-defined width; the first slot is measured
   * - "fill": every item matches the viewport width
   * - number: pixel width applied to every slot
   */
  itemSize?: "auto" | "fill" | number;
  /** Optional aria-label for the track. */
  ariaLabel?: string;
  /** Optional className applied to the outer wrapper. */
  className?: string;
  /** Inset padding (px) when overflow=false. Default 16. */
  inset?: number;
  /** Custom controls rendered alongside the track (e.g. Next/Prev buttons). */
  children?: ReactNode;
}

export function Carousel({
  items,
  gap = 8,
  align = "stretch",
  overflow = false,
  loop = false,
  itemSize = "auto",
  ariaLabel,
  className,
  inset = 16,
  children,
}: CarouselProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const firstSlotRef = useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [measuredItem, setMeasuredItem] = useState(0);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const update = () => setViewportWidth(node.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (itemSize !== "auto") return;
    const node = firstSlotRef.current;
    if (!node) return;
    const update = () => setMeasuredItem(node.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [itemSize, items.length]);

  const childrenArray = Children.toArray(items);
  const totalPages = childrenArray.length;

  const effectiveItemSize =
    itemSize === "fill"
      ? viewportWidth
      : typeof itemSize === "number"
        ? itemSize
        : measuredItem;

  // Step between snap targets = item width + gap.
  const step = effectiveItemSize + gap;

  const {
    trackProps,
    buffer,
    centerCycle,
    currentPage,
    nextPage,
    prevPage,
    gotoPage,
    isNextActive,
    isPrevActive,
  } = useCarouselTrack({
    count: totalPages,
    itemSize: step > 0 ? step : 1,
    loop,
  });

  const api = useMemo<CarouselApi>(
    () => ({
      nextPage,
      prevPage,
      gotoPage,
      isNextActive,
      isPrevActive,
      currentPage,
      totalPages,
    }),
    [currentPage, gotoPage, isNextActive, isPrevActive, nextPage, prevPage, totalPages],
  );

  const slotBaseStyle: CSSProperties = {
    flex:
      itemSize === "fill"
        ? `0 0 ${viewportWidth}px`
        : typeof itemSize === "number"
          ? `0 0 ${itemSize}px`
          : "0 0 auto",
    alignSelf: alignToFlex(align),
  };

  return (
    <CarouselContext.Provider value={api}>
      <div
        className={`${styles.viewport}${className ? ` ${className}` : ""}`}
        data-overflow={overflow ? "true" : "false"}
        ref={viewportRef}
        style={{ "--carousel-inset": `${overflow ? 0 : inset}px` } as CSSProperties}
      >
        <motion.div
          className={styles.track}
          aria-label={ariaLabel}
          {...trackProps}
          style={{ ...trackProps.style, gap: `${gap}px` }}
        >
          {loop && buffer
            ? buffer.map(({ cycle, index, key }) => (
                <div
                  className={styles.slot}
                  aria-hidden={cycle !== centerCycle}
                  ref={cycle === centerCycle && index === 0 ? firstSlotRef : undefined}
                  style={slotBaseStyle}
                  key={key}
                >
                  {childrenArray[index]}
                </div>
              ))
            : childrenArray.map((child, index) => (
                <div
                  className={styles.slot}
                  ref={index === 0 ? firstSlotRef : undefined}
                  style={slotBaseStyle}
                  key={index}
                >
                  {child}
                </div>
              ))}
        </motion.div>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function alignToFlex(align: NonNullable<CarouselProps["align"]>) {
  switch (align) {
    case "start":
      return "flex-start";
    case "center":
      return "center";
    case "end":
      return "flex-end";
    default:
      return "stretch";
  }
}
