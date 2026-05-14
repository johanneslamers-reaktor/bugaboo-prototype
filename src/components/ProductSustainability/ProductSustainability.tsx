import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type {
  ProductSustainabilityContent,
  ProductSustainabilityHotspot,
} from "../../data/products";
import styles from "./ProductSustainability.module.css";

type ProductSustainabilityProps = {
  brand: BrandId;
  content: ProductSustainabilityContent;
};

export function ProductSustainability({ brand, content }: ProductSustainabilityProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [openHotspotId, setOpenHotspotId] = useState<string | null>(null);
  const activeImage = content.gallery[activeIndex] ?? content.gallery[0];

  if (!activeImage) return null;

  const selectImage = (index: number) => {
    setActiveIndex(index);
    setOpenHotspotId(null);
  };

  return (
    <section className={styles.section} data-brand={brand} data-node-id={content.nodeId}>
      <div className={styles.top}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 className={styles.title}>{content.title}</h2>

        {content.topImage ? (
          <figure className={styles.topImage}>
            <img src={content.topImage.src} alt={content.topImage.alt} loading="lazy" decoding="async" />
          </figure>
        ) : null}

        {content.decoration ? (
          <figure className={styles.decoration} aria-hidden="true">
            <img src={content.decoration.src} alt={content.decoration.alt} loading="lazy" decoding="async" />
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

      <div className={styles.galleryWrapper}>
        <div className={styles.imageStage}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={activeImage.id}
              className={styles.galleryImage}
              src={activeImage.src}
              alt={activeImage.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>

          {activeImage.hotspots.map((hotspot) => (
            <HotspotDot
              key={hotspot.id}
              brand={brand}
              hotspot={hotspot}
              isOpen={openHotspotId === hotspot.id}
              onToggle={() =>
                setOpenHotspotId((current) => (current === hotspot.id ? null : hotspot.id))
              }
              shouldReduceMotion={shouldReduceMotion ?? false}
            />
          ))}

          {/*
            Tooltip card lives OUTSIDE the hotspot layer so it can be centered
            within the gallery (full width minus inset) instead of anchored to
            the dot. This keeps it on-page no matter where the dot sits.
          */}
          <AnimatePresence>
            {activeImage.hotspots.map((hotspot) =>
              openHotspotId === hotspot.id ? (
                <HotspotCard
                  key={hotspot.id}
                  hotspot={hotspot}
                  onClose={() => setOpenHotspotId(null)}
                  shouldReduceMotion={shouldReduceMotion ?? false}
                />
              ) : null,
            )}
          </AnimatePresence>

          <div className={styles.thumbnailRow} aria-label={`${content.title} gallery`}>
            <div className={styles.thumbnails} role="tablist">
              {content.gallery.map((image, index) => (
                <button
                  key={image.id}
                  className={styles.thumbnail}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={image.thumbnailAlt}
                  data-active={index === activeIndex ? "true" : "false"}
                  onClick={() => selectImage(index)}
                >
                  <img src={image.thumbnailSrc} alt="" loading="lazy" decoding="async" draggable={false} />
                </button>
              ))}
            </div>
            {content.thumbnailsCounter ? (
              <p className={styles.counter} aria-hidden="true">{content.thumbnailsCounter}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function HotspotDot({
  brand,
  hotspot,
  isOpen,
  onToggle,
  shouldReduceMotion,
}: {
  brand: BrandId;
  hotspot: ProductSustainabilityHotspot;
  isOpen: boolean;
  onToggle: () => void;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.button
      className={styles.hotspotDot}
      type="button"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      aria-label={isOpen ? `Close ${hotspot.title}` : `Open ${hotspot.title}`}
      aria-expanded={isOpen}
      onClick={onToggle}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
      data-active={isOpen ? "true" : "false"}
    >
      <img
        className={styles.hotspotDotImage}
        src={`/assets/pdp/sustainability/${brand}/hotspot.svg`}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
    </motion.button>
  );
}

function HotspotCard({
  hotspot,
  onClose,
  shouldReduceMotion,
}: {
  hotspot: ProductSustainabilityHotspot;
  onClose: () => void;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.div
      className={styles.hotspotCard}
      // Anchor the card just below the dot via a CSS custom property — keeps
      // it visually close to the point on the y-axis. CSS handles the
      // horizontal centering + clamping inside the image bounds.
      style={{ "--hotspot-y": `${hotspot.y}%` } as React.CSSProperties}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-label={hotspot.title}
    >
      {hotspot.iconSrc ? (
        <span className={styles.hotspotCardThumb}>
          <img src={hotspot.iconSrc} alt={hotspot.iconAlt ?? ""} loading="lazy" />
        </span>
      ) : null}
      <div className={styles.hotspotCardCopy}>
        <strong>{hotspot.title}</strong>
        <span>{hotspot.body}</span>
      </div>
      <button
        className={styles.hotspotCardClose}
        type="button"
        aria-label={`Close ${hotspot.title}`}
        onClick={onClose}
      >
        <CloseIcon />
      </button>
    </motion.div>
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

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.closeIcon}>
      <path d="m4.25 4.25 7.5 7.5M11.75 4.25l-7.5 7.5" />
    </svg>
  );
}
