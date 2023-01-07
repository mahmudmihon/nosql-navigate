<template>
  <n-notification-provider placement="bottom-right">
    <router-view />
  </n-notification-provider> 
</template>

<script setup lang="ts">
  import { NNotificationProvider } from 'naive-ui';
</script>
