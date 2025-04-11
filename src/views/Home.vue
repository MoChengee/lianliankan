<template>
  <div class="hero">
    <div class="static-rectangle"></div>
    <div class="trapezoid">
      <div class="content">
        <!-- <h1>你好，欢迎来到欢乐连连看</h1> -->
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
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  document.title = "欢乐连连看";
});

const showHelp = () => alert("游戏规则：找到相同的图案并消除它们！");
const showSettings = () => alert("设置功能未实现😆");
</script>

<style>
.hero {
  height: 100vh;
  width: 100vw;
  background-image: url('https://bestdori.com/assets/en/characters/resourceset/res007059_rip/card_normal.png');
  background-size: cover;
  background-position: right 0px top -70px ;
  background-size: 85%;
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
  width: 20%; /* 静态矩形宽度 */
  height: 100%;
  background: rgba(217, 228, 225, 0.9); /* 与梯形背景一致 */
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
