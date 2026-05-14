import { useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductCrossSellContent, ProductCrossSellItem } from "../../data/products";
import { Carousel } from "../Carousel";
import styles from "./ProductCrossSell.module.css";

type ProductCrossSellProps = {
  brand: BrandId;
  content: ProductCrossSellContent;
};

export function ProductCrossSell({ brand, content }: ProductCrossSellProps) {
  const [wishlistById, setWishlistById] = useState<Record<string, boolean>>({});
  const [addedById, setAddedById] = useState<Record<string, boolean>>({});

  const items = content.items.map((item) => (
    <CrossSellCard
      brand={brand}
      isAdded={addedById[item.id] === true}
      isWishlisted={wishlistById[item.id] === true}
      item={item}
      key={item.id}
      onAdd={() => {
        setAddedById((current) => ({ ...current, [item.id]: !current[item.id] }));
      }}
      onWishlist={() => {
        setWishlistById((current) => ({ ...current, [item.id]: !current[item.id] }));
      }}
    />
  ));

  return (
    <section className={styles.section} data-brand={brand} data-node-id={content.nodeId}>
      <h2 className={styles.heading}>{content.title}</h2>
      <Carousel
        items={items}
        gap={8}
        inset={brand === "joolz" ? 20 : 16}
        loop
        ariaLabel={content.title}
      />
    </section>
  );
}

function CrossSellCard({
  brand,
  isAdded,
  isWishlisted,
  item,
  onAdd,
  onWishlist,
}: {
  brand: BrandId;
  isAdded: boolean;
  isWishlisted: boolean;
  item: ProductCrossSellItem;
  onAdd: () => void;
  onWishlist: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      className={styles.card}
      data-brand={brand}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.mediaBlock}>
        <div className={styles.media}>
          {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
          <motion.button
            className={styles.wishlist}
            data-active={isWishlisted ? "true" : "false"}
            type="button"
            aria-label={isWishlisted ? `Remove ${item.title} from wishlist` : `Add ${item.title} to wishlist`}
            aria-pressed={isWishlisted}
            onClick={(event) => {
              event.stopPropagation();
              onWishlist();
            }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
          >
            <HeartIcon filled={isWishlisted} />
          </motion.button>
          <img src={item.imageSrc} alt={item.imageAlt} loading="lazy" decoding="async" draggable={false} />
        </div>
        <div className={styles.imageProgress} aria-hidden="true">
          <span />
        </div>
      </div>

      <div className={styles.copy}>
        <div className={styles.titleRow}>
          <h3>{item.title}</h3>
          {item.rating ? (
            <span className={styles.rating} aria-label={`${item.rating} out of 5 stars`}>
              <StarIcon />
              {item.rating}
            </span>
          ) : null}
        </div>
        {item.subtitle ? <p className={styles.subtitle}>{item.subtitle}</p> : null}

        {brand === "joolz" ? (
          <>
            <p className={styles.stockLine}>
              {item.colorLabel} <span aria-hidden="true">•</span> {item.stockStatus}
            </p>
            <div className={styles.commerceRow}>
              <Price item={item} />
              <span className={styles.divider} aria-hidden="true" />
              <button
                className={styles.inlineAdd}
                type="button"
                aria-pressed={isAdded}
                onClick={(event) => {
                  event.stopPropagation();
                  onAdd();
                }}
              >
                {isAdded ? "Added" : "Add to cart"}
              </button>
            </div>
            <Swatches brand={brand} item={item} />
          </>
        ) : (
          <>
            <Price item={item} />
            <Swatches brand={brand} item={item} />
            <p className={styles.stockLine}>
              {item.colorLabel} <span aria-hidden="true">•</span> {item.stockStatus}
            </p>
            <motion.button
              className={styles.addButton}
              type="button"
              aria-pressed={isAdded}
              onClick={(event) => {
                event.stopPropagation();
                onAdd();
              }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            >
              <PlusIcon />
              {isAdded ? "Added" : "Add to cart"}
            </motion.button>
          </>
        )}
      </div>
    </motion.article>
  );
}

function Price({ item }: { item: ProductCrossSellItem }) {
  return (
    <p className={styles.price}>
      {item.compareAtPrice ? <span>{item.compareAtPrice}</span> : null}
      <strong>{item.price}</strong>
    </p>
  );
}

function Swatches({ brand, item }: { brand: BrandId; item: ProductCrossSellItem }) {
  return (
    <div className={styles.swatches} aria-label={`${item.title} colors`}>
      {item.swatches.map((swatch, index) => (
        <span
          className={styles.swatch}
          data-active={index === 0 ? "true" : "false"}
          data-brand={brand}
          key={swatch.id}
          style={{ "--swatch-color": swatch.color } as CSSProperties}
          title={swatch.label}
        />
      ))}
      {item.moreColorsLabel ? <span className={styles.moreColors}>{item.moreColorsLabel}</span> : null}
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20.25s-7.25-4.4-7.25-10a4.12 4.12 0 0 1 7.25-2.68 4.12 4.12 0 0 1 7.25 2.68c0 5.6-7.25 10-7.25 10Z"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 6.5v11M6.5 12h11" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className={styles.starIcon} viewBox="0 0 16 16" aria-hidden="true">
      <path d="m8 1.7 1.76 3.7 4.04.54-2.96 2.8.74 4.02L8 10.8l-3.58 1.96.74-4.02-2.96-2.8 4.04-.54L8 1.7Z" />
    </svg>
  );
}
