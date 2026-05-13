import { useState } from "react";
import type { BrandId } from "../../brands/brands";
import type { ProductColorway, ProductDetail } from "../../data/products";
import styles from "./ProductSummary.module.css";

type ProductSummaryProps = {
  brand: BrandId;
  product: ProductDetail;
  selectedColorway: ProductColorway;
  onColorwayChange: (colorwayId: string) => void;
};

export function ProductSummary({
  brand,
  product,
  selectedColorway,
  onColorwayChange,
}: ProductSummaryProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const accessibleProductName = `${product.title}${product.titleSuffix ?? ""}`;

  return (
    <section
      className={styles.summary}
      data-brand={brand}
      data-node-id={brand === "joolz" ? "8680:4814" : "8680:4813"}
    >
      <div className={styles.productInfo}>
        <div className={styles.titleGroup}>
          <div className={styles.brandRow}>
            <p className={styles.brandLabel}>{product.brandLabel}</p>
            <button
              className={styles.wishlistButton}
              type="button"
              aria-label={isWishlisted ? `Remove ${accessibleProductName} from wishlist` : `Add ${accessibleProductName} to wishlist`}
              aria-pressed={isWishlisted}
              onClick={() => setIsWishlisted((current) => !current)}
            >
              <HeartIcon isFilled={isWishlisted} />
            </button>
          </div>
          <h1 className={styles.productTitle}>
            {product.title}
            {product.titleSuffix ? <sup>{product.titleSuffix}</sup> : null}
          </h1>
          <p className={styles.productSubtitle}>{product.subtitle}</p>
        </div>

        <div className={styles.commerceRow}>
          <p className={styles.price}>{product.price}</p>

          <div className={styles.statusRow}>
            <div className={styles.ratingPill} aria-label={`${product.rating} out of 5, ${product.reviewCount}`}>
              <StarIcon />
              <span className={styles.ratingValue}>{product.rating}</span>
              <span className={styles.ratingDivider} aria-hidden="true" />
              <span className={styles.reviewCount}>{product.reviewCount}</span>
            </div>
            <p className={styles.stockStatus}>{product.stockStatus}</p>
          </div>
        </div>

        <p className={styles.description}>{product.description}</p>
      </div>

      <div className={styles.colorwayBlock} aria-labelledby={`${product.slug}-colorway-label`}>
        <div className={styles.colorwayScroller} role="listbox" aria-label="Choose a color">
          {product.colorways.map((colorway) => {
            const previewSrc = colorway.media[0]?.src ?? colorway.thumbnailSrc;

            return (
              <button
                className={styles.colorwayOption}
                data-active={colorway.id === selectedColorway.id}
                type="button"
                role="option"
                aria-label={`Show ${colorway.name}`}
                aria-selected={colorway.id === selectedColorway.id}
                onClick={() => onColorwayChange(colorway.id)}
                key={colorway.id}
              >
                {previewSrc ? (
                  <img src={previewSrc} alt="" loading="lazy" draggable={false} />
                ) : (
                  <span className={styles.swatchFallback} style={{ background: colorway.swatch }} />
                )}
              </button>
            );
          })}
        </div>
        <p className={styles.colorwayName} id={`${product.slug}-colorway-label`}>
          {selectedColorway.name}
        </p>
      </div>
    </section>
  );
}

function HeartIcon({ isFilled }: { isFilled: boolean }) {
  return (
    <svg className={styles.heartIcon} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M7.98 13.2s-5.35-3.02-5.35-7.03c0-1.7 1.1-2.92 2.67-2.92 1 0 1.95.58 2.68 1.5.73-.92 1.68-1.5 2.69-1.5 1.57 0 2.66 1.22 2.66 2.92 0 4.01-5.35 7.03-5.35 7.03Z"
        fill={isFilled ? "currentColor" : "none"}
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className={styles.starIcon} viewBox="0 0 12 12" aria-hidden="true">
      <path d="m6 1 1.54 3.12 3.46.5-2.5 2.43.59 3.45L6 8.87 2.91 10.5l.59-3.45L1 4.62l3.46-.5L6 1Z" />
    </svg>
  );
}
