import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { ProductVideoStoryContent } from "../../data/products";
import { ENTRANCE_ZOOM } from "../../lib/motion-presets";
import styles from "./ProductVideoStory.module.css";

type ProductVideoStoryProps = {
  brand: BrandId;
  content: ProductVideoStoryContent;
};

export function ProductVideoStory({ brand, content }: ProductVideoStoryProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(Boolean(shouldReduceMotion));

  useEffect(() => {
    setIsPaused(Boolean(shouldReduceMotion));
  }, [content.nodeId, shouldReduceMotion]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !content.videoSrc) {
      return;
    }

    if (isPaused) {
      video.pause();
      return;
    }

    video.muted = true;

    const playVideo = () => {
      void video.play().catch(() => setIsPaused(true));
    };

    if (video.readyState >= 2) {
      playVideo();
      return;
    }

    video.addEventListener("canplay", playVideo, { once: true });

    return () => {
      video.removeEventListener("canplay", playVideo);
    };
  }, [content.videoSrc, isPaused]);

  return (
    <motion.section
      className={styles.section}
      data-brand={brand}
      data-node-id={content.nodeId}
      aria-label={content.ariaLabel}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.frame}>
        {content.videoSrc ? (
          <motion.video
            {...(shouldReduceMotion ? {} : ENTRANCE_ZOOM)}
            ref={videoRef}
            className={styles.media}
            src={content.videoSrc}
            poster={content.posterSrc}
            loop
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <motion.img
            {...(shouldReduceMotion ? {} : ENTRANCE_ZOOM)}
            className={styles.media}
            src={content.posterSrc}
            alt={content.posterAlt}
            loading="eager"
            draggable={false}
          />
        )}

        <motion.h2
          className={styles.title}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductVideoStoryTitle title={content.title} />
        </motion.h2>

        {content.videoSrc ? (
          <motion.button
            className={styles.toggle}
            type="button"
            aria-label={isPaused ? "Play video" : "Pause video"}
            onClick={() => setIsPaused((current) => !current)}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
          >
            <span className={styles.toggleIcon} data-paused={isPaused ? "true" : "false"} aria-hidden="true" />
          </motion.button>
        ) : (
          <span className={styles.toggle} aria-hidden="true">
            <span className={styles.toggleIcon} data-paused="false" />
          </span>
        )}
      </div>
    </motion.section>
  );
}

function ProductVideoStoryTitle({ title }: { title: ProductVideoStoryContent["title"] }) {
  if (title.kind === "split") {
    return (
      <>
        <span className={styles.titleStrong}>{title.strong}</span>
        <span className={styles.titleAccent}>{title.accent}</span>
      </>
    );
  }

  return (
    <>
      {title.lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </>
  );
}
