import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Respect the OS "reduce motion" setting — when on, we skip animations entirely and leave
// content in its natural, visible state.
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

// Shared easing/timings so the whole app moves as one system.
export const EASE = 'power3.out'
export const DUR = 0.6

export { gsap, ScrollTrigger, useGSAP }
