import { defineConfig } from 'vite'
import vue from '@vue/plugin-vue'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // 🌟 這行最神聖！重新掛載 Vue 編譯引擎，徹底解決 "Install @vitejs/plugin-vue" 報錯
  plugins: [vue()],
  
  server: {
    host: true, // 🚀 開啟區網連線，讓手機看得到電腦
    port: 5173,
    
    // 🌟 直接讀取你本機現有的安全憑證，強制解鎖 Android 手機相機權限！
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost+2-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost+2.pem')),
    }
  }
})