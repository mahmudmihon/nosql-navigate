<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="{ common: { fontFamily: 'Poppins', fontWeight: '350' } }">
    <n-global-style />
      <n-notification-provider placement="bottom-right">
        <router-view />
      </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NNotificationProvider, NGlobalStyle, NConfigProvider, darkTheme } from 'naive-ui';
</script>
