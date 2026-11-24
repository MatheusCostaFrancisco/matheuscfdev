import { navigation, profile } from '../content'
import { cn } from '../lib/cn'

const contactItem = navigation.find((item) => item.id === 'contact')

const linkClass = cn(
  'rounded-sm text-lg font-medium text-accent-700 underline underline-offset-4',
  'break-all motion-safe:transition-colors hover:text-accent-800 active:text-accent-900',
)

export function Contact() {
  if (!contactItem) return null

  return (
    <section
      id={contactItem.id}
      aria-labelledby="contact-title"
      className="scroll-mt-20 py-10"
    >
      <h2 id="contact-title" className="text-2xl font-semibold text-fg">
        {contactItem.label}
      </h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-[max-content_1fr] sm:gap-x-8">
        <dt className="text-sm font-medium text-fg-muted">E-mail</dt>
        <dd>
          <a href={`mailto:${profile.email}`} className={linkClass}>
            {profile.email}
          </a>
        </dd>
        <dt className="text-sm font-medium text-fg-muted">LinkedIn</dt>
        <dd>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {profile.linkedin.replace('https://www.', '')}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </dd>
        <dt className="text-sm font-medium text-fg-muted">Location</dt>
        <dd className="text-lg text-fg">{profile.location}</dd>
      </dl>
    </section>
  )
}
