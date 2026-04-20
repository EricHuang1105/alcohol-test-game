<template>
  <div id="app" class="container">
    
    <div v-if="step === 'start-page'" class="card cover-card">
      <div class="cover-visual">
        <img :src="coverImage" alt="遊戲封面" class="kv-image">
      </div>
      <div class="cover-content">
        <h1>尋找你的<br>台灣特有種微醺精靈</h1>
        <p>探尋內心深處的靈魂，調製專屬於你的特調</p>
        <button @click="openAgeModal" class="btn">開始測驗</button>
      </div>
    </div>

    <div v-if="isAgeModalOpen" class="modal-overlay">
      <div class="modal-card">
        <h2>🔞 內容確認</h2>
        <p>本測驗涉及飲酒文化內容<br>請確認您是否已滿 18 歲？</p>
        <div class="modal-btns">
          <button @click="confirmAge" class="btn">是，我已滿 18 歲</button>
          <button @click="alertUnderage" class="btn btn-outline">否</button>
        </div>
        <p class="legal-warning-small">未滿 18 歲請勿飲酒</p>
      </div>
    </div>

    <div v-else-if="step === 'quiz'" class="card quiz-page-card">
      <div class="progress-bar">
        <div class="progress" :style="{ width: ((currentQuestion + 1) / questions.length) * 100 + '%' }"></div>
      </div>
      <p class="q-count">Question {{ currentQuestion + 1 }} / 8</p>
      <h3 class="q-text">{{ questions[currentQuestion].text }}</h3>
      <div class="options">
        <button 
          v-for="(opt, i) in questions[currentQuestion].options" 
          :key="i" 
          @click="nextQuestion(opt.score)"
          class="btn-option"
        >
          {{ opt.text }}
        </button>
      </div>
    </div>

    <div v-else-if="step === 'loading'" class="card loading-card">
      <div class="shaking-animation">🍸</div>
      <p>茶梅小精靈正在調製專屬配方...</p>
    </div>

    <div v-else-if="step === 'result'" class="card result-card">
      <p class="result-pre">你的微醺人格是</p>
      <h2 class="result-title">{{ resultData.title }}</h2>
      
      <div class="result-visual">
        <img :src="resultData.image" :alt="resultData.animal" class="spirit-image">
      </div>

      <div class="spirit-animal">✨ {{ resultData.animal }} ✨</div>
      <p class="description">{{ resultData.desc }}</p>
      <div class="guide">
        <strong>🍸 微醺指南：</strong><br>{{ resultData.guide }}
      </div>
      <button @click="reset" class="btn-reset">重新測驗</button>
      <button @click="goToStore" class="btn">為你的精靈訂製專屬禮物</button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 1. 匯入所有圖片資源
import coverImageFile from './assets/cover.png'
import img1 from './assets/result_1.webp'
import img2 from './assets/result_2.webp'
import img3 from './assets/result_3.webp'
import img4 from './assets/result_4.webp'
import img5 from './assets/result_5.webp'

// 2. 狀態管理
const coverImage = ref(coverImageFile)
const step = ref('start-page') 
const isAgeModalOpen = ref(false)
const currentQuestion = ref(0)
const totalScore = ref(0)

// 3. 心理測驗題目數據
const questions = [
  { text: "結束一整天高壓疲勞的工作回到家，你的第一反應是？", options: [{ text: "拖延症發作，回家只想癱坐在沙發上，完全不想動", score: 1 }, { text: "迅速洗好澡，點起香氛並放點音樂，躲進專屬自己的防護罩裡", score: 2 }, { text: "雖然很累，但還是會先把今天的進度條推到 100%，享受如釋重負的感覺", score: 3 }]},
  { text: "剛下班手機亮起老闆要求加班的訊息，你會？", options: [{ text: "假裝沒看到，只想跟世界切斷連結", score: 1 }, { text: "認命處理完畢，之後開瓶酒小小慶祝", score: 2 }, { text: "截圖發限動牢騷，想要有人陪伴感", score: 3 }]},
  { text: "難得的週末到來，你最喜歡的放鬆行程是？", options: [{ text: "獨自窩在租屋處看小說或發呆", score: 1 }, { text: "去巷弄裡的選物店或古著店挖寶", score: 2 }, { text: "找最懂自己的好友聚在一起聊天", score: 3 }]},
  { text: "被陌生人稱讚穿搭有品味時，你的反應是？", options: [{ text: "感到不自在，想回到無人打擾狀態", score: 1 }, { text: "內心超得意，覺得遇到審美共鳴", score: 2 }, { text: "表面裝淡定，其實心裡高興到飛起", score: 3 }]},
  { text: "當你覺得生活資訊量過載時，你會？", options: [{ text: "把自己捲成一顆球，擋住吵鬧", score: 1 }, { text: "喝口酒清空腦袋資訊，聽見內心低語", score: 2 }, { text: "整理房間欣賞美物，找回生活驕傲", score: 3 }]},
  { text: "對你來說，「喝杯酒享受微醺」的意義？", options: [{ text: "讓想躺平的小怪獸出來透氣", score: 1 }, { text: "是靈魂的獎賞，撫平工作焦慮", score: 2 }, { text: "是一把鑰匙，說出不敢說的真心話", score: 3 }]},
  { text: "在深夜時刻，你通常處於什麼狀態？", options: [{ text: "思緒像在山林間輕巧越過，很活躍", score: 1 }, { text: "忙完一天，只想呼呼大睡", score: 2 }, { text: "沉浸在質感空間，對品味感到滿足", score: 3 }]},
  { text: "你內心最害怕或最想逃避的事情是？", options: [{ text: "無謂的努力與高壓，不想努力了", score: 1 }, { text: "在人群中顯得平庸，被貼上盲從標籤", score: 2 }, { text: "害怕失去好友，感到孤獨缺乏歸屬感", score: 3 }]}
]

// 4. 結果判定邏輯
const resultData = computed(() => {
  const s = totalScore.value
  if (s <= 10) return { title: "合法擺爛型", animal: "穿山甲精靈", image: img1, desc: "你極度需要合法擺爛！面對高壓的世界，你只想把自己捲成一顆球。", guide: "適合不需費心準備、輕鬆易飲的酒款。" }
  if (s <= 14) return { title: "自由獨享型", animal: "白面鼯鼠精靈", image: img2, desc: "你極度渴望 Me Time 與自由獨享！喜歡躲進專屬自己的防護罩裡。", guide: "適合帶有木質調或草本香氣的特調。" }
  if (s <= 17) return { title: "踏實成就型", animal: "白鼻心精靈", image: img3, desc: "你能在高壓中尋求踏實成就感！你認命且負責，最享受任務完成後的成就感。", guide: "適合層次豐富、尾韻甘甜的酒款。" }
  if (s <= 21) return { title: "質感審美型", animal: "石虎精靈", image: img4, desc: "你具備極高的質感自信與審美優越感！美物讓你找回對生活的驕傲。", guide: "適合包裝精緻、風味獨特且具備設計感的酒款。" }
  return { title: "群居悶騷型", animal: "台灣藍鵲精靈", image: img5, desc: "你極度需要群居歸屬感，而且超級悶騷！表面裝淡定，內心很需要陪伴。", guide: "適合與三五好友分享、能快速打開話匣子的派對酒款。" }
})

// 5. 互動方法
const openAgeModal = () => { isAgeModalOpen.value = true }
const confirmAge = () => { isAgeModalOpen.value = false; step.value = 'quiz' }
const alertUnderage = () => { alert("未滿 18 歲請勿飲酒。") }
const nextQuestion = (score) => {
  totalScore.value += score
  if (currentQuestion.value < questions.length - 1) {
    currentQuestion.value++
  } else {
    step.value = 'loading'
    setTimeout(() => { step.value = 'result' }, 2000)
  }
}
const reset = () => { step.value = 'start-page'; currentQuestion.value = 0; totalScore.value = 0; }
const goToStore = () => { window.location.href = "https://your-official-site.com" }
</script>

<style scoped>
.container { max-width: 400px; margin: 0 auto; min-height: 100vh; background: #fdf5e6; padding: 20px; box-sizing: border-box; position: relative; font-family: 'PingFang TC', 'Heiti TC', sans-serif; }
.card { 
  background: white; 
  border-radius: 20px; 
  padding: 30px; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
  /* ⬇️ 修改這裡 */
  margin-top: 20px; 
  text-align: center; 
}

/* 原本的 .card 樣式不要動 */
.card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  margin-top: 20px;
  text-align: center;
}

/* ⬇️ 新增這段專屬樣式 */
.quiz-page-card {
  /* 將原本的 20px 增加到 80px */
  margin-top: 80px; 
}

/* 封面樣式 */
.cover-visual { width: 100%; height: 300px; border-radius: 15px; overflow: hidden; margin-bottom: 10px; }
.kv-image { width: 100%; height: 100%; object-fit: cover; }
.cover-content h1 { font-size: 24px; color: #8b4513; margin: 20px 0; line-height: 1.4; }

/* 彈窗樣式 */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 100; }
.modal-card { background: white; width: 80%; padding: 30px; border-radius: 20px; text-align: center; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }

/* 按鈕樣式 */
.btn { background: #8b4513; color: white; border: none; padding: 15px; border-radius: 30px; width: 100%; font-size: 16px; cursor: pointer; margin-top: 15px; transition: 0.2s; }
.btn:active { transform: scale(0.98); }
.btn-outline { background: transparent; color: #8b4513; border: 1px solid #8b4513; }
.btn-option { display: block; width: 100%; padding: 15px; margin: 10px 0; border: 1px solid #ddd; border-radius: 12px; background: white; text-align: left; cursor: pointer; font-size: 15px; transition: 0.3s; }
.btn-option:hover { background: #fff8f0; border-color: #8b4513; }

/* 進度條與動畫 */
.progress-bar { background: #eee; height: 8px; border-radius: 4px; margin-bottom: 20px; }
.progress { background: #8b4513; height: 100%; border-radius: 4px; transition: 0.3s; }
.shaking-animation { font-size: 60px; animation: shake 0.6s infinite; margin-bottom: 20px; }
@keyframes shake { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } }

/* 結果頁樣式 */
.result-visual { width: 100%; max-width: 220px; margin: 0 auto 15px; }
.spirit-image { width: 100%; height: auto; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.1)); }
.result-title { color: #8b4513; margin: 10px 0; font-size: 26px; }
.spirit-animal { font-size: 20px; color: #d2691e; margin-bottom: 15px; font-weight: bold; }
.description { font-size: 15px; line-height: 1.6; color: #555; text-align: left; }
.guide { background: #fff8f0; padding: 15px; border-radius: 10px; font-size: 14px; text-align: left; margin: 15px 0; border-left: 5px solid #8b4513; }
.btn-reset { background: none; border: none; color: #999; text-decoration: underline; cursor: pointer; margin-top: 20px; }
.legal-warning-small { font-size: 12px; color: #999; margin-top: 15px; }
</style>