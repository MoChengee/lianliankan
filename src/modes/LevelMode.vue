<template>
  <div class="container">
    <!-- <h1>关卡模式</h1> -->
    <button class="back-btn" @click="$router.push('/')">← 返回主页</button>
    
    <div v-if="!currentDifficulty" class="difficulty-buttons">
      <button @click="startLevel('easy')">简单模式</button>
      <button @click="startLevel('normal')">普通模式</button>
      <button @click="startLevel('hard')">困难模式</button>
      <button @click="startLevel('expert')">专家模式</button>
      <button @click="startLevel('special')">特殊模式</button>
    </div>
    <div v-else class="game-area">
      <Game 
        :rows="currentDifficulty.rows" 
        :cols="currentDifficulty.cols" 
        :types="currentDifficulty.types" 
        :timerMode="'down'" 
        :initialTime="currentDifficulty.time" 
      />
      <button @click="resetLevel">重新开始</button>
      <button @click="returnToMenu">返回主页</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Game from '../views/Game.vue'; // 引入游戏主组件

// 难度配置
const difficultySettings = {
  easy: { rows: 6, cols: 6,types: 8, time: 10 },
  normal: { rows: 10, cols: 10,types: 12, time: 120 },
  hard: { rows: 12, cols: 12,types: 16, time: 90 },
  expert: { rows: 15, cols: 20,types: 30, time: 60 },
  special: { rows: 10, cols: 10,types: 8,time: 120 }, 
};

// 当前难度
const currentDifficulty = ref(null);

// 开始关卡
const startLevel = (difficulty) => {
  currentDifficulty.value = difficultySettings[difficulty];
};

// 重置关卡
const resetLevel = () => {
  if (currentDifficulty.value) {
    startLevel(currentDifficulty.value);
  }
};

// 返回主页
const returnToMenu = () => {
  currentDifficulty.value = null;
  $router.push('/');
};
</script>

<style>
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('https://bestdori.com/assets/en/characters/resourceset/res007059_rip/card_after_training.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 0;
  text-align: center;
  color: white;
}

.difficulty-buttons button {
  background-color: rgba(255, 255, 255, 0.65);
  height: 300px;
  width: 200px;
  flex: none;
  border-radius: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.difficulty-buttons button:hover {
  height: 300px; 
  width: 250px; 
  background-color: rgba(184, 184, 184,0.8);
}

/* .difficulty-buttons button:hover:nth-child(1) {
  background-color: rgba(33, 150, 243, 0.8); 
}
.difficulty-buttons button:hover:nth-child(2) {
  background-color: rgba(76, 175, 80, 0.8); 
.difficulty-buttons button:hover:nth-child(3) {
  background-color: rgba(255, 235, 59, 0.8); 
}
.difficulty-buttons button:hover:nth-child(4) {
  background-color: rgba(244, 67, 54, 0.8); 
}
.difficulty-buttons button:hover:nth-child(5) {
  background-color: rgba(156, 39, 176, 0.8); 
} */

.difficulty-buttons{
  height: 100%;
  width: 100%;
  display: flex;
  gap: 50px;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.game-area {
  margin-top: 20px;
}

.game-area button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.back-btn {
  position: absolute;
  left: 20px;
  top: 20px;
  padding: 4px 6px; /* 缩小内边距 */
  font-size: 14px; /* 缩小字体 */
  width: 100px; /* 缩小宽度 */
  height: 20px !important; /* 缩小高度 */
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 100;
}

.back-btn:hover {
  background: #45a049;
}

</style>