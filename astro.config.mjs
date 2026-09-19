import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  integrations: [
    preact({
      include: "**/preact/**/*.{jsx,tsx}",
    }),
    react({
      include: "**/react/**/*.{jsx,tsx}",
    }),
    svelte({
      include: "**.svelte",
    }),
    vue({
      include: "**/*.vue",
    }),
  ],
});
