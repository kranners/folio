import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import vue from "@astrojs/vue";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  integrations: [
    preact({
      include: "**/preact/*",
    }),
    react({
      include: "**/react/*",
    }),
    svelte({
      include: "**.svelte",
    }),
    vue({
      include: "**.vue",
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
