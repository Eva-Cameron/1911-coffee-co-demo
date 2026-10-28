// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Placeholder until the client's domain is registered.
export default defineConfig({
  site: "https://1911coffee.co.uk",
  integrations: [sitemap()],
});
