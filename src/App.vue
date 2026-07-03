<template>


  
  <div id="app" class="container">
    
    <link rel="preload" href="/chamei_shake.mp4" as="video" type="video/mp4">

    
    
    

    <Transition name="fade" mode="out-in">
    
      <div v-if="step === 'start-page'" :key="'start'" class="card cover-card" style="position: relative;">
        <img :src="logo" alt="CHAME CHILL" class="brand-logo-cover-in">

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
          <p>探尋內心深處，找到專屬你的微醺精靈!</p>
          <button @click="handleOpenAgeModal" class="btn btn-start-game" :class="{ 'skip-intro': hasWatchedIntro }">
            開始測驗
          </button>
        </div>
      </div>
      
      <div v-else-if="step === 'quiz'" :key="'quiz'" style="width: 100%; position: relative;">
        
      <button @click="toggleMute" class="bgm-btn-quiz" title="切換背景音樂">
      <svg v-if="!isMuted" viewBox="0 0 24 24" class="bgm-icon"><path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
      <svg v-else viewBox="0 0 24 24" class="bgm-icon"><path fill="currentColor" d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l4.73 4.73L21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2z"/></svg>
      </button>

        <img :src="logo" alt="CHAME CHILL" class="fixed-brand-logo">
        
        <div class="card quiz-page-card">
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
          
          <button v-if="currentQuestion > 0" @click="handlePrevQuestion" class="btn-prev">
            返回上一題
          </button>
       

      </div> </div> <div v-else-if="step === 'loading'" :key="'loading'" class="card loading-card">
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
            v-for="(char, index) in '茶梅妹正在調製你的微醺精靈...'" 
            :key="index" 
            :style="{ 'animation-delay': `${index * 0.15}s` }"
          >
            {{ char }}
          </span>
        </p>
      </div>
      
<div v-else-if="step === 'result'" :key="'result'" class="card result-card" :class="{ 'is-downloading': isGenerating }" ref="resultCardRef" style="position: relative;" @scroll="handleResultScroll">        
  
<Transition name="fade">
  <button v-if="showScrollHint" @click="scrollToBottom" class="scroll-hint">
    <svg viewBox="0 0 24 24" class="scroll-arrow"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
  </button>
</Transition>
        
        <button @click="toggleMute" class="bgm-btn-result" title="切換背景音樂">
        <svg v-if="!isMuted" viewBox="0 0 24 24" class="bgm-icon"><path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
        <svg v-else viewBox="0 0 24 24" class="bgm-icon"><path fill="currentColor" d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l4.73 4.73L21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2z"/></svg>
        </button>
        
        <img :src="logo" alt="CHAME CHILL" class="brand-logo-result-left">
        <p class="result-pre">你的微醺精靈是</p>
        <h2 class="result-title" :style="{ color: resultData.textColor }">{{ resultData.title }}</h2>
        
        <div class="result-visual">
          <img :src="resultData.image" :alt="resultData.title" class="spirit-image">
        </div>

        <p class="description">{{ resultData.desc }}</p>

        <div class="guide">
          <strong>🍸 微醺指南：</strong><br>{{ resultData.guide }}
        </div>
        
        <button v-if="!isGenerating" @click="handleReset" class="btn-reset">
          重新測驗
        </button>

        <button v-if="!isGenerating" @click="handleDownloadCard" class="btn btn-download">
          <img :src="downloadIcon" alt="下載" class="btn-icon">
          下載我的微醺精靈卡
        </button>

        <button v-if="!isGenerating" @click="openCamera" class="btn btn-share" style="background-color: #e77d0c;">
          <img :src="cameraIcon" alt="相機" class="btn-icon">
          和我的微醺精靈拍張照
        </button>

        <button v-if="!isGenerating" @click="handleGoToStore" class="btn">
          <img :src="giftIcon" alt="禮物" class="btn-icon">
          把我的微醺精靈帶回家
        </button>
      </div>

<div v-else-if="step === 'camera'" :key="'camera'">
        
  <!-- 📸 狀態 1. 拍攝中：全螢幕真實相機介面 (黑底、大畫面、實體快門鍵) -->
  <div v-show="!generatedPhoto" class="native-camera-view">
    
    <button @click="closeCamera" class="native-cancel-btn-top" aria-label="取消">
      <svg viewBox="0 0 24 24" class="cancel-icon">
        <circle cx="12" cy="12" r="12" fill="rgba(139, 69, 19, 0.1)" />
        <path fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" d="M8.5 8.5L15.5 15.5M15.5 8.5L8.5 15.5" />
      </svg>
    </button>

    <div class="native-camera-content">
      <!-- 沿用原本的 camera-wrapper，但在黑底全螢幕下會自動放到最大 -->
      <div class="camera-wrapper fullscreen-wrapper">
        <video ref="videoRef" autoplay playsinline class="camera-preview"></video>
        <img :src="resultData.frame" class="camera-frame" crossorigin="anonymous" />
      </div>
    </div>
    
    <!-- 底部真實相機控制列 -->
    <div class="native-camera-bottom">
      
      
      <!-- 仿真實相機的同心圓快門鍵 -->
      <button @click="takePhoto" class="shutter-btn">
        <div class="shutter-btn-inner"></div>
      </button>
    </div>
  </div>

  <!-- 📝 狀態 2. 拍攝後：留言預覽卡片 (完美繼承你之前調好的白底排版與滑動邏輯) -->
    <div v-show="generatedPhoto" class="card camera-card has-photo" ref="cameraCardRef" @scroll="handleCameraScroll">    <Transition name="fade">
      <button v-if="generatedPhoto && showCameraScrollHint" @click="scrollCameraToBottom" class="scroll-hint">
        <svg viewBox="0 0 24 24" class="scroll-arrow"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
      </button>
    </Transition>

    <h2 class="main-title" style="margin-top:0; font-size: 18px; color: #6f4d38; font-weight: 900;">
      長按圖片可以儲存/分享哦!
    </h2>
    
    <div class="generated-photo-wrapper">
      <img :src="generatedPhoto" class="final-photo" alt="我的微醺拍貼" />
    </div>

    <!-- 調整後的留言與按鈕並排結構 -->
    <div class="input-word-section">
      <label for="photo-input">在照片上留個言吧：</label>
      <div class="input-with-btn-row">
        <textarea 
          id="photo-input"
          ref="inputRef"
          v-model="userText"
          maxlength="30"
          rows="2"
          placeholder="Ex:我愛CHAMECHILL"
          class="custom-photo-input"
          @input="takePhoto"
          @focus="isFocused = true"
          @blur="handleInputBlur"
        ></textarea>

        <Transition name="fade">
          <button v-if="isFocused" @click="blurInput" class="btn-input-confirm-side">✓</button>
        </Transition>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <button @click="retakePhoto" class="btn btn-outline">重新拍攝</button>
      <button @click="closeCamera" class="btn">返回結果</button>
    </div>
  </div>

</div>

    </Transition>



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

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import html2canvas from 'html2canvas'

// 1. 匯入所有資源
import coverImageFile from './assets/cover.webp'
import img1 from './assets/result_1.webp'
import img2 from './assets/result_2.webp'
import img3 from './assets/result_3.webp'
import img4 from './assets/result_4.webp'
import img5 from './assets/result_5.webp'

import downloadIcon from './assets/icon-download.png'
import cameraIcon from './assets/icon-camera.png'
import giftIcon from './assets/icon-gift.png'
import logo from './assets/logo.png'
import bgmFile from './assets/bgm.mp3'
import clickFile from './assets/click.mp3'

// 🌟 補上這五行：按照正確出場順序匯入首頁動物圖
import animalCivet from './assets/home_civet.png'              // 1. 白鼻心
import animalPangolin from './assets/home_pangolin.png'        // 2. 穿山甲
import animalSquirrel from './assets/home_squirrel.png'        // 3. 白面鼯鼠
import animalLeopardCat from './assets/home_leopard.png'       // 4. 石虎 (注意對齊你資料夾的檔名 home_leopard.png)
import animalMagpie from './assets/home_magpie.png'            // 5. 台灣藍鵲

import frame1 from './assets/frame_1.png'
import frame2 from './assets/frame_2.png'
import frame3 from './assets/frame_3.png'
import frame4 from './assets/frame_4.png'
import frame5 from './assets/frame_5.png'



// 2. 狀態管理
const coverImage = ref(coverImageFile)
const step = ref('start-page') 
const isAgeModalOpen = ref(false)
const currentQuestion = ref(0)
const totalScore = ref(0)
const scoreHistory = ref([]) // 🌟 新增這行：用來記錄每一題得幾分，方便退回時扣除
const isMuted = ref(false)
const hasWatchedIntro = ref(false) // 是否已經看過開場動物動畫
const isAgeVerified = ref(false)   // 是否已經驗證過 18 歲

// 3. 音效設定
const bgm = new Audio(bgmFile)
bgm.loop = true
bgm.volume = 0.2 

const clickSound = new Audio(clickFile)
clickSound.volume = 0.5 

// ... 上方原本的 const clickSound = new Audio(clickFile) ...
// clickSound.volume = 0.5 

// 🌟 新增：處理網頁可見度變化（切換分頁或手機退到背景）的專屬邏輯
const handleVisibilityChange = () => {
  if (document.hidden) {
    // 網頁進入背景（或切換分頁） -> 無條件強制暫停 BGM
    bgm.pause();
  } else {
    // 網頁回到前景 -> 檢查是否需要恢復播放
    // 條件：使用者目前沒有手動靜音，且不是在「首頁 (start-page)」
    if (!isMuted.value && step.value !== 'start-page') {
      bgm.play().catch(() => {});
    }
  }
};

onMounted(() => {
  bgm.load();
  clickSound.load();
  
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
})


onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
})


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
  if (s <= 10) return { title: "穿山甲精靈", image: img1, frame: frame1, textColor: "#e6be51", desc: "你極度需要合法擺爛！面對高壓的世界，只想把自己捲成一顆球，把吵鬧都擋在外面。對你來說，最好的放鬆就是切斷與世界的連結。", guide: "來一杯「熷茶梅酒」，讓溫潤的底蘊陪伴你合法擺爛!" }
  if (s <= 14) return { title: "白面鼯鼠精靈", image: img2, frame: frame2, textColor: "#a29a96", desc: "你極度渴望 Me Time！你喜歡在自己的空間裡獨處，在深夜裡思緒像在山林間自由滑翔。微醺對你來說，是清空腦袋資訊垃圾、沉澱內心的必要儀式。", guide: "深夜的 Me Time，有「凍頂烏龍茶梅酒」的陪伴，讓思緒像在山林間自由滑翔! " }
  if (s <= 17) return { title: "白鼻心精靈", image: img3, frame: frame3, textColor: "#6f4d38", desc: "你能在高壓中尋求踏實成就感！你認命且負責，總是能把任務進度條推到 100%。你最享受的，就是完成艱難任務後，慵懶趴在桌上體會的那份微小而扎實的成就感。", guide: "達成任務最需要慶祝，用「蜜香紅烏龍茶梅酒」犒賞剛完成進度條的自己吧! " }
  if (s <= 21) return { title: "石虎精靈", image: img4, frame: frame4, textColor: "#6a704a", desc: "你具備極高的審美自信！你不想在人群中顯得平庸，透過質感小物能讓你找回對生活的驕傲與自信。", guide: "審美與質感，是你的生活驕傲，如同「東方美人茶梅酒」的芬芳，優雅而不流俗。" }
  return { title: "台灣藍鵲精靈", image: img5, frame: frame5, textColor: "#d8d0be", desc: "你極度需要群居歸屬感，而且超級悶騷！表面可能裝作淡定，內心很需要他人的陪伴與認同，微醺是你轉開真心話的鑰匙。", guide: "「玉香綠茶梅酒」是幫你轉開真心話的最佳幫手!" }
})

const videoRef = ref(null)
const isCameraActive = ref(false)
const generatedPhoto = ref(null) // 用來裝合成好的那張照片
const userText = ref('') // 用來綁定使用者輸入的客製化文字
const rawCapture = ref(null) // 用來暫存照片，防止打字跑版

// 6. 結果圖下載

const resultCardRef = ref(null)
const isGenerating = ref(false)

// 🌟 控制下滑提示顯示與否的變數
const showScrollHint = ref(true)

// 🌟 當使用者在結果頁滑動超過 20px 時，自動隱藏提示
const handleResultScroll = (e) => {
  if (e.target.scrollTop > 20 && showScrollHint.value) {
    showScrollHint.value = false;
  }
}

// 🌟 核心邏輯：控制結果頁面自動向下捲動
const scrollToBottom = () => {
  playClickSound();
  if (resultCardRef.value) {
    // 🌟 動態偵測：如果螢幕高度 <= 740px，只滑動 150px；大螢幕則維持 300px
    const scrollDistance = window.innerHeight <= 740 ? 250 : 300;

    // 讓卡片向下捲動，並加上平滑過渡效果
    resultCardRef.value.scrollBy({
      top: scrollDistance, 
      behavior: 'smooth'
    });
  }
}

// ==========================================
// 🌟 新增：相機頁面專用的下滑提示邏輯
// ==========================================
const cameraCardRef = ref(null)
const showCameraScrollHint = ref(true) // 控制箭頭顯示或隱藏

// 當使用者自己往下滑動超過 20px 時，自動隱藏箭頭
const handleCameraScroll = (e) => {
  if (e.target.scrollTop > 20 && showCameraScrollHint.value) {
    showCameraScrollHint.value = false;
  }
}

// 點擊箭頭時，自動平滑往下滾動
const scrollCameraToBottom = () => {
  playClickSound();
  if (cameraCardRef.value) {
    cameraCardRef.value.scrollBy({
      top: 70, 
      behavior: 'smooth'
    });
  }
}

const handleDownloadCard = async () => {
  playClickSound();
  if (!resultCardRef.value) return;

  isGenerating.value = true;
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const canvas = await html2canvas(resultCardRef.value, {
      scale: 3, 
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollY: -window.scrollY,
      // 🌟 核心修復：告訴截圖套件「忽略」任何帶有 'bgm-btn-result' 類別的元素
      ignoreElements: (element) => {
        if (element.classList && element.classList.contains('bgm-btn-result')) {
          return true; // return true 代表「忽略這個元素，不要截圖」
        }
        // 如果未來還有其他不想被截圖的按鈕（例如下滑提示箭頭），也可以加在這裡
        if (element.classList && element.classList.contains('scroll-hint')) {
          return true; 
        }
        return false;
      }
    });

    const imgData = canvas.toDataURL('image/png');

    // 🌟 魔法轉換：將圖片轉換成手機看得懂的「真實檔案 (File)」
    const blob = await (await fetch(imgData)).blob();
    const file = new File([blob], `我的微醺精靈_${resultData.value.title}.png`, { type: 'image/png' });

    // 🌟 判斷裝置是否支援呼叫「原生分享面板」
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      // 📱 手機端：喚起原生分享面板，讓使用者點擊「儲存影像」
      await navigator.share({
        files: [file],
        title: '我的微醺精靈卡',
      });
    } else {
      // 💻 電腦端或舊瀏覽器：維持原本的強制下載方式
      const link = document.createElement('a');
      link.download = `我的微醺精靈_${resultData.value.title}.png`;
      link.href = imgData;
      link.click();
    }

  } catch (error) {
    // 🌟 新增判斷：如果是使用者自己關閉或取消分享面板，就默默結束，不要報錯！
    if (error.name === 'AbortError') {
      console.log("使用者取消了分享或儲存動作");
      return; 
    }
    
    // 如果是真的生成失敗，才跳出警告
    console.error("生成圖片失敗:", error);
    alert("圖片生成失敗，請稍後再試！");
  } finally {
    isGenerating.value = false;
  }
}
// 7. 互動方法
// 自動幫網址綁上「不重複的小尾巴（時間戳記）」，強迫 LINE 吐出預覽圖
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

// 修改開頭按鈕：如果驗證過了，直接跳到測驗，不用再開彈窗
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
// 修改確認年齡：點下「是」之後，把驗證狀態改成 true
const handleConfirmAge = () => { 
  playClickSound(); 
  isAgeModalOpen.value = false; 
  isAgeVerified.value = true; // 標記為已驗證
  step.value = 'quiz';
  if (!isMuted.value) { bgm.play().catch(()=>{}); }
}
const handleAlertUnderage = () => { playClickSound(); alert("未滿 18 歲請勿飲酒。"); }
// 點擊選項 (下一題)
const handleOptionClick = (score) => {
  playClickSound(); 
  scoreHistory.value.push(score); // 1. 把這題的分數存進歷史紀錄
  totalScore.value += score;      // 2. 加上總分
  
  if (currentQuestion.value < questions.length - 1) { 
    currentQuestion.value++; 
  } else { 
    step.value = 'loading'; 
    setTimeout(() => { step.value = 'result' }, 3000); 
  }
}

// 返回上一題的邏輯
const handlePrevQuestion = () => {
  playClickSound();
  if (currentQuestion.value > 0) {
    currentQuestion.value--;                    // 1. 題號減一
    const lastScore = scoreHistory.value.pop(); // 2. 從紀錄中拿出上一題的分數並移除
    totalScore.value -= lastScore;              // 3. 把總分扣掉這個分數，完美還原！
  }
}
const handleReset = () => {  
  playClickSound(); 
  step.value = 'start-page'; 
  currentQuestion.value = 0; 
  totalScore.value = 0; 
  scoreHistory.value = []; // 重新測驗時清空歷史紀錄
  bgm.pause(); 
  bgm.currentTime = 0;
  
  // 🌟 新增：重新測驗時，把下滑提示叫回來
  showScrollHint.value = true;

  hasWatchedIntro.value = true; // 重置時，強迫標記為「已看過動畫」
}
// 改用 window.open 並加上 "_blank"，讓商城在新的分頁開啟
const handleGoToStore = () => { 
  playClickSound(); 
  window.open("https://18brew.com.tw/product-category/tea_plum_wine/", "_blank"); 
}

// ==========================================
// 8. 拍立得 (相機與合成邏輯)
// ==========================================

// 📸 開啟相機
const openCamera = async () => {
  playClickSound();
  step.value = 'camera'; // 切換到相機頁面
  generatedPhoto.value = null; // 確保每次進來都是乾淨的相機畫面
  userText.value = ''; // 每次進來拍貼機，都把文字輸入框清空

  try {
    // 請求前置鏡頭權限
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'user',
        width: { ideal: 4096 },  // 故意要求極高的寬度
        height: { ideal: 2160 }  // 故意要求極高的高度
      } 
    });
    
    // 確保 Vue 已經渲染了 video 標籤後，再將影像流灌入
    setTimeout(() => {
        if (videoRef.value) {
          videoRef.value.srcObject = stream;
        }
      }, 400);
  } catch (err) {
    console.error("相機權限錯誤:", err);
    alert("無法開啟相機，請確認您已允許瀏覽器使用相機權限喔！");
    step.value = 'result'; // 拒絕權限的話，退回結果頁
  }
}

// 📸 關閉相機 (切換頁面時釋放硬體資源，避免相機綠燈一直亮著)
const closeCamera = () => {
  playClickSound();
  if (videoRef.value && videoRef.value.srcObject) {
    const tracks = videoRef.value.srcObject.getTracks();
    tracks.forEach(track => track.stop()); // 停止所有影像軌道
  }
  step.value = 'result'; // 返回結果頁
}

// 📸 拍照與合成下載 (完美比例裁切版)

// 重拍按鈕邏輯
const retakePhoto = () => {
  playClickSound();
  generatedPhoto.value = null; // 把照片清空
  rawCapture.value = null;
}

const takePhoto = () => {
  playClickSound();
  const video = videoRef.value;
  if (!video) return;

  const frameImg = new Image();
  frameImg.crossOrigin = "anonymous";
  frameImg.src = resultData.value.frame;

  frameImg.onload = () => {
    // 1. 建立虛擬畫布
    const canvas = document.createElement('canvas');
    canvas.width = frameImg.width;
    canvas.height = frameImg.height;
    const ctx = canvas.getContext('2d');

    // ===================================================
    // 📸 情況 A：第一次按下「喀嚓」按鈕 (此時 rawCapture 是空的)
    // ===================================================
    if (!rawCapture.value) {
      // 建立一個只有人臉的獨立虛擬畫布，把這一瞬間定格下來
      const faceCanvas = document.createElement('canvas');
      faceCanvas.width = canvas.width;
      faceCanvas.height = canvas.height;
      const faceCtx = faceCanvas.getContext('2d');

      // 計算影片裁切比例
      const videoRatio = video.videoWidth / video.videoHeight;
      const canvasRatio = canvas.width / canvas.height;
      let drawWidth, drawHeight, startX, startY;

      if (videoRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = video.videoWidth * (canvas.height / video.videoHeight);
        startX = (canvas.width - drawWidth) / 2;
        startY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = video.videoHeight * (canvas.width / video.videoWidth);
        startX = 0;
        startY = (canvas.height - drawHeight) / 2;
      }

      // 處理鏡像並把人臉畫上去
      faceCtx.save();
      faceCtx.translate(faceCanvas.width, 0);
      faceCtx.scale(-1, 1);
      faceCtx.drawImage(video, startX, startY, drawWidth, drawHeight);
      faceCtx.restore();

      // 把這一瞬間純人臉的 Base64 牢牢存起來，從此相機關掉也不怕
      rawCapture.value = faceCanvas.toDataURL('image/png');
    }

    // ===================================================
    // 🎨 開始正式疊加合成 (不論是拍照還是打字，都用穩定的圖層)
    // ===================================================
    const savedFaceImg = new Image();
    savedFaceImg.src = rawCapture.value;
    
    savedFaceImg.onload = () => {
      // 圖層 1：畫上剛剛定格下來的清晰人臉
      ctx.drawImage(savedFaceImg, 0, 0, canvas.width, canvas.height);

      // 圖層 2：畫上透明相框
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

      // 圖層 3：檢查並繪製使用者文字
      if (userText.value.trim() !== '') {
        ctx.save();
        ctx.font = "bold 65px 'MyCustomFont', sans-serif";
        // 改成動態抓取當前動物精靈對應的字體顏色！
        ctx.fillStyle = resultData.value.textColor;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        
        const textX = canvas.width * 0.08;

        // 換行機制：讀取使用者手動按 Enter 產生的換行符號 (\n)
        let lines = [];
        const rawLines = userText.value.split('\n'); // 依照手動換行來切割字串
        
        // 🌟 新增：中英文智慧字元權重折行邏輯
rawLines.forEach(text => {
  let currentLine = "";
  let currentLength = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    // 使用正則表達式檢查是否為中文字元或全形標點
    const charLength = /[^\x00-\xff]/.test(char) ? 2 : 1;

    // 當目前累積權重加上新字元超過單行上限（16碼 = 8個中文字寬度）時強制折行
    if (currentLength + charLength > 16) {
      lines.push(currentLine);
      currentLine = char;
      currentLength = charLength;
    } else {
      currentLine += char;
      currentLength += charLength;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
});
        
        // 確保最終最多只會畫出 2 行
        lines = lines.slice(0, 2);

        const targetY = canvas.height * 0.88; 

        if (lines.length === 2) {
          const lineGap = 58; 
          const line1Y = targetY - (lineGap / 2);
          const line2Y = targetY + (lineGap / 2);
          
          ctx.fillText(lines[0], textX, line1Y);
          ctx.fillText(lines[1], textX, line2Y);
        } else if (lines.length === 1 && lines[0] !== '') {
          // 只有一行字時，完美垂直置中
          ctx.fillText(lines[0], textX, targetY);
        }
        
        ctx.restore();
      }

      // 輸出最終成品
      generatedPhoto.value = canvas.toDataURL('image/png');

      // 🌟 每次成功拍完照、進入留言頁面時，強制喚醒下滑箭頭！
      showCameraScrollHint.value = true;
    };
  };
}

// 🌟 1. 新增一個用來記錄目前是不是正在打字的響應式變數
const inputRef = ref(null)
const isFocused = ref(false)

// 🌟 2. 當輸入框失焦時，稍微延遲將狀態改回 false，確保點擊事件能完美觸發
const handleInputBlur = () => {
  setTimeout(() => {
    isFocused.value = false;
  }, 150);
}

// 你的 blurInput 函數保持不變即可：
const blurInput = () => {
  playClickSound(); // 順便播放你原本寫好的點擊音效，給使用者極佳的回饋感！
  if (inputRef.value) {
    inputRef.value.blur(); // 強制 Android 鍵盤收起！
  }
}

</script>

<style scoped>

@font-face {
  font-family: 'MyCustomFont'; /* 這是我們給字體取的小名，之後都用這個名字呼叫它 */
  src: url('./assets/ChenYuluoyan-2.0-Thin.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* 局部修改後 */
.container { 
  max-width: 400px; 
  margin: 0 auto; 
  background: #fdf5e6; 
  padding: 20px; 
  box-sizing: border-box; 
  position: relative; 
  display: flex; 
  flex-direction: column; 
  justify-content: center;
  height: 100dvh !important;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  overflow: hidden;
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

/* 🌟 新增：當手機螢幕寬度小於或等於 385px 時（例如 iPhone 11、iPhone 13 mini）自動啟動 */
@media screen and (max-width: 385px) {
  .cover-content p {
    font-size: 11.5px;    /* 🚀 在窄螢幕手機上自動縮小字體，確保絕對不換行且完整呈現 */
    letter-spacing: -0.3px; /* 稍微縮緊字距 */
    padding: 0 4px;       /* 釋放邊緣空間 */
  }
}

/* 🌟 修改後的按鈕共用樣式 */
.btn { 
  background: #8b4513; 
  color: white; 
  border: none; 
  padding: 15px; 
  border-radius: 30px; 
  width: 100%; 
  font-size: 16px; 
  font-weight: bold; 
  cursor: pointer; 
  margin-top: 15px;
  
  display: flex; 
  align-items: center; 
 justify-content: center; 
 gap: 8px;
  transition: 0.2s;
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
.btn-share { background: #dc5b00; margin-top: 20px; }
.btn-share:hover { background: #a0522d; }

/* 1. 同時控制結果頁面的 下載、分享 與 導購按鈕 */
.result-card .btn-download,
.result-card .btn-share,
.result-card .btn {
  position: relative;          /* 🌟 建立座標基準，讓裡面的小圖標可以依據它來對齊 */
  justify-content: center !important; /* 🌟 讓按鈕文字恢復「絕對置中」 */
  padding-left: 0 !important;   /* 拔掉之前設定的左邊距 */
  padding-right: 0 !important;  
}

/* 2. 核心魔法：把小圖標從原本的排隊隊伍中抽出來，單獨釘在左邊固定位置 */
.result-card .btn-icon { 
  width: 22px; 
  height: 22px; 
  object-fit: contain; 
  flex-shrink: 0; 
  
  position: absolute;          /* 🌟 開啟絕對定位（隱形圖層） */
  left: 25px;                  /* 🌟 距離按鈕最左邊固定 25 像素，三個圖標就會完美垂直對齊！ */
  top: 50%;                    /* 讓圖標上下居中 */
  transform: translateY(-50%); /* 修正上下居中的偏差值 */
}

.btn-icon { width: 22px; height: 22px; object-fit: contain; flex-shrink: 0; }

/* 🌟 專屬下載按鈕：優雅的茶葉深綠，完美契合茶梅酒與精靈主題 */
.btn-download {
  background: #4a6754; 
  color: white;
  margin-top: 20px;
}

/* 輕微的滑鼠懸停/點擊加深效果，讓按鈕有按下去的動態回饋 */
.btn-download:active {
  background: #395041;
}

.btn-reset { 
  background: none; border: none; color: #888; text-decoration: underline; 
  cursor: pointer; margin: 15px auto; font-size: 14px; display: block;
}



.card { background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; width: 100%; box-sizing: border-box; }
.main-title { font-size: 26px; line-height: 1.8; color: #8b4513; margin: 20px 0; }

/* 🌟 封面圖片容器（加入 position: relative 讓動物能絕對定位疊在上面） */
.cover-visual {
  width: 100%;
  height: auto;
  overflow: visible; 
  position: relative;
  margin: 0;
  border-radius: 0 0 20px 20px; 
}
.kv-image { width: 100%; height: auto; object-fit: contain; border-radius: 0 0 20px 20px; display: block; }

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
  border-radius: 0 0 20px 20px;
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
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 9999 !important; }
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

/* ===================================================
   🌟 品牌 Logo 專屬三頁面視覺對齊設定
   =================================================== */

/* 1. 封面卡片內左上角 Logo（利用絕對定位釘死） */
.brand-logo-cover-in {
  position: absolute;
  top: 10px;
  left: 20px;
  width: 80px; 
  height: auto;
  display: block;
}

/* 2. QA 頁面卡片外置中大 Logo */
.fixed-brand-logo, 
.brand-logo-result-left {
  position: fixed;
  top: -150px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;  
  height: auto;
  display: block;
  z-index: 100;
  pointer-events: none;
}

/* 3. 結果頁面卡片外左上角 Logo */
.brand-logo-result-left {
  position: absolute;
  top: 15px;
  left: 50px;
  width: 70px;
  height: auto;
  display: block;
}

/* 新的 Logo 固定樣式 */
.fixed-brand-logo {
  position: fixed;        /* 鎖定位置，不會隨滾動或內容變化而移動 */
  top: 30px;              /* 距離螢幕最上方 20px */
  left: 50%;
  transform: translateX(-50%);
  width: 100px;            /* 設定你喜歡的大小 */
  height: auto;
  z-index: 1000;           /* 確保在最上層 */
  pointer-events: none;
}

/* 確保卡片內容不會被 Logo 擋住 */
.quiz-page-card {
  margin-top: 0px !important; /* 騰出空間給上面的 Logo */
}

/* ===================================================
   🌟 拍立得相機專屬視覺設定
   =================================================== */

/* 1. 調整相機外層卡片的內距 */
.camera-card {
  padding: 20px;
}

/* 2. 相機畫面容器：設定完美的拍貼機比例 */
.camera-wrapper {
  position: relative;
  width: 100%;

  /* 對齊新相框的 1080 x 1294 像素尺寸 */
  --frame-width: 1080;
  --frame-height: 1294;
  aspect-ratio: var(--frame-width) / var(--frame-height);

  margin: 0 auto;
  overflow: hidden;
  border-radius: 15px; /* 圓角修飾 */
  background: #222;    /* 鏡頭載入前或尚未開啟時的預設黑底色 */
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

/* 3. 攝影機預覽畫面：滿版填滿並加上鏡像翻轉 */
.camera-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;     /* 🌟 確保鏡頭畫面完美填滿容器，不留黑邊也不變形 */
  transform: scaleX(-1); /* 🌟 鏡像魔法：視覺上將前鏡頭左右翻轉，讓使用者看起來像照鏡子一樣自然 */
  display: block;
}

/* 4. 動態邊框：絕對定位蓋在畫面上方 */
.camera-frame {
  position: absolute;
  top: 0; 
  left: 0;
  width: 100%; 
  height: 100%;
  object-fit: contain;    /* 確保相框圖檔也能完美貼合容器大小 */
  pointer-events: none; /* 讓使用者的點擊能穿透相框，避免干擾底層的互動 */
  z-index: 10;          /* 確保相框疊在攝影機畫面 (video) 的上方 */
}

/* 🌟 返回上一題按鈕的專屬樣式 */
.btn-prev {
  background: none;
  border: none;
  color: #999;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 15px;
  font-size: 14px;
  display: block;
  width: 100%;
  text-align: center;
  transition: color 0.3s;
}

.btn-prev:hover {
  color: #8b4513; /* 滑鼠移過去時變成品牌咖啡色 */
}

/* ===================================================
   🎵 BGM 右上角半透明玻璃感開關按鈕
   =================================================== */
/* ===================================================
   🎵 1. 測驗頁面（Quiz）：長螢幕（iPhone 11）預設視窗固定位置
   =================================================== */
.bgm-btn-quiz {
  position: fixed;        /* 🔒 鎖定螢幕視窗，不隨卡片內容移動 */
  top: 40px;              /* 💎 iPhone 11 的舒適上方間距 */
  right: 20px;            /* 💎 右上角黃金定位 */

  width: 36px;
  height: 36px;
  border-radius: 50%;     /* 強制正圓形 */
  border: 1px solid rgba(139, 69, 19, 0.15);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: #8b4513; 
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 200;           /* 提升層級，確保絕對不被卡片或插畫遮擋 */
}
.bgm-btn-quiz:active { transform: scale(0.95); }

/* ===================================================
   🎵 2. 結果頁面（Result）：長螢幕（iPhone 11）預設視窗固定位置
   =================================================== */
.bgm-btn-result {
  position: absolute;        /* 🔒 鎖定螢幕視窗 */
  top: 10px;              /* 🎯 長螢幕下往下微移，優雅避開結果頁大標題與商標 */
  right: 10px;

  width: 36px;
  height: 36px;
  border-radius: 50%;     /* 強制正圓形 */
  border: 1px solid rgba(139, 69, 19, 0.15);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: #8b4513; 
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 200;           /* 修正：將 z-index 從 10 提升到 200，防止圖層被 result-card 蓋過去變扁 */
}
.bgm-btn-result:active { transform: scale(0.95); }


/* 向量圖示共用尺寸縮放限制 */
.bgm-icon {
  width: 18px;
  height: 18px;
  display: block;
}

.bgm-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.05);
}

.bgm-toggle-btn:active {
  transform: scale(0.95);
}

.bgm-icon {
  width: 18px;
  height: 18px;
  display: block;
}

/* ===================================================
   🌟 生成照片與長按提示專屬設定
   =================================================== */

.generated-photo-wrapper {
  aspect-ratio: 1080 / 1294;
  
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15); /* 加深陰影，讓照片看起來有實體感 */
}

.final-photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.save-hint {
  color: #dc5b00; /* 使用品牌顯眼的橘黃色 */
  font-weight: bold;
  font-size: 15px;
  margin-top: 20px;
  animation: pulseHint 1.5s infinite; /* 加上呼吸燈動畫吸引目光 */
}

@keyframes pulseHint {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.03); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

/* ===================================================
   🌟 客製化相片輸入框樣式
   =================================================== */

.input-word-section {
  margin-top: 15px;
  text-align: left;
  padding: 0 5px;
}

.input-word-section label {
  display: block;
  font-size: 14px;
  color: #8b4513; /* 品牌咖啡色 */
  font-weight: bold;
  margin-bottom: 6px;
}

.custom-photo-input {
  width: 100%;
  padding: 18px 15px 6px 15px;
  border: 2px solid #e6d7c3; /* 柔和的木質米色邊框 */
  border-radius: 12px;
  font-size: 15px;
  box-sizing: border-box;
  background-color: #fffaf0; /* 溫暖偏白 */
  color: #5a3d28;
  outline: none;
  transition: all 0.3s;
  /* 鎖定文字框大小，避免被亂拉 */
  resize: none; 
  overflow: hidden;
  letter-spacing: 0px;
}

/* 輸入框聚焦時變色 */
.custom-photo-input:focus {
  border-color: #8b4513;
  box-shadow: 0 0 8px rgba(139, 69, 19, 0.15);
}

/* 暫位文字顏色 */
.custom-photo-input::placeholder {
  color: #c4b39e;
  letter-spacing: 0.5px;

}

/* ===================================================
   📱 針對長螢幕手機（高度小於 740px，如 iPhone 11）的例外放大調校
   =================================================== */
@media screen and (max-height: 741px) {
  .quiz-page-card {
    /* 💎 螢幕夠長，向下推回 80px，維持大氣、留白的文青比例 */
    margin-top: 70px !important; 
  }
  
  .fixed-brand-logo {
     top: 45px !important; 
  }

/* 如果你的 Logo 在所有頁面都要統一往下移以避免裁切，直接改這段通用樣式 */
.fixed-brand-logo {
  position: fixed;
  top: 20px !important; /* 🌟 這是全域修正，增加 Logo 與頂部的安全距離 */
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: auto;
  z-index: 100;
  pointer-events: none;
}

  .bgm-toggle-btn {
  position: absolute;
  top: 25px;
  right: 25px;
 }

  .fixed-brand-logo {
    top: 10px;        /* Logo 恢復原本的舒適高度 */
    width: 90px;      /* Logo 恢復原本放大比例 */
  }
 
 .bgm-btn-quiz {
  position: fixed;
  top: 20px;          /* 🎯 釘在測驗卡片外螢幕的右上角 */
  right: 20px;
 }
 
 .bgm-btn-result {
   position: absolute; 
    top: 10px;
    right: 10px;
  }

  .btn-option {
    padding: 18px 20px; /* 選項按鈕恢復原本大氣的內距 */
    margin: 12px 0;     /* 恢復原本寬鬆的按鈕間距 */
  }

}
.cover-card,
.loading-card,
.quiz-page-card {
  max-height: none;
  overflow: hidden;
  touch-action: none;        /* 🔒 只有這幾個頁面維持絕對不准亂動 */
}

.result-card,
.camera-card {
  max-height: 82vh !important;     /* 限制高度，保留上下呼吸空間 */
  overflow-x: hidden !important;   /* 鎖死左右滑動 */
  overflow-y: auto !important;     /* 🚀 關鍵魔法：允許內部上下滾動！ */
  
  touch-action: pan-y !important;  /* 告訴手機系統：這裡只接收上下滑動指令 */
  -webkit-overflow-scrolling: touch; /* 讓 iOS 滑起來像 App 一樣有慣性 */

  /* 確保卡片維持在正中央，不被隱形滾動條擠歪 */
  margin-left: auto !important;
  margin-right: auto !important;
  scrollbar-gutter: stable; 
  width: 100% !important;
  box-sizing: border-box !important;
}

/* 🌟 1. 拍照前（沒有 has-photo 標籤時）：鎖死滑動！ */
  .camera-card:not(.has-photo) {
    overflow-y: hidden !important; 
    touch-action: none !important; 
  }

  /* 🌟 2. 拍照後（進入留言頁面，有 has-photo 標籤時）：解鎖滑動！ */
  .camera-card.has-photo {
    overflow-y: auto !important; 
    touch-action: pan-y !important; 
  }

/* 🌟 全新補上：縮減小螢幕卡片的上下留白，把所有內容往上拉！ */
  .camera-card {
    padding-top: 12px !important;    /* 將頂部留白從 20px 縮小到 12px */
    padding-bottom: 15px !important; /* 稍微縮小底部留白 */
  }

  /* 🌟 全新補上：讓標題跟照片靠得更近一點，節省高度 */
  .camera-card .main-title {
    margin-bottom: 10px !important;  
  }

/* ===================================================
   👇 極簡風格：向下箭頭提示器
   =================================================== */
.scroll-hint {
  position: fixed;
  bottom: 60px;          /* 🎯 稍微調整位置 */
  right: 20px;
  
  pointer-events: auto;

  display: flex;
  align-items: center;
  justify-content: center;
  
  background: rgba(255, 255, 255, 0.2); /* 稍微調高不透明度，讓箭頭更清楚 */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(4px);
  
  width: 40px;            /* 設定固定寬高成為正圓形 */
  height: 40px;
  border-radius: 50%;     /* 變成完美的圓形 */
  
  box-shadow: 0 4px 10px rgba(139, 69, 19, 0.2); 
  border: 1px solid rgba(139, 69, 19, 0.1);
  
  color: #8b4513;         /* 品牌色咖啡色 */
  z-index: 150;
  pointer-events: auto;   /* 穿透點擊 */
  
  /* 呼叫彈跳動畫 */
  animation: bounceDown 2s infinite ease-in-out;
}

.scroll-arrow {
  width: 24px;            /* 稍微放大箭頭 */
  height: 24px;
}

/* 輕盈的上下彈跳動畫 */
@keyframes bounceDown {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(8px); /* 彈跳幅度稍微拉大一點，更吸睛 */
  }
  60% {
    transform: translateY(4px);
  }
}

/* ===================================================
   🚀 Android 防呆：輸入框專屬「完成」按鈕
   =================================================== */
/* 🌟 全新：輸入框與右側按鈕的並排容器 */
.input-with-btn-row {
  display: flex;
  align-items: stretch; /* 讓按鈕高度自動拉伸與輸入框等高 */
  gap: 10px;            /* 輸入框與按鈕的間距 */
  width: 100%;
  margin-top: 6px;
}

/* 🌟 修改：讓輸入框在並排時自動分配寬度 */
.custom-photo-input {
  flex: 1;              
  
  /* 🌟 1. 鎖定你現在覺得最完美的框框總高度（大概是 42px~46px 左右，可微調） */
  height: 44px;
  
  /* 🌟 2. 獨立控制四個方向的內距：上、右、下、左 */
  padding-top: 12px;    /* 👈 關鍵：加大上面，把字往下推到正中央 */
  padding-right: 10px;  
  padding-bottom: 0px;  /* 👈 下面不留白，避免把框撐大 */
  padding-left: 10px;   /* 👈 左邊留白，讓字不要撞到邊框 */
  
  border: 1px solid #e6d7c3;
  border-radius: 12px;
  font-size: 16px;
  box-sizing: border-box; /* 這個魔法讓 padding 不會影響總高度 */
  background-color: #fffaf0;
  color: #5a3d28;
  outline: none;
  transition: all 0.3s;
  resize: none; 
  overflow: hidden;
  letter-spacing: 0px;
}

/* 🌟 全新：放在右側的專屬勾勾按鈕樣式 */
.btn-input-confirm-side {
  background: #8b4513 !important;
  color: white !important;
  border: none !important;
  width: 50px !important;      /* 固定寬度，變成一個精緻的方形按鈕 */
  font-size: 20px !important;   /* 讓勾勾大一點，更好點擊 */
  font-weight: bold !important;
  border-radius: 12px !important;
  cursor: pointer;
  display: flex !important;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(139, 69, 19, 0.2);
  flex-shrink: 0;              /* 防止按鈕被擠壓變形 */
}

.btn-input-confirm-side:active {
  transform: scale(0.95);
  background: #733c10 !important;
}

/* 點擊時的輕微縮小回饋 */
.btn-input-confirm:active {
  transform: scale(0.95);
  background: #733c10 !important;
}

/* ===================================================
   🌟 只有螢幕高度小於 740px 的手機，才需要顯示下滑提示
   =================================================== */
@media screen and (min-height: 741px) {
  .camera-card .scroll-hint {
    display: none !important; /* 只要螢幕高於 741px，強制隱藏箭頭！ */
  }

.camera-card {
    overflow-y: hidden !important; /* 2. 拔除上下滾動條 */
    touch-action: none !important; /* 3. 禁止手指觸控拖曳滑動 */
  /* 🌟 核心修改：縮減卡片上下的總留白，把內容全部往上提！ */
    padding-top: 12px !important;    
    padding-bottom: 15px !important; 
  }

  .camera-card .main-title {
    /* 🌟 縮小「長按圖片...」標題跟照片的距離 */
    margin-bottom: 10px !important;  
  }
}

/* ===================================================
   📸 沉浸式：真實相機 (Native Camera) 專屬視覺設計
   =================================================== */
.native-camera-view {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 400px; /* 完美吻合外部 container，防止在電腦大螢幕暴走 */
  height: 100dvh;
  background-color: transparent;
  z-index: 9999; /* 蓋過所有網站底色和 Logo */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.native-camera-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  padding: 0 10px; /* 讓兩側保留一小點呼吸空間 */
  box-sizing: border-box;
}

.fullscreen-wrapper {
  width: 100%;
  max-width: 500px;
  border-radius: 12px; /* 稍微縮小圓角，更像真實取景框 */
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.1); /* 微弱的環境光暈 */
}

/* 🌟 修改：取消按鈕的定位與點擊特效 */
.native-cancel-btn-top {
  position: absolute;
  top: 25px;       
  left: 20px;      
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10000;  
  padding: 5px;   
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.2s ease; /* 加入平滑縮放特效 */
}

/* 點擊時稍微縮小，提供真實按鈕的物理回饋感 */
.native-cancel-btn-top:active {
  transform: scale(0.85);
}

/* 🌟 新增：專門控制叉叉圖示的大小 */
.cancel-icon {
  width: 32px;  /* 控制圓形圖示的直徑 */
  height: 32px;
}

.native-camera-bottom {
  height: 150px;
  padding-bottom: 20px;
  display: flex;
  justify-content: center; /* 🚀 關鍵：讓裡面唯一的快門鍵完美正中央置中！ */
  align-items: center;
  background-color: transparent;
  width: 100%;
  box-sizing: border-box;
}

.native-cancel-btn {
  color: #fff;
  font-size: 17px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-weight: bold;
  margin-top: -100px;
}

/* 🌟 核心靈魂：真實相機的快門鍵 */
.shutter-btn {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: transparent;
  border: 4px solid #8b4513;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent; /* 消除點擊怪異藍光 */
  margin-bottom: 80px;
}

.shutter-btn-inner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #8b4513;
  transition: all 0.15s ease-out; /* 模擬彈簧阻尼感 */
}

/* 點擊快門時的動態回饋 (內圈縮小、變暗) */
.shutter-btn:active .shutter-btn-inner {
  transform: scale(0.85);
  background: #ccc;
}

/* ===================================================
   📱 終極覆蓋：針對小螢幕 (小於 741px) 的相機黃金比例微調
   =================================================== */
@media screen and (max-height: 741px) {
  
  /* 🌟 1. 取消按鈕再往上提（貼近頂端） */
  .native-cancel-btn-top {
    top: 8px !important;
  }

  /* 🌟 2. 底部控制列高度再縮小（釋放更多下方空間給相框） */
  .native-camera-bottom {
    height: 75px !important; 
  }

  /* 🌟 3. 快門鍵歸零！完全解除底部推力，讓它順利降落到螢幕最底端 */
  .shutter-btn {
    margin-bottom: 0px !important; 
  }

/* 🎯 特地針對相機留言頁面的按鈕縮小高度 */
  .camera-card.has-photo .btn {
    padding-top: 10px !important;    /* 🚀 關鍵：將上下內距從 15px 縮小到 10px，按鈕會明顯變扁 */
    padding-bottom: 10px !important;
    margin-top: 10px !important;     /* 🚀 縮小按鈕與按鈕之間的上下間距（原本是 15px） */
    font-size: 15px !important;      /* 稍微微調字體（原本 16px），讓扁平按鈕的字體比例更精緻 */
  }

}

/* ===================================================
   🖥️ 專屬大螢幕 (大於 741px) 的相機介面高低微調
   =================================================== */
@media screen and (min-height: 741px) {
  
  /* 🌟 1. 調整大螢幕「取消按鈕 (叉叉)」的上下位置 */
  .native-cancel-btn-top {
    top: 25px !important;    /* 🔼 預設是 25px。數值越大越往「下」移動，數值越小越往「上」提 */
  }

  /* 🌟 2. 調整大螢幕「快門鍵」的上下位置 */
  .shutter-btn {
    margin-bottom: 90px !important; /* 🔼 預設是 80px。數值越大，快門鍵越往「上」抬；數值越小，快門鍵越往「下」降 */
  }
}

/* ===================================================
   🛠️ iOS 截圖修復：下載卡片時的專屬安定狀態
   =================================================== */
/* 1. 截圖瞬間拔除捲動條並展開全高，防止 iOS 只截到一半 */
.result-card.is-downloading {
  max-height: none !important;
  overflow: visible !important;
}

/* 2. 截圖瞬間關閉會讓 iOS Safari 算錯尺寸、導致精靈巨大化的動畫與陰影 */
.result-card.is-downloading .spirit-image {
  animation: none !important;
  transform: none !important;
  filter: none !important; 
}

</style>

