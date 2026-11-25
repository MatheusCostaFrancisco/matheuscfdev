import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LocaleContext } from './lib/locale-context'
import { resolveRoute } from './lib/routes'

const { locale, page } = resolveRoute(window.location.pathname)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleContext value={locale}>
      <App page={page} />
    </LocaleContext>
  </StrictMode>,
)
