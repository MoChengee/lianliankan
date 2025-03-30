<template>
  <router-view />
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
if (window.performance.navigation.type === 1) {
  router.push('/'); // 强制回到主页
}
</script>

<style>
</style>
