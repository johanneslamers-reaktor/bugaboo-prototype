import { motion, useReducedMotion } from "motion/react";
import styles from "./Hotspot.module.css";

export interface HotspotProps {
  /** Position in percent of the parent image (0-100). */
  x: number;
  y: number;
  /** Accessible label, e.g. "View product Foo". */
  label: string;
  /** Whether the hotspot is in an "active/selected" state visually. */
  isActive?: boolean;
  /** Click handler. */
  onClick?: () => void;
  /** Optional aria-expanded if the dot toggles a tooltip. */
  ariaExpanded?: boolean;
}

/**
 * Shared image hotspot used by ProductSustainability, ProductShopTheLook,
 * etc. Renders the universal Figma icon (assets/icons/hotspot.svg) at the
 * given x/y position relative to the parent.
 *
 * The translate(-50%) anchor is driven via motion's style x/y so whileTap's
 * scale composes correctly instead of replacing the CSS transform.
 */
export function Hotspot({ x, y, label, isActive, onClick, ariaExpanded }: HotspotProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      className={styles.hotspot}
      type="button"
      style={{ left: `${x}%`, top: `${y}%`, x: "-50%", y: "-50%" }}
      aria-label={label}
      aria-expanded={ariaExpanded}
      data-active={isActive ? "true" : "false"}
      onClick={onClick}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
    >
      {/*
        Inline SVG (instead of an external file) — the Figma source uses
        <foreignObject> for the backdrop-blur, which doesn't render when
        loaded via <img src>. Inlining lets us keep the layered ring +
        center dot look without needing a backdrop filter.
      */}
      <svg
        className={styles.hotspotImage}
        viewBox="0 0 38 38"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="19" cy="19" r="17" fill="rgba(89, 89, 89, 0.5)" />
        <circle cx="19" cy="19" r="18" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
        <circle cx="19" cy="19" r="4" fill="white" />
      </svg>
    </motion.button>
  );
}
