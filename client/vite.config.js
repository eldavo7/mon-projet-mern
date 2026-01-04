import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- 1. Import obligatoire

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- 2. Activation obligatoire
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5001'
    }
  }
})