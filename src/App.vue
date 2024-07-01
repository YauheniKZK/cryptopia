<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from './stores/app';

const appStore = useAppStore()
const { getUser, actionCreateUser } = appStore

onMounted(async () => {
  await actionCreateUser()
  await getUser()
})
</script>

<template>
  <div style="color: #fff;">
    <div>
      <span>{{ 'Hey friends. How are you&' }}</span>
    </div>
  </div>
</template>

<style>
body {
  background: #303030;
}
</style>
