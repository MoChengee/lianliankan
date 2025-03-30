<template>
    <div>
      <h1>休闲模式</h1>
      <button @click="$router.push('/')">返回主页</button>
    </div>
</template>
<script setup>
  import { onMounted } from 'vue';

  onMounted(() => {
    document.title = "欢乐连连看--休闲模式";
  });
</script>