<template>

<link rel="preload" href="/chamei_shake.mp4" as="video" type="video/mp4">
  
  <div id="app" class="container">
    
    <button v-if="step !== 'start-page'" @click="toggleMute" class="btn-mute">
      {{ isMuted ? '🔇' : '🔊' }}
    </button>
    
    <Transition name="fade" mode="out-in">
      
      <div v-if="step === 'start-page'" class="card cover-card">
        <div class="cover-visual" :class="{ 'skip-intro': hasWatchedIntro }">
          <img :src="coverImage" alt="遊戲封面" class="kv-image">
          
          <img :src="animalCivet" alt="白鼻心" class="kv-animal civet">
          <img :src="animalPangolin" alt="穿山甲" class="kv-animal pangolin">
          <img :src="animalSquirrel" alt="白面鼯鼠" class="kv-animal squirrel">
          <img :src="animalLeopardCat" alt="石虎" class="kv-animal leopard-cat">
          <img :src="animalMagpie" alt="台灣藍鵲" class="kv-animal magpie">
        </div>
        <div class="cover-content">
          <h1 class="main-title">尋找你的微醺精靈</h1>
          <p>探尋內心深處的靈魂，調製專屬於你的特調</p>
          <button @click="handleOpenAgeModal" class="btn btn-start-game" :class="{ 'skip-intro': hasWatchedIntro }">
  開始測驗
</button>
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
        <div class="video-container">
          <video 
  src="/chamei_shake.mp4" 
  autoplay 
  loop 
  muted 
  playsinline 
  preload="auto" 
  :controls="false" 
  class="loading-video"
></video>
        </div>
        <p class="loading-text">
          <span 
            v-for="(char, index) in '茶梅妹正在為你調配命定酒款...'" 
            :key="index" 
            :style="{ 'animation-delay': `${index * 0.15}s` }"
          >
            {{ char }}
          </span>
        </p>
      </div>

      <div v-else-if="step === 'result'" class="card result-card" ref="resultCardRef">
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
        
       <button @click="handleDownloadCard" class="btn btn-outline" data-html2canvas-ignore="true">
          💾 下載專屬精靈卡
        </button>

        <button @click="handleShare" class="btn btn-share">
          <img :src="shareIcon" alt="分享" class="btn-icon">
          分享結果，尋找你的同好!
        </button>

        <button @click="handleGoToStore" class="btn">
          <img :src="giftIcon" alt="禮物" class="btn-icon">
          把你的微醺精靈帶回家~
        </button>
      </div>

    </Transition>

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

// 1. 匯入所有資源
import coverImageFile from './assets/cover.webp'
import img1 from './assets/result_1.webp'
import img2 from './assets/result_2.webp'
import img3 from './assets/result_3.webp'
import img4 from './assets/result_4.webp'
import img5 from './assets/result_5.webp'

import shareIcon from './assets/icon-share.png'
import giftIcon from './assets/icon-gift.png'
import bgmFile from './assets/bgm.mp3'
import clickFile from './assets/click.mp3'

// 🌟 補上這五行：按照正確出場順序匯入首頁動物圖
import animalCivet from './assets/home_civet.png'              // 1. 白鼻心
import animalPangolin from './assets/home_pangolin.png'        // 2. 穿山甲
import animalSquirrel from './assets/home_squirrel.png'        // 3. 白面鼯鼠
import animalLeopardCat from './assets/home_leopard.png'       // 4. 石虎 (注意對齊你資料夾的檔名 home_leopard.png)
import animalMagpie from './assets/home_magpie.png'            // 5. 台灣藍鵲


// 2. 狀態管理
const coverImage = ref(coverImageFile)
const step = ref('start-page') 
const isAgeModalOpen = ref(false)
const currentQuestion = ref(0)
const totalScore = ref(0)
const isMuted = ref(false)
const hasWatchedIntro = ref(false) // 是否已經看過開場動物動畫
const isAgeVerified = ref(false)   // 是否已經驗證過 18 歲

// 3. 音效設定
const bgm = new Audio(bgmFile)
bgm.loop = true
bgm.volume = 0.2 

const clickSound = new Audio(clickFile)
clickSound.volume = 0.5 

onMounted(() => {
  bgm.load()
  clickSound.load()
})

// 🌟 刪除原本的，直接換成這段「零延遲」的秒開寫法
const playClickSound = () => {
  if (!isMuted.value && clickSound) {
    // 核心魔法 1：把播放進度強制拉回開頭（0秒），這樣連續狂點也不會卡住
    clickSound.currentTime = 0; 
    
    // 核心魔法 2：直接播放本體，省去複製檔案（cloneNode）的硬體時間差
    clickSound.play().catch(() => {});
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  bgm.muted = isMuted.value
  if (!isMuted.value && step.value !== 'start-page') {
    bgm.play().catch(() => {})
  }
}

// 4. 測驗題目數據
const questions = [
  { text: "Q1. 結束一天疲勞的工作，回到家你的第一反應是？", options: [{ text: "只想癱坐在沙發上，完全不想動。", score: 1 }, { text: "洗個澡，點起香氛並放點音樂。", score: 2 }, { text: "先做完家事，把今天的進度條推到 100%。", score: 3 }]},
  { text: "Q2. 剛下班卻收到老闆要求加班的訊息，你會怎麼做？", options: [{ text: "假裝沒看到，切斷跟工作的連結。", score: 1 }, { text: "認命處理完畢，結束後開一瓶酒慶祝一下。", score: 2 }, { text: "截圖發到限動，想要有人站在我這邊。", score: 3 }]},
  { text: "Q3. 難得的週末到來，你最喜歡的放鬆行程是？", options: [{ text: "獨自窩在房間看小說或發呆。", score: 1 }, { text: "穿上極具個人風格的服飾去逛街。", score: 2 }, { text: "找三五好友聚在一起大聊特聊。", score: 3 }]},
  { text: "Q4. 當你在路上被陌生人稱讚你的穿搭，你的反應是？", options: [{ text: "覺得有點不自在，想趕快結束對話。", score: 1 }, { text: "內心超開心，覺得遇到了懂生活的同好。", score: 2 }, { text: "表面淡定的說謝謝，心裡早就高興到飛起。", score: 3 }]},
  { text: "Q5. 當你覺得生活充滿讓你過載的細碎資訊，你會怎麼應對？", options: [{ text: "什麼都不想管，把自己捲起來縮成一顆球。", score: 1 }, { text: "喝口酒，讓微醺清空腦袋的資訊垃圾。", score: 2 }, { text: "整理房間，看到整潔的環境心情就好多了。", score: 3 }]},
  { text: "Q6. 對你來說，「享受微醺」最大的意義是什麼？", options: [{ text: "讓內心透透氣，把平常累積的壓力指數歸零。", score: 1 }, { text: "是給靈魂的獎賞，撫平趕報告或工作後的焦慮。", score: 2 }, { text: "用來「暖機」自己，說出平時不敢說的真心話。", score: 3 }]},
  { text: "Q7. 在深夜時刻，你通常處於什麼狀態？", options: [{ text: "思緒像在山林間自由滑翔，非常活躍。", score: 1 }, { text: "剛忙完一天，只想呼呼大睡。", score: 2 }, { text: "在自己空間裡享受Ｍe Time。", score: 3 }]},
  { text: "Q8. 你內心最想逃離的事情是什麼？", options: [{ text: "努力卻總是白做工，想大喊「今天不想努力了」。", score: 1 }, { text: "在人群中顯得平庸，沒有獨特的眼光。", score: 2 }, { text: "害怕隨著時間流逝會漸漸失去身邊的好朋友。", score: 3 }]}
]

// 5. 結果判定
const resultData = computed(() => {
  const s = totalScore.value
  if (s <= 10) return { title: "合法擺爛型", animal: "穿山甲精靈", image: img1, desc: "你極度需要合法擺爛！面對高壓的世界，只想把自己捲成一顆球，把吵鬧都擋在外面。對你來說，最好的放鬆就是切斷與世界的連結。", guide: "來一杯「熷茶梅酒」，讓溫潤的底蘊陪伴你合法擺爛!" }
  if (s <= 14) return { title: "自由獨享型", animal: "白面鼯鼠精靈", image: img2, desc: "你極度渴望 Me Time！你喜歡在自己的空間裡獨處，在深夜裡思緒像在山林間自由滑翔。微醺對你來說，是清空腦袋資訊垃圾、沉澱內心的必要儀式。", guide: "深夜的 Me Time，有「凍頂烏龍茶梅酒」的陪伴，讓思緒像在山林間自由滑翔! " }
  if (s <= 17) return { title: "踏實成就型", animal: "白鼻心精靈", image: img3, desc: "你能在高壓中尋求踏實成就感！你認命且負責，總是能把任務進度條推到 100%。你最享受的，就是完成艱難任務後，慵懶趴在桌上體會的那份微小而扎實的成就感。", guide: "達成任務最需要慶祝，用「蜜香紅烏龍茶梅酒」犒賞剛完成進度條的自己吧! " }
  if (s <= 21) return { title: "質感審美型", animal: "石虎精靈", image: img4, desc: "你具備極高的審美自信！你不想在人群中顯得平庸，透過質感小物能讓你找回對生活的驕傲與自信。", guide: "審美與質感，是你的生活驕傲，如同「東方美人茶梅酒」的芬芳，優雅而不流俗。" }
  return { title: "群居悶騷型", animal: "台灣藍鵲精靈", image: img5, desc: "你極度需要群居歸屬感，而且超級悶騷！表面可能裝作淡定，內心很需要他人的陪伴與認同，微醺是你轉開真心話的鑰匙。", guide: "「玉香綠茶梅酒」是幫你轉開真心話的最佳幫手!" }
})

// 6. 結果圖下載
import html2canvas from 'html2canvas' // 🌟 1. 引入截圖魔法套件

// ... (中間你原本的變數宣告保持不變) ...

const resultCardRef = ref(null) // 🌟 2. 準備一個 ref，等一下用來綁定結果卡片

// 🌟 3. 新增下載圖片的方法
const handleDownloadCard = async () => {
  playClickSound();
  
  if (!resultCardRef.value) return;

  try {
    // 呼叫 html2canvas 幫我們把指定的 DOM 區塊拍成照片
    const canvas = await html2canvas(resultCardRef.value, {
      scale: 2, // 放大 2 倍輸出，確保手機看圖片時依然超高畫質
      useCORS: true, // 允許跨域圖片載入（避免你的 WebP 截不出來）
      backgroundColor: '#ffffff' // 確保卡片底色是乾淨的白色
    });

    // 將畫布轉為 JPG 格式的資料網址
    const imgData = canvas.toDataURL('image/jpeg', 0.9);

    // 建立一個隱形的下載連結並自動點擊
    const link = document.createElement('a');
    link.download = `我的微醺精靈_${resultData.value.title}.jpg`;
    link.href = imgData;
    link.click();
    
  } catch (error) {
    console.error("生成圖片失敗:", error);
    alert("圖片生成失敗，請稍後再試！");
  }
}

// 7. 互動方法
// 🌟 終極優化版：自動幫網址綁上「不重複的小尾巴（時間戳記）」，強迫 LINE 吐出預覽圖
const handleShare = async () => {
  playClickSound();
  
  // 核心魔法：取得當下時間的毫秒數（例如 1717431234567），確保每次分享的網址尾巴都長得不一樣！
  const uniqueId = new Date().getTime();
  
  // 自動組合成：https://alcohol-test-game-5nvx.vercel.app/?v=1717431234567
  const dynamicUrl = `${window.location.origin}${window.location.pathname}?v=${uniqueId}`;

  const shareData = {
    title: '我的微醺精靈人格',
    text: `我在【尋找你的微醺精靈】 中，測出了我是「${resultData.value.title}－${resultData.value.animal}」！你也快來測測看吧！`,
    url: dynamicUrl // 👈 這裡帶入自動加了尾巴的全新網址
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${shareData.text} 測驗連結：${shareData.url}`);
      alert("連結已複製到剪貼簿，快發給好友吧！");
    }
  } catch (err) { console.log('分享失敗:', err); }
};

// 🌟 修改開頭按鈕：如果驗證過了，直接跳到測驗，不用再開彈窗
const handleOpenAgeModal = () => { 
  playClickSound(); 
  if (isAgeVerified.value) {
    // 如果已經確認過 18 歲了，直接進測驗！
    step.value = 'quiz';
    if (!isMuted.value) { bgm.play().catch(()=>{}); }
  } else {
    // 第一次來，還是要乖乖跳年齡確認
    isAgeModalOpen.value = true; 
  }
}
// 🌟 修改確認年齡：點下「是」之後，把驗證狀態改成 true
const handleConfirmAge = () => { 
  playClickSound(); 
  isAgeModalOpen.value = false; 
  isAgeVerified.value = true; // 👈 標記為已驗證
  step.value = 'quiz';
  if (!isMuted.value) { bgm.play().catch(()=>{}); }
}
const handleAlertUnderage = () => { playClickSound(); alert("未滿 18 歲請勿飲酒。"); }
const handleOptionClick = (score) => {
  playClickSound(); totalScore.value += score;
  if (currentQuestion.value < questions.length - 1) { currentQuestion.value++; } 
  else { step.value = 'loading'; setTimeout(() => { step.value = 'result' }, 3000); }
}
const handleReset = () => {  
  playClickSound(); 
  step.value = 'start-page'; 
  currentQuestion.value = 0; 
  totalScore.value = 0; 
  bgm.pause(); 
  bgm.currentTime = 0;
  
  hasWatchedIntro.value = true; // 👈 重置時，強迫標記為「已看過動畫」
}
const handleGoToStore = () => { playClickSound(); window.location.href = "https://18brew.com.tw/product-category/tea_plum_wine/"; }
</script>

<style scoped>
.container { 
  max-width: 400px; margin: 0 auto; min-height: 100vh; background: #fdf5e6; 
  padding: 20px; box-sizing: border-box; position: relative; display: flex; flex-direction: column; justify-content: center;
}

/* 封面副標題設定 */
.cover-content p {
  font-size: 13px;      
  color: #555;
  margin-bottom: 25px;
  line-height: 1.6;
  white-space: nowrap;  /* 強制不換行 */
  overflow: hidden;     /* 隱藏溢出 */
  text-overflow: ellipsis; 
  padding: 0 10px;      
}

/* 按鈕共用樣式 (加入 flex 排版讓圖文對齊) */
.btn { 
  background: #8b4513; color: white; border: none; padding: 15px; border-radius: 30px; 
  width: 100%; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 15px;
  display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s;
}
.btn:active { transform: scale(0.98); }
.btn-outline { background: transparent; color: #8b4513; border: 1px solid #8b4513; }

/* 測驗選項按鈕的美觀樣式 */
.btn-option { 
  display: block; width: 100%; padding: 18px 20px; margin: 12px 0; 
  border: 2px solid #eee; border-radius: 15px; background: white; 
  text-align: left; font-size: 15px; cursor: pointer; transition: all 0.3s ease; 
  color: #444; line-height: 1.4;
}
.btn-option:hover, .btn-option:active { 
  background: #fff8f0; border-color: #8b4513; color: #8b4513;
}

/* 分享按鈕與重新測驗 */
.btn-share { background: #d2691e; margin-top: 20px; }
.btn-share:hover { background: #a0522d; }
.btn-icon { width: 22px; height: 22px; object-fit: contain; }

.btn-reset { 
  background: none; border: none; color: #888; text-decoration: underline; 
  cursor: pointer; margin: 15px auto; font-size: 14px; display: block;
}

.btn-mute { position: absolute; top: 20px; right: 20px; background: rgba(255, 255, 255, 0.8); border: 1px solid #8b4513; color: #8b4513; padding: 8px 12px; border-radius: 20px; font-size: 14px; cursor: pointer; z-index: 10; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }

.card { background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; width: 100%; box-sizing: border-box; }
.main-title { font-size: 26px; line-height: 1.8; color: #8b4513; margin: 20px 0; }

/* 🌟 封面圖片容器（加入 position: relative 讓動物能絕對定位疊在上面） */
.cover-visual { 
  width: 100%; 
  height: 290px; 
  border-radius: 15px; 
  overflow: hidden; 
  margin-bottom: 20px; 
  position: relative; 
}
.kv-image { width: 100%; height: 100%; object-fit: cover; }

/* 🌟 【已修改】絕對座標對齊：強制所有去背小動物與封面圖圖層大小完全重疊 */
.kv-animal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 縮放模式對齊底圖 .kv-image，確保完美相疊不移位 */
  opacity: 0;        /* 預設完全透明 */
  animation: animalFadeIn 0.6s ease-out forwards; /* 動態結束後維持顯示 */
}

/* 🌟 首頁「開始測驗」按鈕的延遲淡入設定 */
.btn-start-game {
  opacity: 0; /* 網頁一打開時預設完全隱形 */
  /* 呼叫下面定義的 btnFadeIn 動畫：時長 0.6 秒，延遲 3.0 秒啟動，結束後維持顯示 (forwards) */
  animation: btnFadeIn 0.6s ease-out 3.0s forwards;
}

/* 🌟 開始按鈕專用的淡入關鍵影格 */
@keyframes btnFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px); /* 帶有一點點由下往上浮現的動態感 */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 🌟 【已修改】純淡入動畫（拿掉形變，100% 還原您在 PS 設計好的大小比例） */
@keyframes animalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ===================================================
   ⏰ 【已修改】只控制每隻動物的出場時間差（依您的順序）
   =================================================== */

/* 1. 白鼻心 */
.civet {
  animation-delay: 0.5s;
}

/* 2. 穿山甲 */
.pangolin {
  animation-delay: 1.0s;
}

/* 3. 白面鼯鼠 */
.squirrel {
  animation-delay: 1.5s;
}

/* 4. 石虎 */
.leopard-cat {
  animation-delay: 2.0s;
}

/* 5. 台灣藍鵲 */
.magpie {
  animation-delay: 2.5s;
}

/* =================================================== */

.progress-bar { background: #eee; height: 8px; border-radius: 4px; margin-bottom: 10px; overflow: hidden; }
.progress { background: #8b4513; height: 100%; transition: width 0.4s ease; }
.q-count { color: #888; font-size: 14px; margin-bottom: 20px; text-align: right;}
.q-text { color: #333; margin-bottom: 20px; line-height: 1.5; font-size: 18px;}

.video-container { 
  width: 100%;          
  height: 250px;        
  margin: 0 auto 20px; 
  background: #ffffff;     
  border-radius: 15px;   
  overflow: hidden;      
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading-video { 
  width: 100%; 
  height: 100%; 
  object-fit: contain;  
  transform: scale(1.1); 
  mix-blend-mode: multiply;
}
.loading-text {
  color: #8b4513;
  letter-spacing: 2px;
  margin-top: 10px;
  font-weight: bold;
}

.loading-text span {
  display: inline-block;
  animation: sequentialBounce 2.5s infinite;
  transform-origin: bottom; 
}

/* 獨立接力彈跳軌跡 */
@keyframes sequentialBounce {
  0% {
    transform: translateY(0);
  }
  5% {
    transform: translateY(-8px); 
  }
  10% {
    transform: translateY(0);     
  }
  100% {
    transform: translateY(0);     
  }
}



.result-pre { color: #666; font-size: 14px; margin-bottom: 5px; }
.result-visual { width: 100%; max-width: 220px; margin: 0 auto 15px; }
.spirit-image { width: 100%; height: auto; filter: drop-shadow(0 5px 15px rgba(210,105,30,0.25)); animation: spiritFloat 3s infinite ease-in-out; }
/* 🌟 定義靈魂漂浮與光芒呼吸的軌跡 */
@keyframes spiritFloat {
  0%, 100% {
    transform: translateY(0);
    filter: drop-shadow(0 5px 15px rgba(210, 105, 30, 0.25));
  }
  50% {
    transform: translateY(-8px); /* 輕微往上飄移 */
    /* 光芒在最高點時變亮、擴散 */
    filter: drop-shadow(0 10px 25px rgba(210, 105, 30, 0.45)); 
  }
}
.result-title { color: #8b4513; margin: 10px 0; font-size: 28px; }
.spirit-animal { font-size: 20px; color: #d2691e; margin-bottom: 15px; font-weight: bold; }
.description { font-size: 15px; line-height: 1.6; color: #555; text-align: left; }
.guide { background: #fff8f0; padding: 15px; border-radius: 10px; font-size: 14px; text-align: left; margin: 15px 0; border-left: 5px solid #8b4513; line-height: 1.5; color: #444;}
.legal-warning-small { font-size: 12px; color: #999; margin-top: 15px; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 100; }
.modal-card { background: white; width: 85%; padding: 30px; border-radius: 20px; text-align: center; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
/* 🌟 核心魔法：當重新測驗回到首頁時，強制所有動物與按鈕瞬間現身，不用再等 3 秒 */
.skip-intro .kv-animal,
.btn-start-game.skip-intro {
  opacity: 1 !important;
  animation: none !important; /* 👈 拔掉所有出場動畫 */
  transition: none !important;
}
</style>