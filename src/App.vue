<template>


  
  <div id="app" class="container">
    
    <link rel="preload" href="/chamei_shake.mp4" as="video" type="video/mp4">

    <button v-if="step !== 'start-page'" @click="toggleMute" class="btn-mute">
      {{ isMuted ? '🔇' : '🔊' }}
    </button>
    
    

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
          <p>探尋你的內心深處，找到你專屬的微醺精靈!</p>
          <button @click="handleOpenAgeModal" class="btn btn-start-game" :class="{ 'skip-intro': hasWatchedIntro }">
            開始測驗
          </button>
        </div>
      </div>
      
      <div v-else-if="step === 'quiz'" :key="'quiz'" style="width: 100%; position: relative;">
        
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
        </div>
      </div>

      <div v-else-if="step === 'loading'" :key="'loading'" class="card loading-card">
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
      
      <div v-else-if="step === 'result'" :key="'result'" class="card result-card" ref="resultCardRef" style="position: relative;">
        <img :src="logo" alt="CHAME CHILL" class="brand-logo-result-left">
        <p class="result-pre">你的微醺精靈是</p>
        <h2 class="result-title">{{ resultData.title }}</h2>
        
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

        <button v-if="!isGenerating" @click="openCamera" class="btn btn-share" style="background-color: #c57900;">
          和我的微醺精靈拍張照
        </button>

        <button v-if="!isGenerating" @click="handleGoToStore" class="btn">
          <img :src="giftIcon" alt="禮物" class="btn-icon">
          把我的微醺精靈帶回家
        </button>
      </div>

<div v-else-if="step === 'camera'" :key="'camera'" class="card camera-card">
        <h2 class="main-title" style="margin-top:0;">微醺拍貼機</h2>
        <div class="camera-wrapper">
          <video ref="videoRef" autoplay playsinline class="camera-preview"></video>
          <img :src="resultData.frame" class="camera-frame" crossorigin="anonymous" />
        </div>
        
        <div style="margin-top: 20px;">
          <button @click="takePhoto" class="btn">喀嚓！存入手機相簿</button>
          <button @click="closeCamera" class="btn btn-outline">返回結果</button>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import html2canvas from 'html2canvas'

// 1. 匯入所有資源
import coverImageFile from './assets/cover.webp'
import img1 from './assets/result_1.webp'
import img2 from './assets/result_2.webp'
import img3 from './assets/result_3.webp'
import img4 from './assets/result_4.webp'
import img5 from './assets/result_5.webp'

import downloadIcon from './assets/icon-download.png'
import shareIcon from './assets/icon-share.png'
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
  if (s <= 10) return { title: "穿山甲精靈", image: img1, frame: frame1, desc: "你極度需要合法擺爛！面對高壓的世界，只想把自己捲成一顆球，把吵鬧都擋在外面。對你來說，最好的放鬆就是切斷與世界的連結。", guide: "來一杯「熷茶梅酒」，讓溫潤的底蘊陪伴你合法擺爛!" }
  if (s <= 14) return { title: "白面鼯鼠精靈", image: img2, frame: frame2, desc: "你極度渴望 Me Time！你喜歡在自己的空間裡獨處，在深夜裡思緒像在山林間自由滑翔。微醺對你來說，是清空腦袋資訊垃圾、沉澱內心的必要儀式。", guide: "深夜的 Me Time，有「凍頂烏龍茶梅酒」的陪伴，讓思緒像在山林間自由滑翔! " }
  if (s <= 17) return { title: "白鼻心精靈", image: img3, frame: frame3, desc: "你能在高壓中尋求踏實成就感！你認命且負責，總是能把任務進度條推到 100%。你最享受的，就是完成艱難任務後，慵懶趴在桌上體會的那份微小而扎實的成就感。", guide: "達成任務最需要慶祝，用「蜜香紅烏龍茶梅酒」犒賞剛完成進度條的自己吧! " }
  if (s <= 21) return { title: "石虎精靈", image: img4, frame: frame4, desc: "你具備極高的審美自信！你不想在人群中顯得平庸，透過質感小物能讓你找回對生活的驕傲與自信。", guide: "審美與質感，是你的生活驕傲，如同「東方美人茶梅酒」的芬芳，優雅而不流俗。" }
  return { title: "台灣藍鵲精靈", image: img5, frame: frame5, desc: "你極度需要群居歸屬感，而且超級悶騷！表面可能裝作淡定，內心很需要他人的陪伴與認同，微醺是你轉開真心話的鑰匙。", guide: "「玉香綠茶梅酒」是幫你轉開真心話的最佳幫手!" }
})

const videoRef = ref(null)
const isCameraActive = ref(false)

// 6. 結果圖下載

const resultCardRef = ref(null)
const isGenerating = ref(false)

const handleDownloadCard = async () => {
  playClickSound();
  if (!resultCardRef.value) return;

  // 1. 魔法開始：先把按鈕藏起來
  isGenerating.value = true; 
  
  // 2. 【關鍵修正】放棄 nextTick，改用 setTimeout 強制等瀏覽器 0.15 秒
  // 讓瀏覽器有絕對充足的時間把按鈕從畫面上清空，再按下快門！
  await new Promise(resolve => setTimeout(resolve, 150)); 

  try {
    const canvas = await html2canvas(resultCardRef.value, {
      scale: 4, // 🌟 倍率直接拉到 4，保證在手機上看也跟視網膜螢幕一樣銳利
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    // 3. 【關鍵修正】捨棄 JPG 壓縮，改存成無損的 PNG 格式
    const imgData = canvas.toDataURL('image/png'); 

    const link = document.createElement('a');
    link.download = `我的微醺精靈_${resultData.value.title}.png`; // 這裡也改成 .png
    link.href = imgData;
    link.click();
    
  } catch (error) {
    console.error("生成圖片失敗:", error);
    alert("圖片生成失敗，請稍後再試！");
  } finally {
    // 4. 魔法結束：不管成功或失敗，截圖完馬上把按鈕變回來
    isGenerating.value = false; 
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

// ==========================================
// 8. 拍立得 (相機與合成邏輯)
// ==========================================

// 📸 開啟相機
const openCamera = async () => {
  playClickSound();
  step.value = 'camera'; // 切換到相機頁面
  
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
    nextTick(() => {
      if (videoRef.value) {
        videoRef.value.srcObject = stream;
      }
    });
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

// 📸 拍照與合成下載
const takePhoto = () => {
  playClickSound();
  const video = videoRef.value;
  if (!video) return;

  // 建立虛擬畫布，大小與相機實際抓到的解析度相同
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');

  // ⚠️ 鏡像魔法 1：因為前鏡頭預覽是反的 (像照鏡子)，畫到 canvas 時必須水平翻轉
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // ⚠️ 鏡像魔法 2：把畫布矩陣翻轉回來！否則接下來畫上去的相框文字也會變成左右顛倒
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // 載入對應結果的相框，並蓋在人物上方
  const frameImg = new Image();
  // 加上 crossorigin 設定，避免某些瀏覽器在繪製外部圖片時產生跨網域 (CORS) 污染錯誤
  frameImg.crossOrigin = "anonymous";
  frameImg.src = resultData.value.frame; // 抓取當前結果對應的相框圖片
  
  frameImg.onload = () => {
    // 將透明相框畫滿整個畫布
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

    // 觸發圖片下載 (手機上會提示儲存至照片或檔案)
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `微醺拍貼_${resultData.value.title}.png`;
    link.href = imgData;
    link.click();
  };
}

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

.btn-mute { position: absolute; top: 20px; right: 20px; background: rgba(255, 255, 255, 0.8); border: 1px solid #8b4513; color: #8b4513; padding: 8px 12px; border-radius: 20px; font-size: 14px; cursor: pointer; z-index: 10; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }

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
  top: 20px;              /* 距離螢幕最上方 20px */
  left: 50%;
  transform: translateX(-50%);
  width: 90px;            /* 設定你喜歡的大小 */
  height: auto;
  z-index: 100;           /* 確保在最上層 */
  pointer-events: none;
}

/* 確保卡片內容不會被 Logo 擋住 */
.quiz-page-card {
  margin-top: 80px !important; /* 騰出空間給上面的 Logo */
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
  aspect-ratio: 3 / 4; /* 🌟 這是關鍵：強制鎖定成類似 IG 限動或拍立得的直式比例 */
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
  object-fit: cover;    /* 確保相框圖檔也能完美貼合容器大小 */
  pointer-events: none; /* 讓使用者的點擊能穿透相框，避免干擾底層的互動 */
  z-index: 10;          /* 確保相框疊在攝影機畫面 (video) 的上方 */
}

</style>