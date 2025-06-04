import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  root: './app',
  plugins: [vue()],
  build: {
    outDir: 'js',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        controller: resolve(__dirname, 'app/src/renderer/Controller/index.js'),
        player: resolve(__dirname, 'app/src/renderer/Player/index.js')
      },
      output: {
        entryFileNames: '[name].js',
        format: 'cjs'
      },
      external: ['electron']
    }
  },
  resolve: {
    alias: {
      renderer: resolve(__dirname, 'app/src/renderer'),
      root: resolve(__dirname, 'app/src')
    }
  },
  optimizeDeps: {
    exclude: ['electron']
  }
})
