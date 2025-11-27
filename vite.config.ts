import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import libCss from 'vite-plugin-libcss';

export default defineConfig({
  plugins: [vue(), libCss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
  },
  build: {
    emptyOutDir: true,
    outDir: "dist",
    target: "es2015",
    lib: {
      name: "TrapUI",
      entry: resolve(__dirname, "src/packages/index.ts"),
      fileName: (format) => `trap-ui.${format}.js`,
    },
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      external: ["vue", "axios", "echarts", '@popperjs/core', 'vue-router', "element-plus"],
      output: {
        exports: 'named',
        globals: {
          vue: "Vue",
          axios: 'axios',
          echarts: 'echarts',
          'vue-router': 'vueRouter',
          "element-plus": "ElementPlus",
          '@popperjs/core': '@popperjs/core',
        },
      },
    },
  },
});
