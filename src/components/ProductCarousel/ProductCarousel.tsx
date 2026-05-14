import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductCarouselContent } from "../../data/homepage";
import { useCarouselTrack } from "../../hooks/useCarouselTrack";
import { ProductCard } from "./ProductCard";
import styles from "./ProductCarousel.module.css";

const CARD_STEP = 217;

type ProductCarouselProps = {
  brand: BrandId;
  content: ProductCarouselContent;
};

export function ProductCarousel({ brand, content }: ProductCarouselProps) {
  const trackStart = brand === "joolz" ? 20 : 16;
  const { trackProps, buffer, centerCycle, reset } = useCarouselTrack({
    count: content.items.length,
    itemSize: CARD_STEP,
    loop: true,
    trackStart,
  });

  const [activeImageByProduct, setActiveImageByProduct] = useState<Record<string, number>>({});
  const [wishlistByProduct, setWishlistByProduct] = useState<Record<string, boolean>>({});

  const setProductImage = useCallback((productId: string, index: number) => {
    setActiveImageByProduct((current) => (
      current[productId] === index ? current : { ...current, [productId]: index }
    ));
  }, []);

  const setProductWishlist = useCallback((productId: string, isWishlisted: boolean) => {
    setWishlistByProduct((current) => (
      current[productId] === isWishlisted ? current : { ...current, [productId]: isWishlisted }
    ));
  }, []);

  useEffect(() => {
    reset();
    setActiveImageByProduct({});
    setWishlistByProduct({});
  }, [brand, reset]);

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
        <motion.div className={styles.track} {...trackProps}>
          {buffer?.map(({ cycle, index, key }) => {
            const product = content.items[index];
            return (
              <div
                className={styles.cardSlot}
                aria-hidden={cycle !== centerCycle}
                key={key}
              >
                <ProductCard
                  activeImageIndex={activeImageByProduct[product.id] ?? 0}
                  brand={brand}
                  isWishlisted={wishlistByProduct[product.id] === true}
                  onImageChange={setProductImage}
                  onWishlistChange={setProductWishlist}
                  product={product}
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
