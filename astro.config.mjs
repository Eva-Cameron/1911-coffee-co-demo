// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// The café currently appears to use 1911cafe.co.uk. Confirm the production domain before launch.
export default defineConfig({
  site: "https://1911cafe.co.uk",
  integrations: [sitemap()],
  // One small page: inlining its CSS saves a render-blocking request on slow phones.
  build: { inlineStylesheets: "always" },
});
