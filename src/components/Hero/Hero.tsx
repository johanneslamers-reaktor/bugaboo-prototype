import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
import type { HeroContent } from "../../data/homepage";
import { ENTRANCE_ZOOM } from "../../lib/motion-presets";
import { MobileNavigation } from "../MobileNavigation";
import styles from "./Hero.module.css";

type HeroProps = {
  brand: BrandId;
  content: HeroContent;
  onLogoDoubleClick?: () => void;
};

export function Hero({ brand, content, onLogoDoubleClick }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const togglePlayback = async () => {
    const video = videoRef.current;

    if (!video) {
      setIsPaused((current) => !current);
      return;
    }

    if (video.paused) {
      await video.play();
      setIsPaused(false);
      return;
    }

    video.pause();
    setIsPaused(true);
  };

  return (
    <section className={styles.hero} data-brand={brand} data-node-id={content.nodeId}>
      <div className={styles.media} aria-hidden="true">
        {content.videoSrc ? (
          <motion.video
            {...(shouldReduceMotion ? {} : ENTRANCE_ZOOM)}
            ref={videoRef}
            className={styles.video}
            src={content.videoSrc}
            poster={content.posterSrc}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <div className={styles.fallbackMedia} />
        )}
      </div>

      <MobileNavigation
        brand={brand}
        className={styles.navigation}
        onLogoDoubleClick={onLogoDoubleClick}
      />

      <div className={styles.copy}>
        <HeroHeading title={content.title} />
        <p className={styles.subtitle}>{content.subtitle}</p>
      </div>

      <nav className={styles.categoryNav} aria-label="Hero categories">
        {content.categories.map((row, index) => (
          <div className={styles.categoryRow} key={index}>
            {row.map((category) => (
              <a href={`#${category.toLowerCase().replaceAll(" ", "-")}`} key={category}>
                {category}
              </a>
            ))}
          </div>
        ))}
      </nav>

      <button
        className={styles.playbackButton}
        type="button"
        aria-label={isPaused ? "Play hero video" : "Pause hero video"}
        aria-pressed={isPaused}
        onClick={togglePlayback}
      >
        {isPaused ? <PlayIcon /> : <PauseIcon />}
      </button>
    </section>
  );
}

function HeroHeading({ title }: { title: HeroContent["title"] }) {
  if (title.kind === "highlight") {
    return (
      <h1 className={styles.heading}>
        <span>{title.before}</span>
        <mark>{title.highlight}</mark>
      </h1>
    );
  }

  return (
    <h1 className={styles.heading}>
      {title.lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </h1>
  );
}

function PauseIcon() {
  return (
    <svg className={styles.playbackIcon} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M7.5 6.5v7" />
      <path d="M12.5 6.5v7" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className={styles.playbackIcon} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M8 6.5v7l5.5-3.5L8 6.5Z" />
    </svg>
  );
}
