import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: 'production' === mode ? './' : '/',
    plugins: [vue()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "@c": resolve(__dirname, "./src/components"),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      }
    }
  }
})