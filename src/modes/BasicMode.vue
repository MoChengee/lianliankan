<template>
  <div class="container">
    <!-- <h1>基本模式</h1> -->
    <div class="basic-mode">
    <!-- 返回按钮 -->
    <button class="back-btn" @click="$router.push('/')">← 返回主页</button>
    
    <!-- 游戏主界面 -->
    <Game 
        :rows="10" 
        :cols="16" 
        :types="16" 
        :timerMode="'up'" 
        :initialTime="0" 
      />
  </div>
  </div>
  
</template>

<script setup>
import Game from '../views/Game.vue';  // 引入游戏主组件

// 设置页面标题
import { onMounted } from 'vue';
onMounted(() => {
  document.title = "欢乐连连看 - 基本模式";
});
</script>

<style scoped>
.basic-mode {
  position: relative;
  min-height: 100vh;
  /* background: #f0f0f0; */
  z-index: 1;
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

.container {
  position: fixed;  /* 让背景固定 */
  top: 0;
  left: 0;
  width: 100vw;  /* 让宽度填满整个视口 */
  height: 100vh; /* 让高度填满整个视口 */
  background-image: url('/src/assets/game_bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 0; /* 让它在最底层，避免遮挡内容 */
  }
</style>