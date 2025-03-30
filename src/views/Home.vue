<template>
    <div class="home-container">
        <div class="menu">
            <button @click="$router.push('/basic')">基本模式</button>
            <button @click="$router.push('/relax')">休闲模式</button>
            <button @click="$router.push('/level')">关卡模式</button>
            <button @click="showHelp">帮助</button>
            <button @click="showSettings">设置</button>
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
  .menu {
    margin: 60px;
    width: 300px;
    display: flex;
    flex-direction: column;  /* 竖向排列 */
    gap: 40px;  /* 设置子元素之间的间距 */
    text-align: center;
  }
  
button {
 width: 200px;
 appearance: none;
 background-color: rgba(247, 246, 246, 0.75);
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
 min-width: 0;
 outline: none;
 padding: 1em 2.3em;
 text-align: center;
 text-decoration: none;
 transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
 user-select: none;
 -webkit-user-select: none;
 touch-action: manipulation;
 will-change: transform;
}

button:disabled {
 pointer-events: none;
}

button:hover {
 color: #fff;
 background-color: #000000;
 /* border: 0px; */
 box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
 transform: translateY(-2px);
}

button:active {
 box-shadow: none;
 transform: translateY(0);
}

  .home-container {
  position: fixed;  /* 让背景固定 */
  top: 0;
  left: 0;
  width: 100vw;  /* 让宽度填满整个视口 */
  height: 100vh; /* 让高度填满整个视口 */
  background-image: url('/src/assets/main_bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: -1; /* 让它在最底层，避免遮挡内容 */
  }
  </style>
  