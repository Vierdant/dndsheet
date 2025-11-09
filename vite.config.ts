import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  server: {
    cors: {
      origin: "https://www.owlbear.rodeo",
    },
  },
})
