import { cn } from '../lib/cn'
import { useContent } from '../lib/use-content'

const linkClass = cn(
  'inline-flex min-h-11 max-w-full items-center rounded-sm text-lg font-medium text-accent-700 underline underline-offset-4',
  '[overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 motion-safe:transition-colors hover:text-accent-800 active:text-accent-900',
)

export function Contact() {
  const { navigation, profile, ui } = useContent()
  const contactItem = navigation.find((item) => item.id === 'contact')

  if (!contactItem) return null

  return (
    <section
      id={contactItem.id}
      aria-labelledby="contact-title"
      className="section-offset py-10"
    >
      <h2 id="contact-title" className="text-2xl font-semibold text-fg">
        {contactItem.label}
      </h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-[max-content_1fr] sm:gap-x-8">
        <dt className="text-sm font-medium text-fg-muted">{ui.contact.email}</dt>
        <dd>
          <a href={`mailto:${profile.email}`} className={linkClass}>
            {profile.email}
          </a>
        </dd>
        <dt className="text-sm font-medium text-fg-muted">{ui.contact.linkedin}</dt>
        <dd>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {profile.linkedin.replace('https://www.', '')}
            <span className="sr-only"> {ui.opensInNewTab}</span>
          </a>
        </dd>
        <dt className="text-sm font-medium text-fg-muted">{ui.contact.github}</dt>
        <dd>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {profile.github.replace('https://', '')}
            <span className="sr-only"> {ui.opensInNewTab}</span>
          </a>
        </dd>
        <dt className="text-sm font-medium text-fg-muted">{ui.contact.location}</dt>
        <dd className="text-lg text-fg">{profile.location}</dd>
      </dl>
    </section>
  )
}
