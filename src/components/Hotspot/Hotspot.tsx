import { motion, useReducedMotion } from "motion/react";
import type { BrandId } from "../../brands/brands";
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
  /**
   * Optional brand variant. Joolz uses a target-style 4-circle dot
   * (white outer / blue ring / white inner / blue center) per Vanessa's
   * design; everything else uses the default gray + translucent ring.
   */
  brand?: BrandId;
}

/**
 * Shared image hotspot used by ProductSustainability, ProductShopTheLook,
 * etc. Renders the universal Figma icon (assets/icons/hotspot.svg) at the
 * given x/y position relative to the parent.
 *
 * The translate(-50%) anchor is driven via motion's style x/y so whileTap's
 * scale composes correctly instead of replacing the CSS transform.
 */
export function Hotspot({ x, y, label, isActive, onClick, ariaExpanded, brand }: HotspotProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      className={styles.hotspot}
      type="button"
      style={{ left: `${x}%`, top: `${y}%`, x: "-50%", y: "-50%" }}
      aria-label={label}
      aria-expanded={ariaExpanded}
      data-active={isActive ? "true" : "false"}
      data-brand={brand}
      onClick={onClick}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
    >
      {brand === "joolz" ? (
        /*
         * Joolz target-style dot — built 1:1 from Vanessa's exported SVG
         * (Figma node 8656:16085).
         *   - foreignObject with backdrop-filter: blur(19.64px) so the
         *     fabric/image behind the dot is softened (subtle "frosted"
         *     halo effect)
         *   - Solid near-white #FDFDFD circle (r=18)
         *   - Joolz-blue stroke at 10% opacity around it (r=19.64,
         *     stroke-width=3.27) — the subtle halo line
         *   - Joolz-blue donut (r=8.18) with a near-white center pip
         *     (r=4.91) — the same #130F31 / #FDFDFD palette
         */
        <svg
          className={styles.hotspotImage}
          viewBox="0 0 43 43"
          fill="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <foreignObject
            x="-39.2727"
            y="-39.2727"
            width="121.091"
            height="121.09"
          >
            <div
              style={{
                backdropFilter: "blur(19.64px)",
                WebkitBackdropFilter: "blur(19.64px)",
                clipPath: "url(#joolzHotspotBgBlur)",
                height: "100%",
                width: "100%",
              }}
            />
          </foreignObject>
          <g data-figma-bg-blur-radius="39.2727">
            <circle cx="21.2727" cy="21.2725" r="18" fill="#FDFDFD" />
            <circle
              cx="21.2727"
              cy="21.2725"
              r="19.6364"
              stroke="#130F31"
              strokeOpacity="0.1"
              strokeWidth="3.27273"
            />
          </g>
          <circle cx="21.2709" cy="21.2726" r="8.18182" fill="#130F31" />
          <circle cx="21.2716" cy="21.2733" r="4.90909" fill="#FDFDFD" />
          <defs>
            <clipPath
              id="joolzHotspotBgBlur"
              transform="translate(39.2727 39.2727)"
            >
              <circle cx="21.2727" cy="21.2725" r="18" />
            </clipPath>
          </defs>
        </svg>
      ) : (
        /*
         * Default: layered translucent gray + ring + center dot. The
         * Figma source uses <foreignObject> for the backdrop-blur, which
         * doesn't render via <img src>, so we inline the SVG.
         */
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
      )}
    </motion.button>
  );
}
