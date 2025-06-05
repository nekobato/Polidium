import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron/simple";
import renderer from "vite-plugin-electron-renderer";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: "src/main/index.ts"
      },
      preload: {
        input: "src/preload.ts"
      }
    }),
    renderer()
  ],
  build: {
    outDir: "js",
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, "src/renderer/index.ts"),
      output: {
        entryFileNames: "index.js",
        format: "cjs"
      }
    }
  },
  resolve: {
    alias: {
      renderer: resolve(__dirname, "src/renderer"),
      root: resolve(__dirname, "src"),
      "@": resolve(__dirname, "src")
    }
  },
  optimizeDeps: {
    exclude: ["electron"]
  }
});
