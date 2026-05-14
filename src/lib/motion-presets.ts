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
   * `margin` triggers the IntersectionObserver before the element reaches
   * the viewport edge — gives the browser time to decode the image so the
   * animation doesn't run on blank space. `once: true` so it doesn't
   * re-trigger on scroll-up.
   */
  viewport: { once: true, amount: 0.15, margin: "200px 0px" },
  transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};
