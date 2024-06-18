<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from './stores/app';

const appStore = useAppStore()
const { getUser } = appStore

onMounted(async () => {
  await getUser()
})
</script>

<template>
  <div style="color: #fff;">
    {{ 'HEY' }}
  </div>
</template>

<style>
body {
  background: #303030;
}
</style>
