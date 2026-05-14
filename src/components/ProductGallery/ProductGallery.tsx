import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductColorway, ProductGalleryMedia } from "../../data/products";
import { useCarouselTrack } from "../../hooks/useCarouselTrack";
import styles from "./ProductGallery.module.css";

const CLICK_ZOOM_SCALE = 2.25;
const DOUBLE_TAP_MAX_MS = 320;
const MAX_PINCH_SCALE = 3;
const TAP_MOVE_THRESHOLD = 6;
const TAP_ZOOM_DELAY_MS = 280;

type ProductGalleryProps = {
  brand: BrandId;
  colorway: ProductColorway;
  productTitle: string;
};

type Point = {
  x: number;
  y: number;
};

type ZoomState = {
  scale: number;
  x: number;
  y: number;
  origin: string;
};

type ProductGallerySlideProps = {
  item: ProductGalleryMedia;
  isActive: boolean;
  loading: "eager" | "lazy";
  onZoomChange: (isZoomed: boolean) => void;
  onZoomGestureChange: (isActive: boolean) => void;
};

export function ProductGallery({ brand, colorway, productTitle }: ProductGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const galleryRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    shouldReduceMotion ? ["0%", "0%", "0%"] : ["0%", "-50%", "-50%"],
  );
  const [viewportWidth, setViewportWidth] = useState(402);
  const [zoomedMediaId, setZoomedMediaId] = useState<string | null>(null);
  const [isZoomGestureActive, setIsZoomGestureActive] = useState(false);
  const maxIndex = Math.max(colorway.media.length - 1, 0);

  const { trackProps, currentPage: activeIndex, gotoPage, reset } = useCarouselTrack({
    count: colorway.media.length,
    itemSize: viewportWidth,
    loop: false,
  });

  const activeMediaId = colorway.media[activeIndex]?.id;
  const isActiveSlideZoomed = zoomedMediaId === activeMediaId;
  const canDragCarousel = !isActiveSlideZoomed && !isZoomGestureActive;

  // Reset zoom when active slide changes (driven by hook's currentPage)
  const prevIndexRef = useRef(activeIndex);
  useEffect(() => {
    if (prevIndexRef.current !== activeIndex) {
      setZoomedMediaId(null);
      setIsZoomGestureActive(false);
      prevIndexRef.current = activeIndex;
    }
  }, [activeIndex]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateWidth = () => {
      setViewportWidth(viewport.getBoundingClientRect().width);
    };
    const observer = new ResizeObserver(updateWidth);

    updateWidth();
    observer.observe(viewport);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    reset();
    setZoomedMediaId(null);
    setIsZoomGestureActive(false);
  }, [colorway.id, reset]);

  return (
    <section
      className={styles.gallery}
      data-brand={brand}
      data-node-id="8663:3641"
      aria-label={`${productTitle} image gallery`}
      ref={galleryRef}
    >
      <div
        className={styles.viewport}
        ref={viewportRef}
        style={{ "--gallery-width": `${viewportWidth}px` } as CSSProperties}
      >
        <motion.div className={styles.parallaxLayer} style={{ y: parallaxY }}>
          <motion.div
            className={styles.track}
            data-zoomed={isActiveSlideZoomed ? "true" : "false"}
            {...trackProps}
            drag={canDragCarousel ? "x" : false}
          >
            {colorway.media.map((item, index) => (
              <figure className={styles.slide} data-fit={item.fit} key={item.id}>
                <ProductGallerySlide
                  item={item}
                  isActive={index === activeIndex}
                  loading={index === 0 ? "eager" : "lazy"}
                  onZoomChange={(nextIsZoomed) => setZoomedMediaId(nextIsZoomed ? item.id : null)}
                  onZoomGestureChange={setIsZoomGestureActive}
                />
              </figure>
            ))}
          </motion.div>
        </motion.div>

        <div className={styles.controls} aria-label="Gallery controls">
          <button
            className={styles.arrowButton}
            type="button"
            aria-label="Previous image"
            disabled={activeIndex === 0}
            onClick={() => gotoPage(activeIndex - 1)}
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            className={styles.arrowButton}
            type="button"
            aria-label="Next image"
            disabled={activeIndex === maxIndex}
            onClick={() => gotoPage(activeIndex + 1)}
          >
            <ChevronIcon direction="right" />
          </button>
        </div>

        <div
          className={styles.progress}
          aria-hidden="true"
          style={{
            "--slide-count": colorway.media.length,
            "--active-index": activeIndex,
          } as CSSProperties}
        >
          <span className={styles.progressTrack} />
          <span className={styles.progressIndicator} />
        </div>
      </div>
    </section>
  );
}

function ProductGallerySlide({
  isActive,
  item,
  loading,
  onZoomChange,
  onZoomGestureChange,
}: ProductGallerySlideProps) {
  const shouldReduceMotion = useReducedMotion();
  const surfaceRef = useRef<HTMLButtonElement | null>(null);
  const clickTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const lastTapRef = useRef<{ time: number; point: Point } | null>(null);
  const pointersRef = useRef<Map<number, Point>>(new Map());
  const pointerStartRef = useRef<Point | null>(null);
  const didMoveRef = useRef(false);
  const pinchStartRef = useRef<{
    distance: number;
    scale: number;
    midpoint: Point;
    x: number;
    y: number;
  } | null>(null);
  const panStartRef = useRef<{
    point: Point;
    x: number;
    y: number;
  } | null>(null);
  const zoomStateRef = useRef<ZoomState>({
    scale: 1,
    x: 0,
    y: 0,
    origin: "50% 50%",
  });
  const [zoomState, setZoomState] = useState<ZoomState>(zoomStateRef.current);
  const mediaType = item.type ?? "image";
  const isLocallyZoomed = zoomState.scale > 1.01;

  const updateZoomState = useCallback((nextState: ZoomState) => {
    zoomStateRef.current = nextState;
    setZoomState(nextState);
  }, []);

  const clearClickTimer = useCallback(() => {
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
  }, []);

  const getRelativePoint = useCallback((point: Point) => {
    const surface = surfaceRef.current;

    if (!surface) {
      return { x: 0, y: 0 };
    }

    const rect = surface.getBoundingClientRect();

    return {
      x: point.x - rect.left,
      y: point.y - rect.top,
    };
  }, []);

  const clampOffset = useCallback((offset: Point, scale = zoomStateRef.current.scale) => {
    const surface = surfaceRef.current;

    if (!surface || scale <= 1) {
      return { x: 0, y: 0 };
    }

    const rect = surface.getBoundingClientRect();
    const maxX = (rect.width * (scale - 1)) / 2;
    const maxY = (rect.height * (scale - 1)) / 2;

    return {
      x: Math.max(-maxX, Math.min(maxX, offset.x)),
      y: Math.max(-maxY, Math.min(maxY, offset.y)),
    };
  }, []);

  const animateZoom = useCallback((nextScale: number, nextOffset: Point = { x: 0, y: 0 }) => {
    const clampedOffset = clampOffset(nextOffset, nextScale);
    updateZoomState({
      scale: nextScale,
      x: clampedOffset.x,
      y: clampedOffset.y,
      origin: nextScale > 1.01 ? zoomStateRef.current.origin : "50% 50%",
    });
    onZoomChange(nextScale > 1.01);
  }, [clampOffset, onZoomChange, updateZoomState]);

  const toggleZoomAtPoint = useCallback((point: Point) => {
    clearClickTimer();

    if (zoomStateRef.current.scale > 1.01) {
      animateZoom(1);
      return;
    }

    const relativePoint = getRelativePoint(point);
    const surface = surfaceRef.current;

    if (surface) {
      const rect = surface.getBoundingClientRect();
      zoomStateRef.current = {
        ...zoomStateRef.current,
        origin: `${(relativePoint.x / rect.width) * 100}% ${(relativePoint.y / rect.height) * 100}%`,
      };
    }

    animateZoom(CLICK_ZOOM_SCALE);
  }, [animateZoom, clearClickTimer, getRelativePoint]);

  const resetPointers = useCallback(() => {
    pointersRef.current.clear();
    pointerStartRef.current = null;
    didMoveRef.current = false;
    pinchStartRef.current = null;
    panStartRef.current = null;
    onZoomGestureChange(false);
  }, [onZoomGestureChange]);

  const handleTapGesture = useCallback((point: Point) => {
    const now = performance.now();
    const lastTap = lastTapRef.current;

    if (
      lastTap
      && now - lastTap.time <= DOUBLE_TAP_MAX_MS
      && getDistance(lastTap.point, point) <= 28
    ) {
      lastTapRef.current = null;
      clearClickTimer();
      toggleZoomAtPoint(point);
      return;
    }

    lastTapRef.current = { time: now, point };
    clearClickTimer();
    clickTimerRef.current = window.setTimeout(() => {
      lastTapRef.current = null;
      toggleZoomAtPoint(point);
    }, TAP_ZOOM_DELAY_MS);
  }, [clearClickTimer, toggleZoomAtPoint]);

  useEffect(() => {
    if (!isActive || mediaType === "video") {
      clearClickTimer();
      animateZoom(1);
      resetPointers();
    }
  }, [animateZoom, clearClickTimer, isActive, mediaType, resetPointers]);

  useEffect(() => {
    return () => clearClickTimer();
  }, [clearClickTimer]);

  const handlePointerDown = useCallback((event: PointerEvent) => {
    const point = { x: event.clientX, y: event.clientY };

    if (pointersRef.current.size === 0) {
      didMoveRef.current = false;
    }

    pointerStartRef.current = point;
    pointersRef.current.set(event.pointerId, point);

    try {
      surfaceRef.current?.setPointerCapture(event.pointerId);
    } catch {
      // Some synthetic test events are not eligible for pointer capture.
    }

    if (pointersRef.current.size >= 2) {
      const [first, second] = Array.from(pointersRef.current.values());
      const midpoint = getMidpoint(first, second);
      pinchStartRef.current = {
        distance: getDistance(first, second),
        scale: zoomStateRef.current.scale,
        midpoint,
        x: zoomStateRef.current.x,
        y: zoomStateRef.current.y,
      };
      onZoomGestureChange(true);
      onZoomChange(true);
      didMoveRef.current = true;
      return;
    }

    if (zoomStateRef.current.scale > 1.01) {
      panStartRef.current = {
        point,
        x: zoomStateRef.current.x,
        y: zoomStateRef.current.y,
      };
      onZoomGestureChange(true);
    }
  }, [onZoomChange, onZoomGestureChange]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!pointersRef.current.has(event.pointerId)) {
      return;
    }

    const point = { x: event.clientX, y: event.clientY };

    pointersRef.current.set(event.pointerId, point);

    if (pointerStartRef.current && getDistance(pointerStartRef.current, point) > 4) {
      didMoveRef.current = true;
    }

    if (pointersRef.current.size >= 2 && pinchStartRef.current) {
      event.preventDefault();
      didMoveRef.current = true;

      const [first, second] = Array.from(pointersRef.current.values());
      const midpoint = getMidpoint(first, second);
      const nextScale = clamp(
        pinchStartRef.current.scale * (getDistance(first, second) / pinchStartRef.current.distance),
        1,
        MAX_PINCH_SCALE,
      );
      const nextOffset = clampOffset({
        x: pinchStartRef.current.x + midpoint.x - pinchStartRef.current.midpoint.x,
        y: pinchStartRef.current.y + midpoint.y - pinchStartRef.current.midpoint.y,
      }, nextScale);

      updateZoomState({
        scale: nextScale,
        x: nextOffset.x,
        y: nextOffset.y,
        origin: zoomStateRef.current.origin,
      });
      onZoomChange(nextScale > 1.01);

      return;
    }

    if (zoomStateRef.current.scale > 1.01 && panStartRef.current && pointersRef.current.size === 1) {
      event.preventDefault();
      didMoveRef.current = true;

      const nextOffset = clampOffset({
        x: panStartRef.current.x + point.x - panStartRef.current.point.x,
        y: panStartRef.current.y + point.y - panStartRef.current.point.y,
      });

      updateZoomState({
        scale: zoomStateRef.current.scale,
        x: nextOffset.x,
        y: nextOffset.y,
        origin: zoomStateRef.current.origin,
      });
    }
  }, [clampOffset, onZoomChange, updateZoomState]);

  const handlePointerEnd = useCallback((event: PointerEvent) => {
    const point = { x: event.clientX, y: event.clientY };
    const startedAt = pointerStartRef.current;
    const wasPinching = Boolean(pinchStartRef.current);
    const wasSinglePointer = pointersRef.current.size === 1 && pointersRef.current.has(event.pointerId);
    const wasTap = Boolean(
      startedAt
      && wasSinglePointer
      && !wasPinching
      && !didMoveRef.current
      && getDistance(startedAt, point) <= TAP_MOVE_THRESHOLD,
    );

    pointersRef.current.delete(event.pointerId);
    pointerStartRef.current = null;
    pinchStartRef.current = null;
    panStartRef.current = null;

    const surface = surfaceRef.current;

    if (surface?.hasPointerCapture(event.pointerId)) {
      surface.releasePointerCapture(event.pointerId);
    }

    if (zoomStateRef.current.scale <= 1.01) {
      animateZoom(1);
    }

    if (pointersRef.current.size === 0) {
      onZoomGestureChange(false);
    }

    if (wasTap) {
      handleTapGesture(point);
    }
  }, [animateZoom, handleTapGesture, onZoomGestureChange]);

  const setSurfaceNode = useCallback((node: HTMLButtonElement | null) => {
    if (surfaceRef.current) {
      surfaceRef.current.onpointercancel = null;
      surfaceRef.current.onpointerdown = null;
      surfaceRef.current.onpointermove = null;
      surfaceRef.current.onpointerup = null;
    }

    surfaceRef.current = node;

    if (!node || mediaType === "video") {
      return;
    }

    node.onpointercancel = handlePointerEnd;
    node.onpointerdown = handlePointerDown;
    node.onpointermove = handlePointerMove;
    node.onpointerup = handlePointerEnd;
  }, [handlePointerDown, handlePointerEnd, handlePointerMove, mediaType]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    toggleZoomAtPoint({ x: window.innerWidth / 2, y: window.innerHeight * 0.35 });
  };

  if (mediaType === "video") {
    return (
      <video
        className={styles.video}
        src={item.src}
        poster={item.posterSrc}
        aria-label={item.alt}
        autoPlay
        loop
        muted
        playsInline
        preload={isActive ? "auto" : "metadata"}
      />
    );
  }

  return (
    <button
      className={styles.zoomSurface}
      data-active={isActive ? "true" : "false"}
      data-media-id={item.id}
      data-zoom-surface="true"
      data-zoomed={isLocallyZoomed ? "true" : "false"}
      type="button"
      aria-label={isLocallyZoomed ? `Reset zoom for ${item.alt}` : `Zoom ${item.alt}`}
      ref={setSurfaceNode}
      onKeyDown={handleKeyDown}
    >
      <motion.img
        className={styles.image}
        src={item.src}
        alt={item.alt}
        loading={loading}
        draggable={false}
        animate={{
          scale: zoomState.scale,
          x: zoomState.x,
          y: zoomState.y,
        }}
        style={{
          transformOrigin: zoomState.origin,
        }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      />
    </button>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getDistance(first: Point, second: Point) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function getMidpoint(first: Point, second: Point) {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg className={styles.chevronIcon} viewBox="0 0 32 32" aria-hidden="true">
      {direction === "left" ? (
        <path d="M18.5 10.5 13 16l5.5 5.5" />
      ) : (
        <path d="m13.5 10.5 5.5 5.5-5.5 5.5" />
      )}
    </svg>
  );
}
