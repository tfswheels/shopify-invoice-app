import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Plugin to inject env variables into HTML
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          '%VITE_SHOPIFY_API_KEY%',
          process.env.VITE_SHOPIFY_API_KEY || ''
        )
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})