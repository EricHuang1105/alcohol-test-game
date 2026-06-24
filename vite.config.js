import { defineConfig } from 'vite'
import vue from '@vue/plugin-vue'


export default defineConfig({
  plugins: [
    vue(),
    basicSsl() // 🌟 讓 Vite 自動為本地伺服器生成一個臨時的 HTTPS 安全證書
  ],
  server: {
    host: true // 確保允許區網內的手機連線
  }
})