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
      <img
        className={styles.hotspotImage}
        src="/assets/icons/hotspot.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
    </motion.button>
  );
}
