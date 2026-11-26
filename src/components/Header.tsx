import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/cn'
import { DESKTOP_NAV_QUERY } from '../lib/breakpoints'
import { locales } from '../lib/locale'
import { storeLocale } from '../lib/locale-storage'
import { routes, type Page } from '../lib/routes'
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
  'flex min-h-11 items-center whitespace-nowrap rounded-2xl px-4 xl:px-3 text-sm font-medium text-fg-muted',
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

type HeaderProps = {
  page: Page
}

function isPageId(id: string): id is Exclude<Page, 'home'> {
  return id === 'journey' || id === 'books'
}

export function Header({ page }: HeaderProps) {
  const { navigation, profile, ui } = useContent()
  const [open, setOpen] = useState(false)
  const currentLocale = useLocale()
  const hash = useHash()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (navRef.current?.contains(target) || buttonRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
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
      <div className="mx-auto flex h-header max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#main"
          className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-2xl text-base font-semibold text-fg hover:text-accent-700 active:text-accent-800"
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
          className="inline-flex size-11 items-center justify-center rounded-2xl border border-line-strong text-fg hover:bg-accent-50 active:bg-accent-100 disabled:opacity-50 xl:hidden"
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
          ref={navRef}
          id="site-nav"
          aria-label={ui.header.navLabel}
          className={cn(
            'absolute inset-x-0 top-full border-b border-line bg-surface-raised px-4 py-3 shadow-md sm:px-6',
            'xl:static xl:block xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none',
            open ? 'block' : 'hidden',
          )}
        >
          <ul className="flex flex-col gap-1 xl:flex-row xl:items-center">
            {navigation.map((item) => {
              const isPage = isPageId(item.id)
              const href = isPage
                ? routes[currentLocale][item.id]
                : page === 'home'
                  ? `#${item.id}`
                  : `${routes[currentLocale].home}#${item.id}`
              return (
                <li key={item.id}>
                  <a
                    href={href}
                    aria-current={isPage && item.id === page ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      linkClass,
                      'aria-[current=page]:bg-accent-100 aria-[current=page]:text-accent-900',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
            <li className="mt-1 border-t border-line pt-2 xl:ml-2 xl:mt-0 xl:border-l xl:border-t-0 xl:pl-2 xl:pt-0">
              <ul aria-label={ui.header.language.groupLabel} className="flex gap-1">
                {locales.map((locale) => {
                  const option = ui.header.language.options[locale]
                  const active = locale === currentLocale
                  return (
                    <li key={locale}>
                      <a
                        href={`${routes[locale][page]}${page === 'home' ? hash : ''}`}
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
