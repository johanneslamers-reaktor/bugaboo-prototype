import type { BrandId } from "../../brands/brands";
import type { ProductReviewsContent } from "../../data/products";
import styles from "./ProductReviews.module.css";

type ProductReviewsProps = {
  brand: BrandId;
  content: ProductReviewsContent;
};

/**
 * Static customer-reviews block surfaced at the bottom of every PDP for
 * the user-testing prototype. The checkboxes, "Show all" overlay, and
 * "View reviews" CTA are visual only — there is no real filtering,
 * lightbox, or list expansion behind them.
 */
export function ProductReviews({ brand, content }: ProductReviewsProps) {
  const visiblePhotos = content.photos.slice(0, 2);
  const hasMorePhotos = content.photoTotal > visiblePhotos.length;

  return (
    <section className={styles.reviews} data-brand={brand} aria-label="Customer reviews">
      <h2 className={styles.heading}>Customer reviews</h2>

      <div className={styles.overall}>
        <div className={styles.overallLeft}>
          <StarRow rating={content.overall.rating} outOf={content.overall.outOf} />
          <p className={styles.overallText}>
            <strong>{formatRating(content.overall.rating)}</strong>
            <span className={styles.muted}>/{content.overall.outOf}</span>
            <span className={styles.bullet} aria-hidden="true">•</span>
            <strong>{content.overall.count}</strong> reviews
          </p>
        </div>
        <TrustpilotMark />
      </div>

      <hr className={styles.divider} aria-hidden="true" />

      <div className={styles.photos}>
        {visiblePhotos.map((photo, index) => {
          const isLast = index === visiblePhotos.length - 1;
          return (
            <figure className={styles.photo} key={photo.src}>
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              {isLast && hasMorePhotos ? (
                <span className={styles.photoOverlay} aria-hidden="true">
                  <PhotoIcon />
                  <span>Show all ({content.photoTotal})</span>
                </span>
              ) : null}
            </figure>
          );
        })}
      </div>

      <hr className={styles.divider} aria-hidden="true" />

      <ul className={styles.subRatings}>
        {content.subRatings.map((sub) => (
          <li className={styles.subRow} key={sub.label}>
            <span className={styles.subLabel}>{sub.label}</span>
            <div className={styles.subRight}>
              <StarRow rating={sub.rating} outOf={sub.outOf} compact />
              <span className={styles.subValue}>
                <strong>{formatRating(sub.rating)}</strong>
                <span className={styles.muted}>/{sub.outOf}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>

      <hr className={styles.divider} aria-hidden="true" />

      <div className={styles.distribution}>
        <h3 className={styles.distHeading}>
          Reviews <span className={styles.distTotal}>{content.distribution.total}</span>
        </h3>
        <ul className={styles.distList}>
          {content.distribution.buckets.map((bucket) => (
            <li className={styles.distRow} key={bucket.label}>
              <span className={styles.checkbox} aria-hidden="true" />
              <span className={styles.distLabel}>{bucket.label}</span>
              <span className={styles.bar} aria-hidden="true">
                <span className={styles.barFill} style={{ width: `${bucket.percent}%` }} />
              </span>
              <span className={styles.distPercent}>{bucket.percent}%</span>
            </li>
          ))}
        </ul>
      </div>

      <button className={styles.viewAll} type="button">
        <span>View reviews</span>
        <PlusIcon />
      </button>
    </section>
  );
}

function StarRow({
  rating,
  outOf,
  compact = false,
}: {
  rating: number;
  outOf: number;
  compact?: boolean;
}) {
  return (
    <div
      className={`${styles.stars} ${compact ? styles.starsCompact : ""}`.trim()}
      role="img"
      aria-label={`${rating} out of ${outOf} stars`}
    >
      {Array.from({ length: outOf }, (_, index) => {
        const fill = clamp01(rating - index);
        return <StarTile key={index} fill={fill} />;
      })}
    </div>
  );
}

function StarTile({ fill }: { fill: number }) {
  // Trustpilot style: each star sits in a coloured tile (green when filled,
  // muted gray when empty). Partial fills (e.g. 4.4) show a green slice
  // behind the white star in the last tile.
  const greenStop = `${Math.round(fill * 100)}%`;
  return (
    <span className={styles.starTile} aria-hidden="true">
      <span
        className={styles.starBg}
        style={{ background: `linear-gradient(to right, #00b67a ${greenStop}, #dcdce6 ${greenStop})` }}
      />
      <StarIcon />
    </span>
  );
}

function StarIcon() {
  return (
    <svg className={styles.starIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3.2 14.6 9 21 9.7l-4.7 4.4 1.3 6.2L12 17.2 6.4 20.3l1.3-6.2L3 9.7 9.4 9z"
        fill="#ffffff"
      />
    </svg>
  );
}

function TrustpilotMark() {
  return (
    <span className={styles.trustpilot} aria-label="Trustpilot">
      <StarTile fill={1} />
      <span className={styles.trustpilotText}>Trustpilot</span>
    </span>
  );
}

function PhotoIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.photoIcon} aria-hidden="true">
      <path
        d="M4 5h16v14H4z M4 17l5-5 4 4 3-3 4 4"
        fill="none"
        stroke="#ffffff"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="10" r="1.4" fill="#ffffff" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.plusIcon} aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function clamp01(value: number) {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function formatRating(value: number) {
  // 4.7 → "4.7", 4 → "4.0". Locale-safe.
  return value.toFixed(1);
}
