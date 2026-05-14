import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { BrandUspContent, BrandUspTitle } from "../../data/homepage";
import styles from "./BrandUsp.module.css";

type BrandUspProps = {
  brand: BrandId;
  content: BrandUspContent;
};

export function BrandUsp({ brand, content }: BrandUspProps) {
  const sceneRef = useRef<HTMLElement | null>(null);
  const reelVideoRef = useRef<HTMLVideoElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activePoint, setActivePoint] = useState(0);
  const [isReelExpanded, setIsReelExpanded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });
  const activeRailHeight = brand === "joolz" ? 96 : 84;
  const startingRailHeight = brand === "joolz" ? 23 : 27;
  const progressRailHeight = useTransform(scrollYProgress, (latest) => {
    if (shouldReduceMotion) {
      return `${startingRailHeight}px`;
    }

    const segmentCount = Math.max(content.points.length, 1);
    const scaledProgress = Math.min(latest * segmentCount, segmentCount - 0.001);
    const segmentProgress = scaledProgress - Math.floor(scaledProgress);
    const height = startingRailHeight + segmentProgress * (activeRailHeight - startingRailHeight);

    return `${height}px`;
  });
  useEffect(() => {
    setActivePoint(0);
    setIsReelExpanded(false);
  }, [brand]);

  useEffect(() => {
    const video = reelVideoRef.current;

    if (!video) {
      return;
    }

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

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (shouldReduceMotion) {
      return;
    }

    // Freeze active-point tracking while the reel is expanded.
    // Otherwise the section's height grows, scrollYProgress at the same
    // scroll position changes, and the USP highlight flips mid-animation —
    // which reads as the page "jumping" when the reel opens/closes.
    if (isReelExpanded) {
      return;
    }

    const nextPoint = Math.min(content.points.length - 1, Math.floor(latest * content.points.length));
    setActivePoint(nextPoint);
  });

  const scrollToPoint = useCallback((index: number) => {
    const scene = sceneRef.current;

    if (!scene) {
      return;
    }

    const pointCount = Math.max(content.points.length, 1);
    const sceneTop = scene.getBoundingClientRect().top + window.scrollY;
    const scrollableDistance = Math.max(scene.offsetHeight - window.innerHeight, 0);
    const targetProgress = Math.min(0.98, (index + 0.08) / pointCount);

    window.scrollTo({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      top: sceneTop + scrollableDistance * targetProgress,
    });
  }, [content.points.length, shouldReduceMotion]);

  return (
    <section
      ref={sceneRef}
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
              All USP images render at once, layered absolutely. The active
              one fades to opacity 1 while the previous fades to 0 — both
              transitions run simultaneously so there is never a frame
              where the imageFrame background shows through.
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
                    {isActive ? (
                      <motion.span className={styles.railProgress} style={{ height: progressRailHeight }} />
                    ) : null}
                  </span>
                  <div className={styles.pointCopy}>
                    <h3>
                      <button
                        className={styles.pointButton}
                        type="button"
                        aria-current={isActive ? "true" : undefined}
                        onClick={() => scrollToPoint(index)}
                      >
                        {point.title}
                      </button>
                    </h3>
                    {isActive ? (
                      <motion.p
                        className={styles.pointDescription}
                        initial={{ opacity: 0, y: 4 }}
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
