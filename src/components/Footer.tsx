import { useContent } from '../lib/use-content'

export function Footer() {
  const { profile, ui } = useContent()

  return (
    <footer className="border-t border-line bg-surface-sunken">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-fg-muted sm:px-6">
        <p>
          {ui.footerRights} {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  )
}
