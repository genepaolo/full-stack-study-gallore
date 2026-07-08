import { useTheme } from '../../context/ThemeContext.jsx'
import { Button } from '../ui/primitives.jsx'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <Button variant="ghost" onClick={toggle} aria-label="Toggle color theme" title="Toggle theme">
      <span className="text-base">{theme === 'dark' ? '🌙' : '☀️'}</span>
      <span className="hidden sm:inline capitalize">{theme}</span>
    </Button>
  )
}
