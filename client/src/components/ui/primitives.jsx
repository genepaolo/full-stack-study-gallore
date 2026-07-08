// Small design-system primitives shared across the app.
import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/anim.js'

const cx = (...c) => c.filter(Boolean).join(' ')

export function Card({ className, ...props }) {
  return (
    <div
      className={cx('rounded-xl border border-border bg-surface shadow-sm', className)}
      {...props}
    />
  )
}

export function Button({ variant = 'primary', className, ...props }) {
  const styles = {
    primary: 'bg-brand text-brand-fg hover:opacity-90',
    ghost: 'bg-transparent hover:bg-surface-2 text-content',
    outline: 'border border-border bg-surface hover:bg-surface-2 text-content',
  }
  return (
    <button
      className={cx(
        'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium',
        'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50',
        'disabled:opacity-50 disabled:pointer-events-none',
        styles[variant],
        className,
      )}
      {...props}
    />
  )
}

const DIFFICULTY = {
  easy: 'bg-emerald-500/15 text-emerald-500',
  medium: 'bg-amber-500/15 text-amber-500',
  hard: 'bg-rose-500/15 text-rose-500',
}

export function DifficultyBadge({ level }) {
  return (
    <span className={cx('rounded-md px-2 py-0.5 text-xs font-medium capitalize', DIFFICULTY[level] || DIFFICULTY.easy)}>
      {level}
    </span>
  )
}

export function Badge({ className, ...props }) {
  return (
    <span
      className={cx('rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted', className)}
      {...props}
    />
  )
}

const KIND = {
  component: { label: 'Component', icon: '🧩' },
  utility: { label: 'Utility', icon: '⚙️' },
  quiz: { label: 'Quiz', icon: '❓' },
  concept: { label: 'Concept', icon: '📖' },
  project: { label: 'Project', icon: '🏗️' },
}

export function KindBadge({ kind }) {
  const k = KIND[kind] || KIND.concept
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
      <span>{k.icon}</span> {k.label}
    </span>
  )
}

export function ProgressBar({ value, className }) {
  const fill = useRef(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from(fill.current, {
        width: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: fill.current, start: 'top 95%', once: true },
      })
    },
    { scope: fill, dependencies: [value] },
  )
  return (
    <div className={cx('h-2 overflow-hidden rounded-full bg-surface-2', className)}>
      <div ref={fill} className="h-full rounded-full bg-brand" style={{ width: `${value}%` }} />
    </div>
  )
}
