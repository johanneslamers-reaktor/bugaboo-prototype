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
  initial: { scale: 1.08 },
  whileInView: { scale: 1 },
  /*
   * Fire when ~25% of the element is visible. No fade — opacity 0 made
   * unloaded carousel-peek cards animate into blank space.
   */
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};
