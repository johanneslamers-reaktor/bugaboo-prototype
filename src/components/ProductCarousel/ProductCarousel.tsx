import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  type AnimationPlaybackControls,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductCarouselContent } from "../../data/homepage";
import { ProductCard } from "./ProductCard";
import styles from "./ProductCarousel.module.css";

const CARD_STEP = 217;
const BUFFER_CYCLES = 3;
const CENTER_CYCLE = 1;

type ProductCarouselProps = {
  brand: BrandId;
  content: ProductCarouselContent;
};

export function ProductCarousel({ brand, content }: ProductCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const dragOriginRef = useRef(0);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const [activeImageByProduct, setActiveImageByProduct] = useState<Record<string, number>>({});
  const [interactedImageByProduct, setInteractedImageByProduct] = useState<Record<string, boolean>>({});
  const [wishlistByProduct, setWishlistByProduct] = useState<Record<string, boolean>>({});
  const itemCount = content.items.length;
  const cycleWidth = itemCount * CARD_STEP;
  const trackStart = brand === "joolz" ? 20 : 16;
  const initialX = trackStart - cycleWidth * CENTER_CYCLE;
  const bufferedProducts = Array.from({ length: BUFFER_CYCLES }, (_, cycle) =>
    content.items.map((product) => ({ cycle, product })),
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
    trackStart + Math.round((value - trackStart) / CARD_STEP) * CARD_STEP
  ), [trackStart]);

  const animateTo = useCallback((target: number) => {
    animationRef.current?.stop();
    const snappedTarget = snapToCard(target);

    if (shouldReduceMotion) {
      rawX.set(normalizeX(snappedTarget));
      return;
    }

    animationRef.current = animate(rawX, snappedTarget, {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        rawX.set(normalizeX(rawX.get()));
        animationRef.current = null;
      },
    });
  }, [normalizeX, rawX, shouldReduceMotion, snapToCard]);

  const setProductImage = useCallback((productId: string, index: number) => {
    setActiveImageByProduct((current) => (
      current[productId] === index ? current : { ...current, [productId]: index }
    ));
  }, []);

  const markProductImageInteracted = useCallback((productId: string) => {
    setInteractedImageByProduct((current) => (
      current[productId] ? current : { ...current, [productId]: true }
    ));
  }, []);

  const setProductWishlist = useCallback((productId: string, isWishlisted: boolean) => {
    setWishlistByProduct((current) => (
      current[productId] === isWishlisted ? current : { ...current, [productId]: isWishlisted }
    ));
  }, []);

  const settleDrag = (offset: number, velocity: number) => {
    const current = rawX.get();

    if (offset < -44 || velocity < -430) {
      animateTo(current - CARD_STEP);
      return;
    }

    if (offset > 44 || velocity > 430) {
      animateTo(current + CARD_STEP);
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

  useEffect(() => {
    animationRef.current?.stop();
    rawX.set(initialX);
    setActiveImageByProduct({});
    setInteractedImageByProduct({});
    setWishlistByProduct({});

    return () => animationRef.current?.stop();
  }, [brand, initialX, rawX]);

  return (
    <section
      className={styles.carousel}
      data-brand={brand}
      data-node-id={content.nodeId}
      id="products"
      aria-labelledby={`${brand}-product-carousel-title`}
    >
      <h2 className={styles.heading} id={`${brand}-product-carousel-title`}>
        {content.title}
      </h2>

      <div className={styles.viewport}>
        <motion.div
          className={styles.track}
          style={{ x: rawX }}
          onPanStart={() => {
            animationRef.current?.stop();
            dragOriginRef.current = rawX.get();
          }}
          onPan={(_, info) => updateDragPosition(info.offset.x)}
          onPanEnd={(_, info) => settleDrag(info.offset.x, info.velocity.x)}
        >
          {bufferedProducts.map(({ cycle, product }) => (
            <div
              className={styles.cardSlot}
              aria-hidden={cycle !== CENTER_CYCLE}
              key={`${cycle}-${product.id}`}
            >
              <ProductCard
                activeImageIndex={activeImageByProduct[product.id] ?? 0}
                brand={brand}
                hasImageInteracted={interactedImageByProduct[product.id] === true}
                isWishlisted={wishlistByProduct[product.id] === true}
                onImageChange={setProductImage}
                onImageInteracted={markProductImageInteracted}
                onWishlistChange={setProductWishlist}
                product={product}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
