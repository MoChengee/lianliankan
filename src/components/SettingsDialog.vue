
<template>
    <div class="settings-dialog" v-if="visible">
      <div class="dialog-content">
        <h3>游戏设置</h3>
        <div class="volume-control">
          <label>音效音量：</label>
          <input type="range" v-model="soundVolume" min="0" max="1" step="0.1">
          <span>{{ Math.round(soundVolume * 100) }}%</span>
        </div>
        <div class="volume-control">
          <label>语音音量：</label>
          <input type="range" v-model="voiceVolume" min="0" max="1" step="0.1">
          <span>{{ Math.round(voiceVolume * 100) }}%</span>
        </div>
        <button @click="close">关闭</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { setSoundVolume, setVoiceVolume } from '../utils/gameLogic.js';
  
  const props = defineProps(['visible']);
  const emit = defineEmits(['close']);
  
  const soundVolume = ref(1.0);
  const voiceVolume = ref(1.0);
  
  watch(soundVolume, (val) => setSoundVolume(val));
  watch(voiceVolume, (val) => setVoiceVolume(val));
  
  const close = () => {
    localStorage.setItem('soundVolume', soundVolume.value);
    localStorage.setItem('voiceVolume', voiceVolume.value);
    emit('close');
  };
  
  // 初始化从本地存储加载
  const loadSettings = () => {
    const savedSound = localStorage.getItem('soundVolume');
    const savedVoice = localStorage.getItem('voiceVolume');
    if(savedSound) soundVolume.value = parseFloat(savedSound);
    if(savedVoice) voiceVolume.value = parseFloat(savedVoice);
  };
  
  loadSettings();
  </script>
  
  <style scoped>
  .settings-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.dialog-content {
  background: rgba(255,255,255,0.95);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
  width: 300px;
}

.volume-control {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.volume-control label {
  flex-shrink: 0;
  width: 80px;
  color: #385662;
}

.volume-control input[type="range"] {
  flex-grow: 1;
  height: 5px;
  background: #ddd;
  border-radius: 3px;
  outline: none;
}

.volume-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #385662;
  border-radius: 50%;
  cursor: pointer;
}

.dialog-content button {
  width: 100%;
  margin-top: 1rem;
  padding: 0.8rem;
}
  </style>