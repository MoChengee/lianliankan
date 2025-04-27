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
    @click="handleHint"
    :disabled="!isRunning || isPaused || (props.mode === 'basic' && hintCooldown.value)"
  >
    提示
    <span v-if="props.mode === 'basic' && hintCooldown.value">（冷却中）</span>
  </button>
  
  <button 
    id="IDC_BTN_RESET" 
    @click="handleShuffle"
    :disabled="!isRunning || isPaused || (props.mode === 'basic' && shuffleCooldown.value)"
  >
    重排
    <span v-if="props.mode === 'basic' && shuffleCooldown.value">（冷却中）</span>
  </button>

      <button 
      id="IDC_BTN_SETTINGS"
      @click="showSettings"
      :disabled="!isRunning"
      >设置</button>
      <SettingsDialog :visible="showSettingsDialog" @close="showSettingsDialog = false" />
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
import { ref, reactive,onUnmounted,onMounted } from 'vue';
import GameBoard from '../components/GameBoard.vue';
import Timer from '../components/Timer.vue';
import clickSound from '../assets/audio/click.wav';
import SettingsDialog from '../components/SettingsDialog.vue';
import {
  generateMap,
  removeTiles,
  shuffleTiles,
  playSound,
  checkStraightLine,
  checkOneCorner,
  checkTwoCorners,
  isGameCleared,
} from '../utils/gameLogic.js';
import Controls from '../components/SettingsDialog.vue';

// 接收从父组件传递的参数
const props = defineProps({
  rows: Number,
  cols: Number,
  types: Number,
  timerMode: String,
  initialTime: Number,
  mode: String,
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

// 添加音量状态
const soundVolume = ref(1.0);
const showSettingsDialog = ref(false);

// 从本地存储加载设置
onMounted(() => {
  const savedVolume = localStorage.getItem('soundVolume');
  if (savedVolume) {
    soundVolume.value = parseFloat(savedVolume);
  }
});

// 修改后的设置功能
const showSettings = () => {
  showSettingsDialog.value = true;
};

// 关闭设置时保存到本地存储
const closeSettings = () => {
  localStorage.setItem('soundVolume', soundVolume.value);
  showSettingsDialog.value = false;
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

  playSound(clickSound);

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
      // 判断是否所有方块都被清空
      if (isGameCleared(gameMap)) {
        setTimeout(() => {
          alert('恭喜你，游戏通关！'); // 弹出提示
          resetGame(); // 重置游戏或跳转到主页
        }, 100);
      }
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

const shuffleCooldown = ref(false); // 重排冷却状态
const hintCooldown = ref(false); // 提示冷却状态
const handleShuffle = () => {
  if (props.mode === 'basic' && shuffleCooldown.value) {
    alert('重排功能正在冷却，请稍后再试！');
    return;
  }

  shuffleTiles(gameMap);

  if (props.mode === 'basic') {
    shuffleCooldown.value = true;
    setTimeout(() => {
      shuffleCooldown.value = false;
    }, 30000); // 30秒冷却时间
  }
};
const handleHint = () => {
  if (props.mode === 'basic' && hintCooldown.value) {
    alert('提示功能正在冷却，请稍后再试！');
    return;
  }

  handleShowHint();

  if (props.mode === 'basic') {
    hintCooldown.value = true;
    setTimeout(() => {
      hintCooldown.value = false;
    }, 10000); // 10秒冷却时间
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