import { useCallback, useEffect, useRef } from "react";
import {
  animate,
  type AnimationPlaybackControls,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductCardItem, ProductTitleSegment } from "../../data/homepage";
import styles from "./ProductCard.module.css";

const IMAGE_AUTOPLAY_DURATION = 3.2;

type ProductCardProps = {
  activeImageIndex: number;
  brand: BrandId;
  hasImageInteracted: boolean;
  isWishlisted: boolean;
  onImageChange: (productId: string, index: number) => void;
  onImageInteracted: (productId: string) => void;
  onWishlistChange: (productId: string, isWishlisted: boolean) => void;
  product: ProductCardItem;
};

export function ProductCard({
  activeImageIndex,
  brand,
  hasImageInteracted,
  isWishlisted,
  onImageChange,
  onImageInteracted,
  onWishlistChange,
  product,
}: ProductCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const imageProgress = useMotionValue(0);
  const autoplayRef = useRef<AnimationPlaybackControls | null>(null);
  const imageCount = product.images.length;
  const activeImage = product.images[activeImageIndex] ?? product.images[0];
  const progressScale = useTransform(imageProgress, (latest) => {
    if (imageCount <= 1) {
      return 1;
    }

    return Math.min(1, (activeImageIndex + latest) / imageCount);
  });

  const stopAutoplay = useCallback(() => {
    onImageInteracted(product.id);
    autoplayRef.current?.stop();
    imageProgress.set(1);
  }, [imageProgress, onImageInteracted, product.id]);

  const selectImage = useCallback((index: number) => {
    stopAutoplay();
    onImageChange(product.id, index);
  }, [onImageChange, product.id, stopAutoplay]);

  useEffect(() => {
    autoplayRef.current?.stop();
    imageProgress.set(imageCount <= 1 ? 1 : 0);

    return () => autoplayRef.current?.stop();
  }, [imageCount, imageProgress, product.id]);

  useEffect(() => {
    autoplayRef.current?.stop();

    if (hasImageInteracted || shouldReduceMotion || imageCount <= 1) {
      imageProgress.set(1);
      return;
    }

    imageProgress.set(0);
    autoplayRef.current = animate(imageProgress, [0, 1], {
      duration: IMAGE_AUTOPLAY_DURATION,
      ease: "linear",
      onComplete: () => {
        if (!hasImageInteracted) {
          onImageChange(product.id, (activeImageIndex + 1) % imageCount);
        }
      },
    });

    return () => autoplayRef.current?.stop();
  }, [activeImageIndex, hasImageInteracted, imageCount, imageProgress, onImageChange, product.id, shouldReduceMotion]);

  return (
    <article
      className={styles.card}
      data-brand={brand}
      onFocusCapture={stopAutoplay}
      onPointerDownCapture={stopAutoplay}
    >
      <div className={styles.mediaBlock}>
        <div className={styles.mediaStage}>
          <motion.img
            key={activeImage.src}
            className={styles.productImage}
            src={activeImage.src}
            alt={activeImage.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            initial={{ opacity: 0.84, scale: shouldReduceMotion ? 1 : 1.08, y: shouldReduceMotion ? 0 : 7 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className={styles.cardChrome}>
            <div className={styles.topRow}>
              {product.badge ? <span className={styles.badge}>{product.badge}</span> : <span />}

              <div className={styles.actions}>
                <button
                  className={styles.iconButton}
                  data-active={isWishlisted ? "true" : "false"}
                  type="button"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  aria-pressed={isWishlisted}
                  onClick={(event) => {
                    event.stopPropagation();
                    onWishlistChange(product.id, !isWishlisted);
                  }}
                >
                  <HeartIcon filled={isWishlisted} />
                </button>
                <button className={styles.iconButton} type="button" aria-label="Open product quick view">
                  <PlusIcon />
                </button>
              </div>
            </div>

            {imageCount > 1 ? (
              <div className={styles.thumbnails} aria-label={`${formatProductTitle(product.title)} image views`}>
                {product.images.map((image, index) => (
                  <button
                    className={styles.thumbnailButton}
                    data-active={index === activeImageIndex ? "true" : "false"}
                    type="button"
                    aria-label={`Show image ${index + 1} of ${imageCount}`}
                    aria-pressed={index === activeImageIndex}
                    key={image.src}
                    onClick={(event) => {
                      event.stopPropagation();
                      selectImage(index);
                    }}
                  >
                    <img src={image.src} alt="" loading="lazy" decoding="async" draggable={false} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.progressTrack} aria-hidden="true">
          <motion.span className={styles.progressFill} style={{ scaleX: progressScale }} />
        </div>
      </div>

      <div className={styles.copy}>
        <h3 className={styles.title}>
          {product.title.map((segment, index) => (
            <ProductTitlePart key={`${segment.text}-${index}`} segment={segment} />
          ))}
        </h3>
        <p className={styles.subtitle}>{product.subtitle}</p>
        <div className={styles.priceRow}>
          {product.compareAtPrice ? <span className={styles.compareAt}>{product.compareAtPrice}</span> : null}
          <span>{product.price}</span>
        </div>
      </div>
    </article>
  );
}

function ProductTitlePart({ segment }: { segment: ProductTitleSegment }) {
  if (segment.superscript) {
    return <sup>{segment.text}</sup>;
  }

  return <span>{segment.text}</span>;
}

function formatProductTitle(title: ProductTitleSegment[]) {
  return title.map((segment) => segment.text).join("");
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <motion.svg
      className={styles.icon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      animate={{ scale: filled ? [1, 1.2, 1] : 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <path d="M12 20.25s-7.25-4.4-7.25-10a4.12 4.12 0 0 1 7.25-2.68 4.12 4.12 0 0 1 7.25 2.68c0 5.6-7.25 10-7.25 10Z" />
    </motion.svg>
  );
}

function PlusIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 6.5v11M6.5 12h11" />
    </svg>
  );
}
