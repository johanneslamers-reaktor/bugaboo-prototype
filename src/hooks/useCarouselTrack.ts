import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  type AnimationPlaybackControls,
  type MotionValue,
  type PanInfo,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

/**
 * Carousel physics constants - matched to motion.dev's "nice velocity" feel.
 *
 * SNAP_SPRING: snappy but never bouncy. Gesture velocity is fed into the
 * spring so a flick continues its momentum.
 *
 * VELOCITY_PROJECTION_S: how many seconds of inertia we "project" past the
 * release point to determine which card to land on. 0.3s matches the
 * common momentum-scroll feel on iOS and android.
 */
const SNAP_SPRING = { type: "spring" as const, stiffness: 380, damping: 38, mass: 0.6 };
const VELOCITY_PROJECTION_S = 0.3;
const DRAG_ELASTIC_BOUNDED = 0.18;
const BUFFER_CYCLES = 3;
const CENTER_CYCLE = 1;

type DragEvent = MouseEvent | TouchEvent | PointerEvent;

export type CarouselTrackProps = {
  /**
   * `touch-action: pan-y` is critical for low-friction swipe. It tells the
   * browser to commit vertical touches to page scroll and horizontal touches
   * to JS handlers, with NO "feel out" period. Without it, the browser hesitates
   * to decide which way the user is going, which feels like initial drag.
   */
  style: { x: MotionValue<number>; touchAction: "pan-y" };
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void;
} & (
  | {
      // Bounded mode - uses motion's built-in drag with elastic overdrag.
      drag: "x";
      dragConstraints: { left: number; right: number };
      dragElastic: number;
      dragMomentum: false;
      onDragStart: () => void;
      onDragEnd: (event: DragEvent, info: PanInfo) => void;
    }
  | {
      // Infinite mode - uses onPan so we can normalize position mid-gesture.
      onPanStart: () => void;
      onPan: (event: DragEvent, info: PanInfo) => void;
      onPanEnd: (event: DragEvent, info: PanInfo) => void;
    }
);

export interface UseCarouselOptions {
  /** Total number of distinct items in the carousel. */
  count: number;
  /** Pixel distance between adjacent item slots (card width + gap). */
  itemSize: number;
  /** Loop infinitely. Defaults to false (bounded). */
  loop?: boolean;
  /** Left padding before the first slot. Only meaningful for loop mode. */
  trackStart?: number;
  /** Initial active index. Only meaningful for bounded mode. */
  initialIndex?: number;
}

export interface UseCarouselReturn {
  trackProps: CarouselTrackProps;
  /** Buffered render list - only populated when loop is true. */
  buffer: { cycle: number; index: number; key: string }[] | null;
  /** Cycle index considered "real" - aria-hidden every other cycle. */
  centerCycle: number;
  currentPage: number;
  nextPage: () => void;
  prevPage: () => void;
  gotoPage: (index: number) => void;
  isPrevActive: boolean;
  isNextActive: boolean;
  /** Imperative reset to first slide. Call from useEffect on brand/content change. */
  reset: () => void;
}

export function useCarouselTrack({
  count,
  itemSize,
  loop = false,
  trackStart = 0,
  initialIndex = 0,
}: UseCarouselOptions): UseCarouselReturn {
  const shouldReduceMotion = useReducedMotion();
  const maxIndex = Math.max(count - 1, 0);
  const cycleWidth = count * itemSize;

  // Initial position differs by mode:
  // - loop: start at the centered buffer cycle so we can swipe either way
  // - bounded: start at -initialIndex * itemSize
  const baseX = loop
    ? trackStart - cycleWidth * CENTER_CYCLE
    : -initialIndex * itemSize;

  const x = useMotionValue(baseX);
  const anim = useRef<AnimationPlaybackControls | null>(null);
  const dragOrigin = useRef(0);
  const activeIndexRef = useRef(initialIndex);
  const [currentPage, setCurrentPage] = useState(initialIndex);

  const stopAnim = useCallback(() => {
    anim.current?.stop();
    anim.current = null;
  }, []);

  const normalize = useCallback(
    (value: number) => {
      if (!loop) return value;
      const min = trackStart - cycleWidth * (BUFFER_CYCLES - 1);
      const max = trackStart;
      let next = value;
      while (next <= min) next += cycleWidth;
      while (next > max) next -= cycleWidth;
      return next;
    },
    [cycleWidth, loop, trackStart],
  );

  const clampIndex = useCallback(
    (index: number) => (loop ? mod(index, count) : Math.max(0, Math.min(maxIndex, index))),
    [count, loop, maxIndex],
  );

  /**
   * Animate to a snap target with spring physics. Velocity from the gesture
   * is passed through to the spring so a flick continues its momentum.
   */
  const animateToSnap = useCallback(
    (target: number, velocity = 0) => {
      stopAnim();

      if (shouldReduceMotion) {
        x.set(loop ? normalize(target) : target);
        return;
      }

      anim.current = animate(x, target, {
        ...SNAP_SPRING,
        velocity,
        onComplete: () => {
          if (loop) x.set(normalize(x.get()));
          anim.current = null;
        },
      });
    },
    [loop, normalize, shouldReduceMotion, stopAnim, x],
  );

  const snapValueToCard = useCallback(
    (value: number) => {
      if (loop) {
        return trackStart + Math.round((value - trackStart) / itemSize) * itemSize;
      }
      return -clampIndex(Math.round(-value / itemSize)) * itemSize;
    },
    [clampIndex, itemSize, loop, trackStart],
  );

  const gotoPage = useCallback(
    (index: number, velocity = 0) => {
      if (loop) {
        // Snap relative to current position so direction is preserved.
        const current = x.get();
        const currentIndex = Math.round((trackStart - current) / itemSize);
        const delta = shortestSignedDelta(currentIndex, index, count);
        const target = current - delta * itemSize;

        activeIndexRef.current = mod(index, count);
        setCurrentPage(activeIndexRef.current);
        animateToSnap(target, velocity);
        return;
      }

      const next = clampIndex(index);
      activeIndexRef.current = next;
      setCurrentPage(next);
      animateToSnap(-next * itemSize, velocity);
    },
    [animateToSnap, clampIndex, count, itemSize, loop, trackStart, x],
  );

  const nextPage = useCallback(() => gotoPage(activeIndexRef.current + 1), [gotoPage]);
  const prevPage = useCallback(() => gotoPage(activeIndexRef.current - 1), [gotoPage]);

  const handleSettle = useCallback(
    (info: PanInfo) => {
      // Velocity projection: where is the gesture headed?
      const current = x.get();
      const projected = current + info.velocity.x * VELOCITY_PROJECTION_S;
      const snapped = snapValueToCard(projected);

      if (loop) {
        // For loop mode we don't care about page index drift -
        // just settle to the projected snap point and normalize.
        animateToSnap(snapped, info.velocity.x);

        // Update logical page from new snapped position.
        const newPageRaw = Math.round((trackStart - snapped) / itemSize);
        activeIndexRef.current = mod(newPageRaw, count);
        setCurrentPage(activeIndexRef.current);
        return;
      }

      const newIndex = Math.max(0, Math.min(maxIndex, Math.round(-snapped / itemSize)));
      activeIndexRef.current = newIndex;
      setCurrentPage(newIndex);
      animateToSnap(-newIndex * itemSize, info.velocity.x);
    },
    [animateToSnap, count, itemSize, loop, maxIndex, snapValueToCard, trackStart, x],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextPage();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevPage();
      }
    },
    [nextPage, prevPage],
  );

  const trackProps = useMemo<CarouselTrackProps>(() => {
    const shared = {
      style: { x, touchAction: "pan-y" as const },
      onKeyDown: handleKeyDown,
    };

    if (loop) {
      return {
        ...shared,
        onPanStart: () => {
          stopAnim();
          dragOrigin.current = x.get();
        },
        onPan: (_: DragEvent, info: PanInfo) => {
          const next = dragOrigin.current + info.offset.x;
          const normalized = normalize(next);
          const adjustment = normalized - next;
          if (Math.abs(adjustment) > 0.5) {
            dragOrigin.current += adjustment;
          }
          x.set(normalized);
        },
        onPanEnd: (_: DragEvent, info: PanInfo) => handleSettle(info),
      };
    }

    const minX = -maxIndex * itemSize;
    return {
      ...shared,
      drag: "x" as const,
      dragConstraints: { left: minX, right: 0 },
      dragElastic: DRAG_ELASTIC_BOUNDED,
      dragMomentum: false,
      onDragStart: () => stopAnim(),
      onDragEnd: (_: DragEvent, info: PanInfo) => handleSettle(info),
    };
  }, [handleKeyDown, handleSettle, itemSize, loop, maxIndex, normalize, stopAnim, x]);

  const buffer = useMemo(() => {
    if (!loop) return null;
    return Array.from({ length: BUFFER_CYCLES }, (_, cycle) =>
      Array.from({ length: count }, (_, index) => ({
        cycle,
        index,
        key: `${cycle}-${index}`,
      })),
    ).flat();
  }, [count, loop]);

  const reset = useCallback(() => {
    stopAnim();
    activeIndexRef.current = 0;
    setCurrentPage(0);
    x.set(baseX);
  }, [baseX, stopAnim, x]);

  useEffect(() => {
    return () => stopAnim();
  }, [stopAnim]);

  // Keep bounded position aligned with current index when itemSize changes
  // (responsive layout, ResizeObserver-driven widths, etc).
  useEffect(() => {
    if (loop) return;
    if (anim.current) return;
    x.set(-activeIndexRef.current * itemSize);
  }, [itemSize, loop, x]);

  return {
    trackProps,
    buffer,
    centerCycle: CENTER_CYCLE,
    currentPage,
    nextPage,
    prevPage,
    gotoPage,
    isPrevActive: loop || currentPage > 0,
    isNextActive: loop || currentPage < maxIndex,
    reset,
  };
}

function mod(value: number, modulus: number): number {
  if (modulus <= 0) return 0;
  return ((value % modulus) + modulus) % modulus;
}

/**
 * Shortest signed step between two indices on a circular list.
 * Used by gotoPage in loop mode so "go to index 4 from index 1" can prefer
 * the +3 direction over -count+3.
 */
function shortestSignedDelta(from: number, to: number, count: number): number {
  if (count <= 0) return 0;
  const direct = to - from;
  const wrap = direct - Math.sign(direct) * count;
  return Math.abs(wrap) < Math.abs(direct) ? wrap : direct;
}
