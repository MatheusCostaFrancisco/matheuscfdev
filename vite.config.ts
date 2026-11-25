import { defineConfig, loadEnv, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import {
  developmentYearsEn,
  developmentYearsPt,
  experienceYears,
} from "./src/content/career"
import { defaultLocale, locales, type Locale } from "./src/lib/locale"
import { pages, resolveRoute, routes, type Page } from "./src/lib/routes"

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

// HTML entry of every page in the route map (ADR 0005): the route "/a/b/" is built
// from "a/b/index.html".
function pageEntryFile(locale: Locale, page: Page): string {
  return `${routes[locale][page].slice(1)}index.html`
}

const pageInputs: Record<string, string> = Object.fromEntries(
  locales.flatMap((locale) =>
    pages.map((page) => [`${locale}-${page}`, pageEntryFile(locale, page)]),
  ),
)

const ROUTE_URL_RE = /%ROUTE_URL(?::([a-zA-Z-]+))?%/g
const ROUTE_PATH_RE = /%ROUTE_PATH:([a-zA-Z-]+):([a-z]+)%/g

function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value)
}

function isPage(value: string): value is Page {
  return pages.some((page) => page === value)
}

// Fills the route placeholders of an HTML entry from the route map:
// - %ROUTE_URL% is the absolute URL of the page the file builds (canonical, og:url);
// - %ROUTE_URL:<locale>% is the same page in that locale (hreflang);
// - %ROUTE_URL:x-default% is the root language redirect for the home and the
//   default-locale page for the other pages (there is no root /roadmap/);
// - %ROUTE_PATH:<locale>:<page>% is a root-relative path, for pages outside the
//   map such as the root redirect.
// A %ROUTE_URL% in a file that is not a page of the map fails the build.
function fillRoutes(html: string, htmlPath: string, siteUrl: string): string {
  const withPaths = html.replace(ROUTE_PATH_RE, (match, locale: string, page: string) => {
    if (!isLocale(locale) || !isPage(page)) {
      throw new Error(`[routes] Unknown route placeholder ${match} in ${htmlPath}.`)
    }
    return routes[locale][page]
  })
  if (!withPaths.includes("%ROUTE_URL")) return withPaths

  const { locale: current, page } = resolveRoute(htmlPath)
  if (`/${pageEntryFile(current, page)}` !== htmlPath) {
    throw new Error(
      `[routes] ${htmlPath} uses ROUTE_URL placeholders but is not a page of the route map (src/lib/routes.ts).`,
    )
  }
  return withPaths.replace(ROUTE_URL_RE, (match, target: string | undefined) => {
    if (target === undefined) return pageUrl(siteUrl, current, page)
    if (target === "x-default" || isLocale(target)) return pageUrl(siteUrl, target, page)
    throw new Error(`[routes] Unknown route placeholder ${match} in ${htmlPath}.`)
  })
}

type AlternateTarget = Locale | "x-default"

const alternateTargets: readonly AlternateTarget[] = [...locales, "x-default"]

// Absolute URL of a page in a locale. x-default is the root language redirect
// for the home and the default-locale page for the other pages (there is no
// root /roadmap/). Shared by the HTML hreflang links and the sitemap.
function pageUrl(siteUrl: string, target: AlternateTarget, page: Page): string {
  if (target !== "x-default") return `${siteUrl}${routes[target][page]}`
  return page === "home" ? `${siteUrl}/` : `${siteUrl}${routes[defaultLocale][page]}`
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

// sitemap.xml: one <url> per page of the route map in each locale, each with
// the hreflang alternates (en, pt-BR, x-default) used in the HTML <head>.
// No <lastmod>: the build has no reliable per-page modification date.
function buildSitemap(siteUrl: string): string {
  const entries = locales.flatMap((locale) =>
    pages.map((page) => {
      const alternates = alternateTargets
        .map(
          (target) =>
            `    <xhtml:link rel="alternate" hreflang="${target}" href="${escapeXml(pageUrl(siteUrl, target, page))}" />`,
        )
        .join("\n")
      return `  <url>
    <loc>${escapeXml(pageUrl(siteUrl, locale, page))}</loc>
${alternates}
  </url>`
    }),
  )
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n")
}

function buildRobots(siteUrl: string): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${siteUrl}/sitemap.xml`, ""].join("\n")
}

// Replaces %SITE_URL%, the route placeholders and the %YEARS_DEV_*% experience phrases (derived from
// the career start dates) in the HTML entries before Vite processes them, and
// after Vite has emitted the hashed og:image asset, prefixes its root-relative
// path with the site URL (link previews require an absolute og:image). On build
// it also emits robots.txt and sitemap.xml from the route map and SITE_URL.
function siteUrlPlugin(siteUrl: string): Plugin {
  const ogImageRE = /(<meta\s+property="og:image"\s+content=")(\/[^"]*)"/g
  return {
    name: "site-url",
    enforce: "post",
    transformIndexHtml: {
      order: "pre",
      handler: (html, ctx) => {
        const years = experienceYears(new Date())
        return fillRoutes(html, ctx.path, siteUrl)
          .replaceAll(SITE_URL_PLACEHOLDER, siteUrl)
          .replaceAll("%YEARS_DEV_EN%", developmentYearsEn(years))
          .replaceAll("%YEARS_DEV_PT%", developmentYearsPt(years))
      },
    },
    generateBundle(_options, bundle) {
      if (siteUrl === "") return
      this.emitFile({ type: "asset", fileName: "robots.txt", source: buildRobots(siteUrl) })
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: buildSitemap(siteUrl) })
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
// Multi-page build (ADR 0002, ADR 0005): the root page only redirects by
// browser language; every page of the route map, in each locale, has its own
// static HTML with lang and metadata.
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
          notFound: "404.html",
          ...pageInputs,
        },
      },
    },
  }
})
