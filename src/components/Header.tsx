import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/cn'
import { DESKTOP_NAV_QUERY } from '../lib/breakpoints'
import { locales } from '../lib/locale'
import { storeLocale } from '../lib/locale-storage'
import { routes } from '../lib/routes'
import { useLocale } from '../lib/locale-context'
import { useContent } from '../lib/use-content'

function useHash(): string {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return hash
}

const linkClass = cn(
  'flex min-h-11 items-center whitespace-nowrap rounded-2xl px-4 lg:px-3 text-sm font-medium text-fg-muted',
  'hover:bg-accent-50 hover:text-accent-800',
  'active:bg-accent-100 active:text-accent-900',
  'aria-disabled:pointer-events-none aria-disabled:opacity-50',
  'motion-safe:transition-colors',
)

const languageLinkClass = cn(
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl px-3 text-sm font-semibold',
  'text-fg-muted hover:bg-accent-50 hover:text-accent-800',
  'active:bg-accent-100 active:text-accent-900',
  'aria-[current=page]:bg-accent-100 aria-[current=page]:text-accent-900',
  'motion-safe:transition-colors',
)

export function Header() {
  const { navigation, profile, ui } = useContent()
  const [open, setOpen] = useState(false)
  const currentLocale = useLocale()
  const hash = useHash()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)

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

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_NAV_QUERY)
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return (
    <header
      ref={headerRef}
      onBlur={(event) => {
        const next = event.relatedTarget
        if (next instanceof Node && event.currentTarget.contains(next)) return
        setOpen(false)
      }}
      className="sticky top-0 z-40 border-b border-line bg-surface-raised"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="#main"
          className="inline-flex min-h-11 items-center rounded-2xl text-base font-semibold text-fg hover:text-accent-700 active:text-accent-800"
        >
          {profile.name}
        </a>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={ui.header.menu}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-11 items-center justify-center rounded-2xl border border-line-strong text-fg hover:bg-accent-50 active:bg-accent-100 disabled:opacity-50 lg:hidden"
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
          aria-label={ui.header.navLabel}
          className={cn(
            'absolute inset-x-0 top-full border-b border-line bg-surface-raised px-4 py-3 shadow-md sm:px-6',
            'lg:static lg:block lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none',
            open ? 'block' : 'hidden',
          )}
        >
          <ul className="flex flex-col gap-1 lg:flex-row lg:items-center">
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
            <li className="mt-1 border-t border-line pt-2 lg:ml-2 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-2 lg:pt-0">
              <ul aria-label={ui.header.language.groupLabel} className="flex gap-1">
                {locales.map((locale) => {
                  const option = ui.header.language.options[locale]
                  const active = locale === currentLocale
                  return (
                    <li key={locale}>
                      <a
                        href={`${routes[locale].home}${hash}`}
                        hrefLang={locale}
                        lang={locale}
                        aria-label={option.name}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => {
                          storeLocale(locale)
                          setOpen(false)
                        }}
                        className={languageLinkClass}
                      >
                        {option.short}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
