import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron/simple'
import renderer from 'vite-plugin-electron-renderer'
import { resolve } from 'path'

export default defineConfig({
  root: './app',
  plugins: [
    vue(),
    electron({
      main: {
        entry: 'app/src/main/index.ts'
      }
    }),
    renderer()
  ],
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
      }
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
