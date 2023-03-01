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
    outDir:"dist",
    target: "es2015",
    cssCodeSplit: true,
    lib: {
      name: "MingFuUi",
      entry: resolve(__dirname, "src/components/index.ts"),
      fileName: (format) => `mingfu-ui.${format}.js`,  // 如果不用format文件后缀可能会乱
    },
    rollupOptions: {
      external: ["vue", "axios", 'vue-router', "element-plus"],  // 确保外部化处理那些你不想打包进库的依赖
      output: {  // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
          axios: 'axios',
          'vue-router': 'vueRouter',
          "element-plus": "ElementPlus",
        },
      },
    },
  },
});
