import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This tells Vite the correct path for the live site's assets.
  base: "/sentence-autocompletion-research/", 
})