import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { BrandUspContent, BrandUspTitle } from "../../data/homepage";
import styles from "./BrandUsp.module.css";

type BrandUspProps = {
  brand: BrandId;
  content: BrandUspContent;
};

export function BrandUsp({ brand, content }: BrandUspProps) {
  const reelVideoRef = useRef<HTMLVideoElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activePoint, setActivePoint] = useState(0);
  const [isReelExpanded, setIsReelExpanded] = useState(false);

  useEffect(() => {
    setActivePoint(0);
    setIsReelExpanded(false);
  }, [brand]);

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
      id="brand-usp"
      aria-labelledby={`${brand}-brand-usp-title`}
    >
      <div className={styles.section} data-brand={brand} data-reel-expanded={isReelExpanded ? "true" : "false"}>
        <div className={styles.inner}>
          <div className={styles.heroBlock}>
            <UspHeading id={`${brand}-brand-usp-title`} title={content.title} />
            {/*
              Crossfade between point images by toggling opacity. All images
              render simultaneously so there's never a frame where the
              imageFrame background shows through.
            */}
            <div className={styles.imageFrame} data-usp-index={activePoint}>
              {content.points.map((point, index) => {
                const isActive = index === activePoint;
                const src = point.imageSrc ?? content.imageSrc;
                const alt = point.imageAlt ?? content.imageAlt;
                return (
                  <motion.img
                    key={src}
                    className={styles.image}
                    src={src}
                    alt={alt}
                    loading="eager"
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : 1.08,
                    }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
                    }
                    style={{ zIndex: isActive ? 2 : 1 }}
                  />
                );
              })}
            </div>
          </div>

          <div className={styles.points} aria-label="Brand commitments">
            {content.points.map((point, index) => {
              const isActive = index === activePoint;

              return (
                <article className={styles.point} data-active={isActive ? "true" : "false"} key={point.title}>
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
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
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
              <img
                className={styles.reelThumb}
                src={content.reel.thumbnailSrc}
                alt={content.reel.thumbnailAlt}
                loading="lazy"
                width={92}
                height={72}
              />
              <span className={styles.reelLabel}>{content.reel.label}</span>
            </motion.span>

            <motion.span className={styles.reelExpanded} animate={{ opacity: isReelExpanded ? 1 : 0 }}>
              <video
                ref={reelVideoRef}
                className={styles.reelVideo}
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

function UspHeading({ id, title }: { id: string; title: BrandUspTitle }) {
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
