import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import iconsPlugin from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    sveltekit(),

    iconsPlugin({
      compiler: 'svelte'
    })
  ]
})
