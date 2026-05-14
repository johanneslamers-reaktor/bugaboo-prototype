import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductFeatureBenefitsContent, ProductFeatureBenefitItem } from "../../data/products";
import { Carousel, useCarousel } from "../Carousel";
import styles from "./ProductFeatureBenefits.module.css";

type ProductFeatureBenefitsProps = {
  brand: BrandId;
  content: ProductFeatureBenefitsContent;
};

export function ProductFeatureBenefits({ brand, content }: ProductFeatureBenefitsProps) {
  const [openHotspots, setOpenHotspots] = useState<Record<string, string | null>>({});
  const shouldReduceMotion = useReducedMotion();

  const items = content.items.map((item, index) => (
    <FeatureCard
      brand={brand}
      index={index}
      item={item}
      key={item.id}
      openHotspotId={openHotspots[item.id] ?? null}
      shouldReduceMotion={shouldReduceMotion ?? false}
      onToggleHotspot={(hotspotId) =>
        setOpenHotspots((current) => ({
          ...current,
          [item.id]: current[item.id] === hotspotId ? null : hotspotId,
        }))
      }
      onCloseHotspot={() =>
        setOpenHotspots((current) => ({ ...current, [item.id]: null }))
      }
    />
  ));

  return (
    <section className={styles.section} data-brand={brand} data-node-id={content.nodeId}>
      <h2 className={styles.heading}>{content.title}</h2>

      <Carousel items={items} gap={8} loop={false} ariaLabel={content.title}>
        <FeatureControls shouldReduceMotion={shouldReduceMotion ?? false} />
      </Carousel>
    </section>
  );
}

function FeatureControls({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  const { nextPage, prevPage, isNextActive, isPrevActive } = useCarousel();

  return (
    <div className={styles.controls} aria-label="Feature carousel controls">
      <motion.button
        className={styles.control}
        type="button"
        aria-label="Previous feature"
        disabled={!isPrevActive}
        onClick={prevPage}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      >
        <ChevronIcon direction="previous" />
      </motion.button>
      <motion.button
        className={styles.control}
        type="button"
        aria-label="Next feature"
        disabled={!isNextActive}
        onClick={nextPage}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      >
        <ChevronIcon direction="next" />
      </motion.button>
    </div>
  );
}

function FeatureCard({
  brand,
  index,
  item,
  openHotspotId,
  onToggleHotspot,
  onCloseHotspot,
  shouldReduceMotion,
}: {
  brand: BrandId;
  index: number;
  item: ProductFeatureBenefitItem;
  openHotspotId: string | null;
  onToggleHotspot: (hotspotId: string) => void;
  onCloseHotspot: () => void;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.article
      className={styles.card}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.38, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <figure className={styles.media}>
        {item.media.type === "video" ? (
          <video
            src={item.media.src}
            poster={item.media.posterSrc}
            aria-label={item.media.alt}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{ objectPosition: item.media.objectPosition }}
          />
        ) : (
          <img
            src={item.media.src}
            alt={item.media.alt}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            style={{ objectPosition: item.media.objectPosition }}
          />
        )}
        {item.media.overlayTitle ? (
          <figcaption className={styles.overlayTitle}>{item.media.overlayTitle}</figcaption>
        ) : null}
        {item.hotspots?.map((hotspot) => {
          const isOpen = openHotspotId === hotspot.id;
          return (
            <span className={styles.hotspotLayer} key={hotspot.id}>
              <motion.button
                className={styles.hotspot}
                type="button"
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, x: "-50%", y: "-50%" }}
                aria-label={isOpen ? `Close ${hotspot.title}` : `Open ${hotspot.title}`}
                aria-expanded={isOpen}
                onClick={() => onToggleHotspot(hotspot.id)}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
              />
              {isOpen ? (
                <motion.div
                  className={styles.hotspotPanel}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  {hotspot.imageSrc ? (
                    <img src={hotspot.imageSrc} alt={hotspot.imageAlt ?? ""} loading="lazy" />
                  ) : null}
                  <p>
                    <strong>{hotspot.title}</strong>
                    <span>{hotspot.body}</span>
                  </p>
                  <button
                    className={styles.hotspotClose}
                    type="button"
                    aria-label={`Close ${hotspot.title}`}
                    onClick={onCloseHotspot}
                  >
                    <CloseIcon />
                  </button>
                </motion.div>
              ) : null}
            </span>
          );
        })}
        {item.media.type === "video" ? (
          <span className={styles.playBadge} aria-hidden="true">
            {brand === "bugaboo" ? <PauseIcon /> : <PlayIcon />}
          </span>
        ) : null}
      </figure>

      <div className={styles.copyRow}>
        {item.iconSrc ? (
          <span className={styles.iconFrame} aria-hidden="true">
            <img src={item.iconSrc} alt="" loading="lazy" draggable={false} />
          </span>
        ) : null}
        <div className={styles.copy}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      </div>
    </motion.article>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 4.25v7.5l5.5-3.75L6 4.25Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5.25 3.8h1.7v8.4h-1.7V3.8Zm3.8 0h1.7v8.4h-1.7V3.8Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m4.25 4.25 7.5 7.5M11.75 4.25l-7.5 7.5" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" data-direction={direction}>
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}
