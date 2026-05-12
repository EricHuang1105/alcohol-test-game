<template>
  <div id="app" class="container">
    
    <!-- 右上角音量控制按鈕 -->
    <button v-if="step !== 'start-page'" @click="toggleMute" class="btn-mute">
      {{ isMuted ? '🔇' : '🔊' }}
    </button>
    
    <!-- 加入 Transition 讓頁面切換有淡入淡出效果 -->
    <Transition name="fade" mode="out-in">
      
      <div v-if="step === 'start-page'" class="card cover-card">
        <div class="cover-visual">
          <img :src="coverImage" alt="遊戲封面" class="kv-image">
        </div>
        <div class="cover-content">
          <h1>尋找你的<br>台灣特有種微醺精靈</h1>
          <p>探尋內心深處的靈魂，調製專屬於你的特調</p>
          <button @click="handleOpenAgeModal" class="btn">開始測驗</button>
        </div>
      </div>

      <div v-else-if="step === 'quiz'" class="card quiz-page-card">
        <div class="progress-bar">
          <div class="progress" :style="{ width: ((currentQuestion + 1) / questions.length) * 100 + '%' }"></div>
        </div>
        <p class="q-count">Question {{ currentQuestion + 1 }} / {{ questions.length }}</p>
        <h3 class="q-text">{{ questions[currentQuestion].text }}</h3>
        <div class="options">
          <button 
            v-for="(opt, i) in questions[currentQuestion].options" 
            :key="i" 
            @click="handleOptionClick(opt.score)"
            class="btn-option"
          >
            {{ opt.text }}
          </button>
        </div>
      </div>

      <div v-else-if="step === 'loading'" class="card loading-card">
        <!-- 替換為 MP4 影片，使用 autoplay loop muted playsinline 確保手機能自動靜音播放 -->
        <div class="video-container">
          <video autoplay loop muted playsinline class="loading-video">
            <source src="https://cdn.pixabay.com/video/2023/10/22/186121-877478052_tiny.mp4" type="video/mp4">
            您的瀏覽器不支援影片標籤。
          </video>
        </div>
        <p>茶梅小精靈正在調製專屬配方...</p>
      </div>


<div v-else-if="step === 'result'" class="card result-card">
  <button @click="handleShare" class="btn btn-share">
    📤 分享結果，尋找你的同好
  </button>

  <button @click="handleReset" class="btn-reset">重新測驗</button>
  <button @click="handleGoToStore" class="btn">為你的精靈訂製專屬禮物</button>
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
        <button @click="handleReset" class="btn-reset">重新測驗</button>
        <button @click="handleGoToStore" class="btn">為你的精靈訂製專屬禮物</button>
      </div>

    </Transition>

    <!-- 年齡確認彈窗 (獨立於主流程之外) -->
    <Transition name="modal">
      <div v-if="isAgeModalOpen" class="modal-overlay">
        <div class="modal-card">
          <h2>🔞 內容確認</h2>
          <p>本測驗涉及飲酒文化內容<br>請確認您是否已滿 18 歲？</p>
          <div class="modal-btns">
            <button @click="handleConfirmAge" class="btn">是，我已滿 18 歲</button>
            <button @click="handleAlertUnderage" class="btn btn-outline">否</button>
          </div>
          <p class="legal-warning-small">未滿 18 歲請勿飲酒</p>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 1. 匯入所有圖片資源 (請確保路徑正確)
import coverImageFile from './assets/cover.png'
import img1 from './assets/result_1.webp'
import img2 from './assets/result_2.webp'
import img3 from './assets/result_3.webp'
import img4 from './assets/result_4.webp'
import img5 from './assets/result_5.webp'
import bgmFile from './assets/bgm.mp3'
import clickFile from './assets/click.mp3'

// 2. 狀態管理
const coverImage = ref(coverImageFile)
const step = ref('start-page') 
const isAgeModalOpen = ref(false)
const currentQuestion = ref(0)
const totalScore = ref(0)
const isMuted = ref(false)

// 3. 音效與 BGM 設定 (使用 Pixabay 免費商用音源)
// 使用匯入的路徑建立音訊物件
const bgm = new Audio(bgmFile)
bgm.loop = true
bgm.volume = 0.2 // 設定適中的背景音量

const clickSound = new Audio(clickFile)
clickSound.volume = 0.5 // 設定較響的按鍵音量

// 強制預載
onMounted(() => {
  bgm.load()
  clickSound.load()
})

const playClickSound = () => {
  if (!isMuted.value) {
    // 解決部分瀏覽器音效重疊不播的問題
    const soundClone = clickSound.cloneNode(true) // 克隆一個實體來播放
    soundClone.volume = 1.0
    soundClone.play().catch(e => console.log("音效播放失敗:", e))
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  bgm.muted = isMuted.value
  // 如果解除靜音且正在測驗中，啟動 BGM
  if (!isMuted.value && step.value !== 'start-page') {
    bgm.play().catch(() => {})
  }
}

// 4. 心理測驗題目數據
const questions = [
  { 
    text: "Q1. 結束一天疲勞的工作，回到家你的第一反應是？", 
    options: [
      { text: "只想癱坐在沙發上，完全不想動。", score: 1 }, 
      { text: "洗個澡，點起香氛並放點音樂。", score: 2 }, 
      { text: "先做完家事，把今天的進度條推到 100%。", score: 3 }
    ]
  },
  { 
    text: "Q2. 剛下班卻收到老闆要求加班的訊息，你會怎麼做？", 
    options: [
      { text: "假裝沒看到，切斷跟工作的連結。", score: 1 }, 
      { text: "認命處理完畢，結束後開一瓶酒慶祝一下。", score: 2 }, 
      { text: "截圖發到限動，想要有人站在我這邊。", score: 3 }
    ]
  },
  { 
    text: "Q3. 難得的週末到來，你最喜歡的放鬆行程是？", 
    options: [
      { text: "獨自窩在房間看小說或發呆。", score: 1 }, // 企劃書標示為 1 分
      { text: "穿上極具個人風格的服飾去逛街。", score: 2 }, // 企劃書標示為 2 分
      { text: "找三五好友聚在一起大聊特聊。", score: 3 }  // 企劃書標示為 3 分
    ]
  },
  { 
    text: "Q4. 當你在路上被陌生人稱讚你的穿搭，你的反應是？", 
    options: [
      { text: "覺得有點不自在，想趕快結束對話。", score: 1 }, // 企劃書標示為 1 分
      { text: "內心超開心，覺得遇到了懂生活的同好。", score: 2 }, // 企劃書標示為 2 分
      { text: "表面淡定的說謝謝，心裡早就高興到飛起。", score: 3 } // 企劃書標示為 3 分
    ]
  },
  { 
    text: "Q5. 當你覺得生活充滿讓你過載的細碎資訊，你會怎麼應對？", 
    options: [
      { text: "什麼都不想管，把自己捲起來縮成一顆球。", score: 1 }, 
      { text: "喝口酒，讓微醺清空腦袋的資訊垃圾。", score: 2 }, 
      { text: "整理房間，看到整潔的環境心情就好多了。", score: 3 }
    ]
  },
  { 
    text: "Q6. 對你來說，「享受微醺」最大的意義是什麼？", 
    options: [
      { text: "讓內心透透氣，把平常累積的壓力指數歸零。", score: 1 }, // 企劃書標示為 1 分
      { text: "是給靈魂的獎賞，撫平趕報告或工作後的焦慮。", score: 2 }, // 企劃書標示為 2 分
      { text: "用來「暖機」自己，說出平時不敢說的真心話。", score: 3 } // 企劃書標示為 3 分
    ]
  },
  { 
    text: "Q7. 在深夜時刻，你通常處於什麼狀態？", 
    options: [
      { text: "思緒像在山林間自由滑翔，非常活躍。", score: 1 }, 
      { text: "剛忙完一天，只想呼呼大睡。", score: 2 }, 
      { text: "在自己空間裡享受Ｍe Time。", score: 3 }
    ]
  },
  { 
    text: "Q8. 你內心最想逃離的事情是什麼？", 
    options: [
      { text: "努力卻總是白做工，想大喊「今天不想努力了」。", score: 1 }, 
      { text: "在人群中顯得平庸，沒有獨特的眼眼光。", score: 2 }, 
      { text: "害怕隨著時間流逝會漸漸失去身邊的好朋友。", score: 3 }
    ]
  }
]
// 5. 結果判定邏輯
const resultData = computed(() => {
  const s = totalScore.value
  if (s <= 10) return { title: "合法擺爛型", animal: "穿山甲精靈", image: img1, desc: "你極度需要合法擺爛！面對高壓的世界，你只想把自己捲成一顆球。", guide: "適合不需費心準備、輕鬆易飲的酒款。" }
  if (s <= 14) return { title: "自由獨享型", animal: "白面鼯鼠精靈", image: img2, desc: "你極度渴望 Me Time 與自由獨享！喜歡躲進專屬自己的防護罩裡。", guide: "適合帶有木質調或草本香氣的特調。" }
  if (s <= 17) return { title: "踏實成就型", animal: "白鼻心精靈", image: img3, desc: "你能在高壓中尋求踏實成就感！你認命且負責，最享受任務完成後的成就感。", guide: "適合層次豐富、尾韻甘甜的酒款。" }
  if (s <= 21) return { title: "質感審美型", animal: "石虎精靈", image: img4, desc: "你具備極高的質感自信與審美優越感！美物讓你找回對生活的驕傲。", guide: "適合包裝精緻、風味獨特且具備設計感的酒款。" }
  return { title: "群居悶騷型", animal: "台灣藍鵲精靈", image: img5, desc: "你極度需要群居歸屬感，而且超級悶騷！表面裝淡定，內心很需要陪伴。", guide: "適合與三五好友分享、能快速打開話匣子的派對酒款。" }
})

// 6. 互動方法 (加入音效觸發)

const handleShare = async () => {
  playClickSound();

  const shareData = {
    title: '我的微醺精靈人格',
    text: `我在【尋找台灣特有種微醺精靈】測驗中，測出了我是「${resultData.value.title}－${resultData.value.animal}」！你也快來測測看吧！`,
    url: window.location.href
  };

  try {
    // 檢查瀏覽器是否支援 Web Share API (通常是手機端)
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // 電腦端或不支援時，改用複製連結
      await navigator.clipboard.writeText(`${shareData.text} 測驗連結：${shareData.url}`);
      alert("連結已複製到剪貼簿，快發給好友吧！");
    }
  } catch (err) {
    console.log('分享失敗:', err);
  }
};


const handleOpenAgeModal = () => { 
  playClickSound(); 
  isAgeModalOpen.value = true; 
}

const handleConfirmAge = () => { 
  playClickSound();
  isAgeModalOpen.value = false; 
  step.value = 'quiz';
  // 在使用者第一次互動(確認年齡)後，才正式啟動背景音樂
  if (!isMuted.value) {
    bgm.play().catch(err => console.log('BGM播放被阻擋:', err));
  }
}

const handleAlertUnderage = () => { 
  playClickSound();
  alert("未滿 18 歲請勿飲酒。"); 
}

const handleOptionClick = (score) => {
  playClickSound();
  totalScore.value += score
  if (currentQuestion.value < questions.length - 1) {
    currentQuestion.value++
  } else {
    step.value = 'loading'
    setTimeout(() => { step.value = 'result' }, 3000) // 為了讓過場影片播久一點，我將時間延長到3秒
  }
}

const handleReset = () => { 
  playClickSound();
  step.value = 'start-page'; 
  currentQuestion.value = 0; 
  totalScore.value = 0; 
  bgm.pause(); // 回到首頁時先暫停音樂
  bgm.currentTime = 0;
}

const handleGoToStore = () => { 
  playClickSound();
  // TODO: 上線前記得替換為真實連結
  window.location.href = "https://your-official-site.com" 
}
</script>

<style scoped>
.container { 
  max-width: 400px; 
  margin: 0 auto; 
  min-height: 100vh; 
  background: #fdf5e6; 
  padding: 20px; 
  box-sizing: border-box; 
  position: relative; 
  display: flex;
  flex-direction: column;
  justify-content: center;
}

<style scoped>
/* ... (前面是你原本寫好的其他樣式) ... */

.btn { background: #8b4513; color: white; border: none; padding: 15px; border-radius: 30px; width: 100%; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 15px; }
.btn-outline { background: transparent; color: #8b4513; border: 1px solid #8b4513; }

/* 🌟 請將分享按鈕的樣式貼在這個位置 🌟 */
.btn-share {
  background: #d2691e; 
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-share:hover {
  background: #a0522d;
}
/* 🌟 分享按鈕樣式結束 🌟 */

.btn-option { display: block; width: 100%; padding: 15px; margin: 10px 0; border: 1px solid #ddd; border-radius: 12px; background: white; text-align: left; font-size: 15px; cursor: pointer; }

/* ... (後面是其他的進度條、彈窗等樣式) ... */
</style>

/* 音量按鈕樣式 */
.btn-mute {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #8b4513;
  color: #8b4513;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.quiz-page-card { margin-top: 0px; }

/* 封面樣式 */
.cover-visual { width: 100%; height: 300px; border-radius: 15px; overflow: hidden; margin-bottom: 10px; }
.kv-image { width: 100%; height: 100%; object-fit: cover; }
.cover-content h1 { font-size: 24px; color: #8b4513; margin: 20px 0; line-height: 1.4; }
.cover-content p { color: #666; margin-bottom: 10px; }

/* 彈窗樣式 */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 100; }
.modal-card { background: white; width: 80%; max-width: 320px; padding: 30px; border-radius: 20px; text-align: center; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
.modal-card h2 { color: #8b4513; margin-bottom: 15px;}
.modal-card p { line-height: 1.5; color: #444; }

/* 按鈕樣式 */
.btn { background: #8b4513; color: white; border: none; padding: 15px; border-radius: 30px; width: 100%; font-size: 16px; cursor: pointer; margin-top: 15px; transition: 0.2s; font-weight: bold;}
.btn:active { transform: scale(0.98); }
.btn-outline { background: transparent; color: #8b4513; border: 1px solid #8b4513; }
.btn-option { display: block; width: 100%; padding: 15px; margin: 10px 0; border: 1px solid #ddd; border-radius: 12px; background: white; text-align: left; cursor: pointer; font-size: 15px; transition: 0.3s; color: #333; line-height: 1.4;}
.btn-option:hover, .btn-option:active { background: #fff8f0; border-color: #8b4513; }

/* 進度條與動畫 */
.progress-bar { background: #eee; height: 8px; border-radius: 4px; margin-bottom: 10px; overflow: hidden; }
.progress { background: #8b4513; height: 100%; border-radius: 4px; transition: width 0.4s ease; }
.q-count { color: #888; font-size: 14px; margin-bottom: 20px; text-align: right;}
.q-text { color: #333; margin-bottom: 20px; line-height: 1.5; font-size: 18px;}

/* 載入動畫與影片 */
.loading-card { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; }
.video-container { width: 150px; height: 150px; border-radius: 50%; overflow: hidden; margin-bottom: 20px; border: 4px solid #fdf5e6; box-shadow: 0 5px 15px rgba(0,0,0,0.1);}
.loading-video { width: 100%; height: 100%; object-fit: cover; }

/* 結果頁樣式 */
.result-pre { color: #666; font-size: 14px; margin-bottom: 5px; }
.result-visual { width: 100%; max-width: 220px; margin: 0 auto 15px; }
.spirit-image { width: 100%; height: auto; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.1)); }
.result-title { color: #8b4513; margin: 10px 0; font-size: 28px; }
.spirit-animal { font-size: 20px; color: #d2691e; margin-bottom: 15px; font-weight: bold; }
.description { font-size: 15px; line-height: 1.6; color: #555; text-align: left; }
.guide { background: #fff8f0; padding: 15px; border-radius: 10px; font-size: 14px; text-align: left; margin: 15px 0; border-left: 5px solid #8b4513; line-height: 1.5; color: #444;}
.btn-reset { background: none; border: none; color: #999; text-decoration: underline; cursor: pointer; margin-top: 20px; font-size: 14px;}
.legal-warning-small { font-size: 12px; color: #999; margin-top: 15px; }

/* --- Vue Transition 動畫樣式 --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>