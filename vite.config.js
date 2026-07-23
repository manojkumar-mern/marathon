import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'vendor-gsap'
          if (id.includes('node_modules/react-icons')) return 'vendor-icons'
          if (id.includes('node_modules/qrcode.react')) return 'vendor-qrcode'
          if (id.includes('node_modules/react-helmet-async')) return 'vendor-seo'
          if (id.includes('node_modules/react-router-dom')) return 'vendor-router'
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor-react'
        },
      },
    },
  },
})
