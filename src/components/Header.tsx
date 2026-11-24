import { useEffect, useRef, useState } from 'react'
import { navigation, profile } from '../content'
import { cn } from '../lib/cn'

const linkClass = cn(
  'block rounded-2xl px-4 py-2 text-sm font-medium text-fg-muted',
  'hover:bg-accent-50 hover:text-accent-800',
  'active:bg-accent-100 active:text-accent-900',
  'aria-disabled:pointer-events-none aria-disabled:opacity-50',
  'motion-safe:transition-colors',
)

export function Header() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface-raised">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="#main"
          className="rounded-2xl text-base font-semibold text-fg hover:text-accent-700 active:text-accent-800"
        >
          {profile.name}
        </a>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-11 items-center justify-center rounded-2xl border border-line-strong text-fg hover:bg-accent-50 active:bg-accent-100 disabled:opacity-50 md:hidden"
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
          >
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <nav
          id="site-nav"
          aria-label="Primary"
          className={cn(
            'absolute inset-x-0 top-full border-b border-line bg-surface-raised px-4 py-3 shadow-md sm:px-6',
            'md:static md:block md:border-0 md:bg-transparent md:p-0 md:shadow-none',
            open ? 'block' : 'hidden',
          )}
        >
          <ul className="flex flex-col gap-1 md:flex-row md:items-center">
            {navigation.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={linkClass}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
