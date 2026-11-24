import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { localeFromPathname } from './lib/locale'
import { LocaleContext } from './lib/locale-context'

const locale = localeFromPathname(window.location.pathname)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleContext value={locale}>
      <App />
    </LocaleContext>
  </StrictMode>,
)
