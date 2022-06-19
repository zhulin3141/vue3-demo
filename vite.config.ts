/**
 * @type {import('vite').UserConfig}
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default ({ mode }) => {
  const __DEV__ = mode === 'development'

  return defineConfig({
    base: __DEV__ ? '/' : '/vue3-demo/',
    plugins: [vue(), visualizer()],
    // 设置路径别名
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          charset: false,
        },
      },
    },
    build: {
      sourcemap: false,
      outDir: 'dist', //指定输出路径
      assetsDir: 'assets', // 指定生成静态资源的存放路径
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue'],
            echarts: ['echarts'],
            mockjs: ['mockjs'],
          }
        }
      },
    },
  })
}
