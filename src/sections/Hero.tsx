import profilePhoto from '../../content/assets/profile.jpg'
import { cn } from '../lib/cn'
import { useContent } from '../lib/use-content'

const buttonBase = cn(
  'inline-flex min-h-11 items-center justify-center rounded-2xl px-6 py-2.5 text-base font-medium',
  'motion-safe:transition-colors',
  'aria-disabled:pointer-events-none aria-disabled:opacity-50',
)

const primaryClass = cn(
  buttonBase,
  'bg-accent-700 text-on-accent shadow-sm hover:bg-accent-800 active:bg-accent-900',
)

const secondaryClass = cn(
  buttonBase,
  'border border-line-strong text-fg hover:bg-accent-50 active:bg-accent-100',
)

export function Hero() {
  const { profile, ui } = useContent()

  return (
    <section aria-labelledby="hero-title" className="py-10 md:py-16">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
        <img
          src={profilePhoto}
          alt={profile.photoAlt}
          width={480}
          height={480}
          fetchPriority="high"
          className="size-40 shrink-0 rounded-2xl object-cover shadow-lg sm:size-48 md:size-64"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-accent-700">{profile.location}</p>
          <h1
            id="hero-title"
            className="mt-2 text-display font-bold text-fg [overflow-wrap:anywhere]"
          >
            {profile.name}
          </h1>
          <p className="mt-2 text-xl font-medium text-fg-muted">{profile.role}</p>
          <p className="mt-4 max-w-prose text-lg text-fg">{profile.tagline}</p>
          <ul aria-label={ui.hero.stackLabel} className="mt-6 flex flex-wrap gap-2">
            {profile.stack.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-line bg-surface-raised px-3 py-1 text-sm text-fg-muted"
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className={primaryClass}>
              {ui.hero.getInTouch}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryClass}
            >
              {ui.hero.linkedin}
              <span className="sr-only"> {ui.opensInNewTab}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
