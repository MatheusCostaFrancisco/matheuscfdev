import { useState, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { themePreferences, type ThemePreference } from '../lib/theme'
import { applyThemePreference } from '../lib/theme-apply'
import { readThemePreference } from '../lib/theme-storage'
import { useContent } from '../lib/use-content'

const icons: Record<ThemePreference, ReactNode> = {
  system: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  dark: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
}

const optionClass = cn(
  'inline-flex size-11 items-center motion-safe:transition-colors justify-center rounded-2xl text-fg-muted',
  'hover:bg-accent-50 hover:text-accent-800',
  'active:bg-accent-100 active:text-accent-900',
  'aria-pressed:bg-accent-100 aria-pressed:text-accent-900',
  'aria-pressed:ring-1 aria-pressed:ring-inset aria-pressed:ring-accent-600',
  'disabled:pointer-events-none disabled:opacity-50',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600',
)

export function ThemeSwitcher() {
  const { ui } = useContent()
  const [current, setCurrent] = useState<ThemePreference>(readThemePreference)
  const { options, currentLabel, groupLabel } = ui.header.theme

  return (
    <div role="group" aria-label={currentLabel(options[current])} title={groupLabel} className="flex gap-1">
      {themePreferences.map((preference) => (
        <button
          key={preference}
          type="button"
          aria-label={options[preference]}
          title={options[preference]}
          aria-pressed={preference === current}
          onClick={() => {
            setCurrent(preference)
            applyThemePreference(preference)
          }}
          className={optionClass}
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icons[preference]}
          </svg>
        </button>
      ))}
    </div>
  )
}
