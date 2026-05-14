/**
 * Shared motion-react presets so motion behavior is consistent across
 * components. Import + spread into the relevant motion.* element.
 *
 *   <motion.img {...ENTRANCE_ZOOM} src={...} alt={...} />
 */

/**
 * Big hero / feature images on the PDP fade + slowly zoom-out from 1.08 → 1
 * as they enter the viewport. Parent must have `overflow: hidden` so the
 * brief 8% overflow gets clipped instead of exposing edges.
 *
 * Use `once: true` so the animation only runs the first time — re-entering
 * the viewport on scroll-up shouldn't restart it.
 */
export const ENTRANCE_ZOOM = {
  initial: { opacity: 0, scale: 1.08 },
  whileInView: { opacity: 1, scale: 1 },
  /*
   * Fire when ~25% of the element is visible. No pre-trigger margin —
   * previous 200px margin meant elements high on the page were
   * "in view" before paint and the animation completed unseen.
   */
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};
