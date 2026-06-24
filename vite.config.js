import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 🌟 核心破局：改用本地相對路徑直接去載入 Vue 編譯核心，不再依賴 npm 的伺服器下載！
const localVuePlugin = path.resolve(__dirname, 'node_modules/@vue/plugin-vue/dist/index.mjs')
let vuePlugin = null

if (fs.existsSync(localVuePlugin)) {
  const module = await import(`file://${localVuePlugin}`)
  vuePlugin = module.default || module
}

export default defineConfig({
  plugins: vuePlugin ? [vuePlugin()] : [],
  server: {
    host: true,
    port: 5173
  }
})