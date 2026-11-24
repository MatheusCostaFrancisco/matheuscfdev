import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
// Multi-page build (ADR 0002): the root page only redirects by browser
// language; each locale has its own static HTML with lang and metadata.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        root: "index.html",
        en: "en/index.html",
        pt: "pt/index.html",
      },
    },
  },
})
