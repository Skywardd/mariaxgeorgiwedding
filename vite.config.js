import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative base so the built site works from any sub-path
  // (Netlify, Vercel, GitHub Pages, or a plain folder on a shared host).
  base: './',
})
