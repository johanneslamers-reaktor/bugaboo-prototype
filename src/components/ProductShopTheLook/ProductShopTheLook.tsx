import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductShopTheLookContent, ProductShopTheLookProduct } from "../../data/products";
import { Hotspot } from "../Hotspot";
import { useScrollDrag } from "../../hooks/useScrollDrag";
import styles from "./ProductShopTheLook.module.css";

type ProductShopTheLookProps = {
  brand: BrandId;
  content: ProductShopTheLookContent;
};

export function ProductShopTheLook({ brand, content }: ProductShopTheLookProps) {
  const shouldReduceMotion = useReducedMotion();
  const productsRef = useRef<HTMLDivElement | null>(null);
  const productsDrag = useScrollDrag(productsRef);

  // Click a hotspot → scroll the product row to that product card.
  const focusProduct = (index: number) => {
    const scroller = productsRef.current;
    if (!scroller) return;
    const card = scroller.children.item(index) as HTMLElement | null;
    if (!card) return;
    scroller.scrollTo({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      left: card.offsetLeft - scroller.offsetLeft - 16,
    });
  };

  return (
    <section className={styles.section} data-brand={brand} data-node-id={content.nodeId}>
      <div className={styles.top}>
        <h2 className={styles.title}>{content.title}</h2>

        {content.topImage ? (
          <figure className={styles.topImage}>
            <img src={content.topImage.src} alt={content.topImage.alt} loading="lazy" decoding="async" />
          </figure>
        ) : null}

        <h3 className={styles.subheading}>{content.subheading}</h3>
        <p className={styles.body}>{content.body}</p>

        <a className={styles.link} data-icon={content.link.icon ?? "chevron"} href={content.link.href}>
          {content.link.icon === "plus-circle" ? (
            <span className={styles.linkPlusCircle} aria-hidden="true">
              <PlusIcon />
            </span>
          ) : null}
          <span>{content.link.label}</span>
          {content.link.icon !== "plus-circle" ? <ChevronIcon /> : null}
        </a>
      </div>

      <div className={styles.heroWrapper}>
        <div className={styles.heroImageBox}>
          <img
            className={styles.heroImage}
            src={content.heroImage.src}
            alt={content.heroImage.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
          />

          {content.hotspots?.map((hotspot) => (
            <Hotspot
              key={hotspot.id}
              x={hotspot.x}
              y={hotspot.y}
              label={`View ${content.products[hotspot.productIndex]?.title ?? "product"}`}
              onClick={() => focusProduct(hotspot.productIndex)}
            />
          ))}
        </div>

        <div
          className={styles.products}
          ref={productsRef}
          data-dragging={productsDrag.isDragging ? "true" : "false"}
          aria-label={`${content.title} products`}
          {...productsDrag.handlers}
        >
          {content.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              shouldReduceMotion={shouldReduceMotion ?? false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  shouldReduceMotion,
}: {
  product: ProductShopTheLookProduct;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.button
      className={styles.productCard}
      type="button"
      aria-label={`View ${product.title}`}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
    >
      <span className={styles.productThumb}>
        <img src={product.thumbnailSrc} alt={product.thumbnailAlt} loading="lazy" decoding="async" draggable={false} />
      </span>
      <span className={styles.productCopy}>
        <strong>{product.title}</strong>
        <span className={styles.productMeta}>
          <span>{product.colorLabel}</span>
          <span className={styles.productDot} aria-hidden="true" />
          <span>{product.price}</span>
        </span>
      </span>
      <span className={styles.productIcon} aria-hidden="true">
        <ChevronIcon />
      </span>
    </motion.button>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={styles.chevron}>
      <path d="m4.5 2.5 3 3.5-3 3.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.plusIcon}>
      <path d="M8 3.5v9M3.5 8h9" />
    </svg>
  );
}

