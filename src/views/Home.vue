<template>
  <div class="hero" :style="{ backgroundImage: `url(${selectedBackground})` }">
    <div class="static-rectangle"></div>
    <div class="trapezoid">
      <div class="content">
        <h3 style="color: #385662;">请选择游戏模式开始：</h3>
        <div class="menu">
          <button @click="$router.push('/basic')">基本模式</button>
          <button @click="$router.push('/relax')">休闲模式</button>
          <button @click="$router.push('/level')">关卡模式</button>
          <button @click="showHelp">帮助</button>
          <button @click="showSettings">设置</button>
        </div>
      </div>
    </div>
    <SettingsDialog :visible="showSettingsDialog" @close="showSettingsDialog = false" />
  </div>

</template>

<script setup>
import { ref,onMounted } from 'vue';
import SettingsDialog from '../components/SettingsDialog.vue';
onMounted(() => {
  document.title = "欢乐连连看";
});

const showHelp = () => alert("游戏规则：找到相同的图案并消除它们！");

// 添加响应式变量
const showSettingsDialog = ref(false);
const soundVolume = ref(1.0);  // 默认100%音量
const voiceVolume = ref(1.0);

// 从localStorage加载保存的设置
onMounted(() => {
  const savedSound = localStorage.getItem('soundVolume');
  const savedVoice = localStorage.getItem('voiceVolume');
  if(savedSound) soundVolume.value = parseFloat(savedSound);
  if(savedVoice) voiceVolume.value = parseFloat(savedVoice);
});

const showSettings = () => {
  showSettingsDialog.value = true;
};

const closeSettings = () => {
  localStorage.setItem('soundVolume', soundVolume.value);
  localStorage.setItem('voiceVolume', voiceVolume.value);
  showSettingsDialog.value = false;
};
// 定义背景图数组
const backgroundImages = [
  'https://bestdori.com/assets/jp/characters/resourceset/res007070_rip/card_after_training.png',
  'https://bestdori.com/assets/jp/characters/resourceset/res007073_rip/card_after_training.png',
  'https://bestdori.com/assets/jp/characters/resourceset/res007075_rip/card_after_training.png',
  'https://bestdori.com/assets/jp/characters/resourceset/res007072_rip/card_after_training.png',
  'https://bestdori.com/assets/jp/characters/resourceset/res007072_rip/card_normal.png',
  'https://bestdori.com/assets/en/characters/resourceset/res007068_rip/card_after_training.png',
  'https://bestdori.com/assets/en/characters/resourceset/res007067_rip/card_after_training.png',
  'https://bestdori.com/assets/en/characters/resourceset/res007059_rip/card_normal.png',
  'https://bestdori.com/assets/en/characters/resourceset/res007044_rip/card_after_training.png',





];
// 随机选择背景图
const selectedBackground = ref('');
onMounted(() => {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  selectedBackground.value = backgroundImages[randomIndex];
});
</script>

<style>
.hero {
  height: 100vh;
  width: 100vw;
  /* background-image: url("v-bind(selectedBackground)"); */
  background-size: cover;
  background-position: right 0px top -70px ;
  background-size: 70%;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: -1;
}
.static-rectangle {
  position: absolute;
  top: 0;
  left: 0;
  width: 30%; /* 静态矩形宽度 */
  height: 100%;
  background: #00CCAA; /* 与梯形背景一致 */
  z-index: 0; /* 确保在梯形下方 */
}
.trapezoid {
  position: absolute;
  top: 0;
  left: -70%;
  width: 50%;
  height: 100%;
  background: rgba(217, 228, 225,0.9);
  clip-path: polygon(0 0, 70% 0, 60% 100%, 0% 100%);
  animation: slideIn 1.2s ease forwards;
  display: flex;
  align-items: center;
  padding-left: 5vw;
}

@keyframes slideIn {
  to {
    left: 0;
  }
}

.content {
  color: white;
  max-width: 400px;
}

.menu {
  margin-top: 40px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  text-align: center;
}


button {
  width: 200px;
  appearance: none;
  background-color: rgba(247, 246, 246, 0.85);
  border: 0.125em solid #1A1A1A;
  border-radius: 0.9375em;
  box-sizing: border-box;
  color: #3B3B3B;
  cursor: pointer;
  display: inline-block;
  font-family: Roobert,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
  min-height: 3.75em;
  padding: 1em 2.3em;
  text-align: center;
  text-decoration: none;
  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  will-change: transform;
}

button:hover {
  color: #fff;
  background-color: #000000;
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
  transform: translateY(-2px);
}

button:active {
  box-shadow: none;
  transform: translateY(0);
}


</style>
