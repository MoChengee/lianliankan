// 判断位置是否为空
export const isPositionEmpty = (pos, gameMap, ROWS, COLS) => {
  if (pos.x < 0 || pos.x >= ROWS || pos.y < 0 || pos.y >= COLS) {
    return true; // 边界外视为可通行
  }

  const tile = gameMap[pos.x][pos.y];
  return tile.removed;
};

// 判断是否所有方块都被清空
export const isGameCleared = (gameMap) => {
  return gameMap.flat().every((tile) => tile.removed);
};

// 直线路径检查
export const checkStraightLine = (a, b, gameMap, ROWS, COLS) => {
    // 边界外框连接规则
    const isEdgeConnection = 
      (a.x === 0 && b.x === 0) || // 上外框
      (a.x === ROWS-1 && b.x === ROWS-1) || // 下外框
      (a.y === 0 && b.y === 0) || // 左外框
      (a.y === COLS-1 && b.y === COLS-1); // 右外框
  
    if (isEdgeConnection) return true;

  if (a.x === b.x) {
    const [start, end] = [Math.min(a.y, b.y), Math.max(a.y, b.y)];
    for (let y = start + 1; y < end; y++) {
      if (!isPositionEmpty({ x: a.x, y }, gameMap, ROWS, COLS)) return false;
    }
    return true;
  }

  if (a.y === b.y) {
    const [start, end] = [Math.min(a.x, b.x), Math.max(a.x, b.x)];
    for (let x = start + 1; x < end; x++) {
      if (!isPositionEmpty({ x, y: a.y }, gameMap, ROWS, COLS)) return false;
    }
    return true;
  }

  return false;
};

// 单折线检查
export const checkOneCorner = (a, b, gameMap, ROWS, COLS) => {
  const corner1 = { x: a.x, y: b.y };
  const corner2 = { x: b.x, y: a.y };
  return (
    (isPositionEmpty(corner1, gameMap, ROWS, COLS) &&
      checkStraightLine(a, corner1, gameMap, ROWS, COLS) &&
      checkStraightLine(corner1, b, gameMap, ROWS, COLS)) ||
    (isPositionEmpty(corner2, gameMap, ROWS, COLS) &&
      checkStraightLine(a, corner2, gameMap, ROWS, COLS) &&
      checkStraightLine(corner2, b, gameMap, ROWS, COLS))
  );
  
  return false;
};

// 双折线检查
export const checkTwoCorners = (a, b, gameMap, ROWS, COLS) => {
  for (let x = 0; x < ROWS; x++) {
    for (let y = 0; y < COLS; y++) {
      const mid = { x, y };
      if (
        isPositionEmpty(mid, gameMap, ROWS, COLS) &&
        checkOneCorner(a, mid, gameMap, ROWS, COLS) &&
        checkStraightLine(mid, b, gameMap, ROWS, COLS)
      ) {
        return true;
      }
    }
  }
  return false;
};

// 工具函数:随机打乱数组
export const shuffleArray = (arr) => {
  return arr.slice().sort(() => Math.random() - 0.5);
};

const gameConfig = {
  soundVolume: 1.0,  
  voiceVolume: 1.0   
};

export const setSoundVolume = (volume) => {
  gameConfig.soundVolume = Math.min(Math.max(volume, 0), 1);
};

export const setVoiceVolume = (volume) => {
  gameConfig.voiceVolume = Math.min(Math.max(volume, 0), 1);
};

export const playSound = (src, isVoice = false) => {
  const audio = new Audio(src);
  audio.volume = isVoice ? gameConfig.voiceVolume : gameConfig.soundVolume;
  audio.play();
};


// 生成游戏地图
export const generateMap = (rows, cols, types) => {
  const totalTiles = rows * cols;
  const pairs = totalTiles / 2;
  const tiles = [];

  // 生成成对的方块
  for (let i = 0; i < pairs; i++) {
    const type = i % types;
    tiles.push(type, type);
  }

  // 随机打乱
  return shuffleArray(tiles).reduce((acc, val, idx) => {
    if (idx % cols === 0) acc.push([]);
    acc[acc.length - 1].push({
      id: idx,
      type: val,
      x: Math.floor(idx / cols),
      y: idx % cols,
      removed: false,
    });
    return acc;
  }, []);
};

// 移除方块
export const removeTiles = (t1, t2) => {
  t1.removed = true;
  t2.removed = true;

  // 使用 import.meta.url 动态生成路径
  const soundPath = new URL(`../assets/audio/${t1.type}.mp3`, import.meta.url).href;

  playSound(soundPath, 0.3); // 播放音效，音量为 80%
};

// 重排功能
export const shuffleTiles = (gameMap) => {
  // 提取所有方块
  const allTiles = gameMap.flat();
  // 提取所有方块的类型（包括已移除的方块）
  const allTypes = allTiles.map((t) => t.removed ? null : t.type);
  // 随机打乱所有类型
  const shuffledTypes = shuffleArray(allTypes);
  let index = 0;
  // 遍历所有方块，重新分配类型和状态
  gameMap.forEach((row) => {
    row.forEach((tile) => {
      const newType = shuffledTypes[index++];
      if (newType === null) {
        // 如果类型为 null，表示该方块被移除
        tile.type = null;
        tile.removed = true;
      } else {
        // 否则，重新分配类型并设置为未移除
        tile.type = newType;
        tile.removed = false;
      }
    });
  });
};


