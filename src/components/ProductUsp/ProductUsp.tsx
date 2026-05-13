import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
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
  const sceneRef = useRef<HTMLElement | null>(null);
  const reelVideoRef = useRef<HTMLVideoElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
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
  }, [brand, content.nodeId]);

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

    const nextPoint = Math.min(content.points.length - 1, Math.floor(latest * content.points.length));
    setActivePoint(nextPoint);
  });

  const scrollToPoint = useCallback((index: number) => {
    setActivePoint(index);

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
