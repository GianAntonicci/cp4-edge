import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/v2': {
        target: 'http://100.27.187.63:1026',
        changeOrigin: true,
      }
    }
  }
})