
<template>
  <div class="timer">
    <div class="timer-content">
      <span>{{ props.mode === 'up' ? '已用时间' : '剩余时间' }}</span>
      <strong>{{ formattedTime }}</strong>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  time: Number,
  mode: String, // 'up' 或 'down'
  initialTime: Number
});

const formattedTime = computed(() => {
  const currentTime =props.time;
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});
</script>
  
<style>
.timer {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #FF9999, #00CCAA);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 18px;
  color: #fff;
  margin-top: 20px;
  margin-right: 20px;
}

.timer-content {
  text-align: center;
}

.timer-content span {
  font-size: 14px;
  display: block;
}

.timer-content strong {
  font-size: 24px;
  font-weight: bold;
}
</style>
