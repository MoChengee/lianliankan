<template>
  <router-view />
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
if (window.performance.navigation.type === 1) {
  router.push('/'); // 页面刷新时跳转到主页
}
</script>

<style>
</style>
