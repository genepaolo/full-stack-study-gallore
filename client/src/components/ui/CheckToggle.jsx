// A styled checkbox for marking a module "learned". Used standalone and inside link cards
// (call stop/preventDefault in the handler when nested in a Link).
export default function CheckToggle({ checked, onClick, size = 'md', className, title }) {
  const dim = size === 'sm' ? 'h-5 w-5 text-[11px]' : 'h-6 w-6 text-xs'
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      title={title || (checked ? 'Mark as not learned' : 'Mark as learned')}
      onClick={onClick}
      className={`grid ${dim} shrink-0 place-items-center rounded-md border transition-colors ${
        checked
          ? 'border-emerald-500 bg-emerald-500 text-white'
          : 'border-border bg-surface text-transparent hover:border-brand'
      } ${className || ''}`}
    >
      ✓
    </button>
  )
}
