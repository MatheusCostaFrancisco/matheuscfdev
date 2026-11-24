import { profile } from '../content'

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-sunken">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-fg-muted sm:px-6">
        <p>
          {profile.name} · {profile.location}
        </p>
      </div>
    </footer>
  )
}
