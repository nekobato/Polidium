import { defineConfig } from "vite";
import electron from "vite-plugin-electron/simple";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: "main/index.ts",
      },
      preload: {
        input: "main/preload.ts",
      },
      renderer: {},
    }),
  ],
  resolve: {
    alias: [{ find: "@/", replacement: `${__dirname}/src/` }],
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
