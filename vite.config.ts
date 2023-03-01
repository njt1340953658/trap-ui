import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
  },
  build: {
    outDir:"dist",
    target: "es2015",
    lib: {
      name: "MingUi",
      entry: resolve(__dirname, "src/components/index.ts"),
      fileName: (format) => `ming-ui.${format}.js`,  // 如果不用format文件后缀可能会乱
    },
    rollupOptions: {
      external: ["vue", "axios", 'vue-router', 'pinia', "element-plus"],  // 确保外部化处理那些你不想打包进库的依赖
      output: {  // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "vue",
          axios: 'axios',
          pinia: 'pinia',
          'vue-router': 'vueRouter',
          "element-plus": "ElementPlus",
        },
      },
    },
  },
});
