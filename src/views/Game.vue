<template>
  <div class="game-container">
    <div class="controls">
      <button 
        id="IDC_BTN_START" 
        @click="startGame"
        :disabled="isRunning && !isPaused" 
      >{{ isRunning ? '重新开始' : '开始游戏' }}</button>
      
      <button 
        id="IDC_BTN_STOP" 
        @click="togglePause"
        :disabled="!isRunning"
      >{{ isPaused ? '继续游戏' : '暂停游戏' }}</button>
      
      <button 
        id="IDC_BTN_PROMPT" 
        @click="handleShowHint"
        :disabled="!isRunning || isPaused"
      >提示</button>
      
      <button 
        id="IDC_BTN_RESET" 
        @click="() => shuffleTiles(gameMap)"
        :disabled="!isRunning || isPaused"
      >重排</button>
    </div>

    <GameBoard 
      :tiles="gameMap" 
      :selected="selectedTiles"
      :hint-pair="hintPair"
      @tile-click="handleTileClick"
    />

    <Timer 
    :time="gameTime"
    :mode="props.timerMode"
    :initialTime="props.initialTime"
    />
  </div>
</template>

<script setup>
import { ref, reactive,onUnmounted } from 'vue';
import GameBoard from '../components/GameBoard.vue';
import Timer from '../components/Timer.vue';
import clickSound from '../assets/audio/click.wav';
import {
  generateMap,
  removeTiles,
  shuffleTiles,
  playSound,
  checkStraightLine,
  checkOneCorner,
  checkTwoCorners,
} from '../utils/gameLogic.js';

// 接收从父组件传递的参数
const props = defineProps({
  rows: Number,
  cols: Number,
  types: Number,
  timerMode: String,
  initialTime: Number,
});

// 游戏状态
const isRunning = ref(false);
const isPaused = ref(false);
let gameTimer = null;

// 游戏数据
const gameMap = reactive([]);
const selectedTiles = ref([]);
const hintPair = ref(null);

// 计时器
const gameTime = ref(props.timerMode === 'up' ? 0 : props.initialTime);

const startGame = () => {
  if (isRunning.value) {
    if (!window.confirm('确定要重新开始吗？当前进度将会丢失！')) return
    resetGame()
  }
  resetGame();
  console.log('Game started with:', props.rows, props.cols, props.types, props.initialTime);
  gameMap.splice(0, gameMap.length, ...generateMap(props.rows, props.cols, props.types));
  isRunning.value = true;
  isPaused.value = false;
  startTimer();
};

// 超时处理
const handleTimeout = () => {
  clearInterval(gameTimer);
  isRunning.value = false;
  alert('时间到！游戏结束！');
  updateLeaderboard();
};

// 重置游戏状态
const resetGame = () => {
  // 停止计时器
  clearInterval(gameTimer);
  gameTimer = null;
  
  // 重置所有状态
  gameTime.value = props.timerMode === 'up' ? 0 : props.initialTime;
  selectedTiles.value = [];
  hintPair.value = null;
  isRunning.value = false;
  isPaused.value = false;
  
  // 强制清空地图（可选）
  gameMap.splice(0, gameMap.length);
};



//TODO：排行榜
// 更新排行榜
const updateLeaderboard = () => {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  leaderboard.push(gameTime.value); // 将当前游戏时间加入排行榜
  leaderboard.sort((a, b) => a - b); // 按时间从小到大排序
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10))); // 只保留前10名
};
// 获取排行榜数据
const leaderboard = ref([]);
const loadLeaderboard = () => {
  leaderboard.value = JSON.parse(localStorage.getItem('leaderboard')) || [];
};



// 暂停/继续
const togglePause = () => {
  isPaused.value = !isPaused.value;
};

const pathPoints = ref([]); // 用于存储路径点
// 处理方块点击
const handleTileClick = (tile) => {
  if (!isRunning.value || isPaused.value || tile.removed) return;

  playSound(clickSound, 0.3);

  if (selectedTiles.value.length === 1 && selectedTiles.value[0].id === tile.id) {
    return;
  }

  selectedTiles.value.push(tile);

  if (selectedTiles.value.length === 2) {
    const [t1, t2] = selectedTiles.value;
    if (
      t1.type === t2.type &&
      (checkStraightLine(t1, t2, gameMap, props.rows, props.cols) ||
        checkOneCorner(t1, t2, gameMap, props.rows, props.cols) ||
        checkTwoCorners(t1, t2, gameMap, props.rows, props.cols))
    ) {
      removeTiles(t1, t2);
    }
    
    setTimeout(() => {
      selectedTiles.value = []; // 清空选中状态
    }, 100); // 延迟清空
  }
};

// 工具函数:开始计时器
const startTimer = () => {
  clearInterval(gameTimer);
  gameTimer = setInterval(() => {
    if (!isPaused.value|| !isRunning.value) // 如果游戏暂停或未开始，则不执行计时器
    {
      if (props.timerMode === 'up') {
        // 正计时
        gameTime.value++;
      } else if (props.timerMode === 'down') {
        // 倒计时
        if (gameTime.value > 0) {
          gameTime.value--;
        } else {
          handleTimeout(); // 时间到，触发超时处理
          clearInterval(gameTimer); 
        }
      }
    }
  }, 1000);
};
// 在组件销毁时清除计时器
onUnmounted(() => {
  clearInterval(gameTimer);
});
// 查找所有有效的配对
const findAllValidPairs = (gameMap, rows, cols) => {
  const pairs = [];
  const tiles = gameMap.flat().filter((t) => !t.removed);

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const t1 = tiles[i];
      const t2 = tiles[j];
      if (
        t1.type === t2.type &&
        (checkStraightLine(t1, t2, gameMap, rows, cols) ||
          checkOneCorner(t1, t2, gameMap, rows, cols) ||
          checkTwoCorners(t1, t2, gameMap, rows, cols))
      ) {
        pairs.push([t1, t2]);
      }
    }
  }

  return pairs;
};

// 提示功能
const handleShowHint = () => {
  const pairs = findAllValidPairs(gameMap, props.rows, props.cols);
  console.log('Valid pairs:', pairs);
  if (pairs.length > 0) {
    hintPair.value = pairs[0];
    setTimeout(() => (hintPair.value = null), 2000); // 高亮2秒
  }
}; 

</script>

<style>
.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box; 
}
.controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
  padding: 10px 100px;
}
</style>