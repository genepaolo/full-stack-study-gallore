import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion, EASE, DUR } from '../../lib/anim.js'

/**
 * Fade + rise entrance. Content is always rendered (visible even if JS/GSAP fails or reduced
 * motion is on) — we only animate FROM a hidden state TO the natural one.
 *
 * @param stagger  if true, animate the container's direct children in sequence (for grids/lists)
 * @param scroll   if true, trigger when scrolled into view; otherwise animate on mount
 * @param y        starting vertical offset (px)
 * @param delay    initial delay (s)
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  stagger = false,
  scroll = false,
  y = 16,
  delay = 0,
  className,
  ...rest
}) {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const el = ref.current
      const targets = stagger ? el.children : el
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: DUR,
        ease: EASE,
        delay,
        stagger: stagger ? 0.08 : 0,
        ...(scroll
          ? { scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
          : {}),
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
