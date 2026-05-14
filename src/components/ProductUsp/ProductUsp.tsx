import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductUspContent } from "../../data/products";
import styles from "./ProductUsp.module.css";

type ProductUspProps = {
  brand: BrandId;
  content: ProductUspContent;
};

export function ProductUsp({ brand, content }: ProductUspProps) {
  const [activePoint, setActivePoint] = useState(0);
  const [isReelExpanded, setIsReelExpanded] = useState(false);
  const reelVideoRef = useRef<HTMLVideoElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setActivePoint(0);
    setIsReelExpanded(false);
  }, [brand, content.nodeId]);

  useEffect(() => {
    const video = reelVideoRef.current;
    if (!video) return;

    if (!isReelExpanded) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    video.muted = true;
    video.currentTime = 0;
    const playVideo = () => {
      void video.play().catch(() => undefined);
    };

    if (video.readyState >= 2) {
      playVideo();
      return;
    }

    video.load();
    video.addEventListener("canplay", playVideo, { once: true });
    return () => {
      video.removeEventListener("canplay", playVideo);
    };
  }, [content.reel.videoSrc, isReelExpanded]);

  return (
    <section
      className={styles.scene}
      data-brand={brand}
      data-reel-expanded={isReelExpanded ? "true" : "false"}
      data-node-id={content.nodeId}
      aria-labelledby={`${brand}-product-usp-title`}
    >
      <div className={styles.section} data-brand={brand} data-reel-expanded={isReelExpanded ? "true" : "false"}>
        <div className={styles.inner}>
          <div className={styles.hero}>
            <ProductUspHeading id={`${brand}-product-usp-title`} title={content.title} />
            <motion.div
              className={styles.imageFrame}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src={content.imageSrc}
                alt={content.imageAlt}
                loading="lazy"
                draggable={false}
                initial={shouldReduceMotion ? false : { scale: 1.06 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          </div>

          <div className={styles.points} aria-label="Product benefits">
            {content.points.map((point, index) => {
              const isActive = index === activePoint;

              return (
                <article className={styles.point} data-active={isActive ? "true" : "false"} key={point.id}>
                  <span className={styles.rail} aria-hidden="true">
                    <span className={styles.railProgress} data-active={isActive ? "true" : "false"} />
                  </span>
                  <div className={styles.pointCopy}>
                    <h3>
                      <button
                        className={styles.pointButton}
                        type="button"
                        aria-current={isActive ? "true" : undefined}
                        onClick={() => setActivePoint(index)}
                      >
                        {point.title}
                      </button>
                    </h3>
                    {isActive ? (
                      <motion.p
                        className={styles.pointDescription}
                        key={point.id}
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {point.description}
                      </motion.p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>

          <motion.button
            className={styles.reel}
            data-expanded={isReelExpanded ? "true" : "false"}
            type="button"
            aria-expanded={isReelExpanded}
            onClick={() => setIsReelExpanded((current) => !current)}
            animate={{ height: isReelExpanded ? 244 : brand === "joolz" ? 88 : 89 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span className={styles.reelCollapsed} animate={{ opacity: isReelExpanded ? 0 : 1 }}>
              <img src={content.reel.thumbnailSrc} alt={content.reel.thumbnailAlt} loading="lazy" draggable={false} />
              <span>{content.reel.label}</span>
            </motion.span>
            <motion.span className={styles.reelExpanded} animate={{ opacity: isReelExpanded ? 1 : 0 }}>
              <video
                ref={reelVideoRef}
                src={content.reel.videoSrc}
                loop
                muted
                playsInline
                preload={isReelExpanded ? "auto" : "metadata"}
              />
            </motion.span>
            <span className={styles.reelIcon} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function ProductUspHeading({
  id,
  title,
}: {
  id: string;
  title: ProductUspContent["title"];
}) {
  if (title.kind === "highlight") {
    return (
      <h2 className={styles.heading} id={id}>
        <span>{title.before}</span>
        <mark>{title.highlight}</mark>
      </h2>
    );
  }

  return (
    <h2 className={styles.heading} id={id}>
      {title.lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </h2>
  );
}
