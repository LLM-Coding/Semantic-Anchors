import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@asciidoctor/core')) {
            return 'asciidoctor-core'
          }
          if (id.includes('node_modules/asciidoctor-opal-runtime')) {
            return 'asciidoctor-opal'
          }
          return undefined
        },
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.js', 'src/**/__tests__/**/*.js'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
  },
})
