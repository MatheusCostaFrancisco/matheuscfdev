import { defineConfig, loadEnv, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const SITE_URL_PLACEHOLDER = "%SITE_URL%"

// SITE_URL (ADR 0003) must be a bare https origin: "https://host", with no
// path, query, hash, credentials or trailing slash, so "<SITE_URL>/en/" is
// always a well-formed absolute URL. Checked with a regex because the config
// is type-checked without Node types (no URL global).
const SITE_URL_RE = /^https:\/\/(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?::\d{1,5})?$/

function parseSiteUrl(value: string | undefined): string {
  const help =
    'Set SITE_URL in .env.production (or the build environment) to a bare https origin, e.g. "https://example.com".'
  if (value === undefined || value.trim() === "") {
    throw new Error(`[site-url] SITE_URL is missing. ${help}`)
  }
  if (!SITE_URL_RE.test(value)) {
    throw new Error(
      `[site-url] SITE_URL "${value}" is invalid: it must be https, lowercase, with no path, query, hash, credentials or trailing slash. ${help}`,
    )
  }
  return value
}

// Replaces %SITE_URL% in the HTML entries before Vite processes them, and
// after Vite has emitted the hashed og:image asset, prefixes its root-relative
// path with the site URL (link previews require an absolute og:image).
function siteUrlPlugin(siteUrl: string): Plugin {
  const ogImageRE = /(<meta\s+property="og:image"\s+content=")(\/[^"]*)"/g
  return {
    name: "site-url",
    enforce: "post",
    transformIndexHtml: {
      order: "pre",
      handler: (html) => html.replaceAll(SITE_URL_PLACEHOLDER, siteUrl),
    },
    generateBundle(_options, bundle) {
      if (siteUrl === "") return
      for (const file of Object.values(bundle)) {
        if (file.type !== "asset" || !file.fileName.endsWith(".html")) continue
        if (typeof file.source !== "string") continue
        file.source = file.source.replace(
          ogImageRE,
          (_match, prefix: string, path: string) => `${prefix}${siteUrl}${path}"`,
        )
      }
    },
  }
}

// https://vite.dev/config/
// Multi-page build (ADR 0002): the root page only redirects by browser
// language; each locale has its own static HTML with lang and metadata.
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, ".", "")
  // The dev server has no production origin: without SITE_URL it keeps
  // root-relative URLs. Any build requires a valid SITE_URL.
  const siteUrl =
    command === "serve" && !env.SITE_URL ? "" : parseSiteUrl(env.SITE_URL)

  return {
    plugins: [react(), tailwindcss(), siteUrlPlugin(siteUrl)],
    build: {
      rollupOptions: {
        input: {
          root: "index.html",
          en: "en/index.html",
          pt: "pt/index.html",
        },
      },
    },
  }
})
