import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // 🌟 這裡改成從 @vitejs 載入！

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5173
  }
})