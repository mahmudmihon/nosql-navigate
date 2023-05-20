<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <n-global-style />
      <n-notification-provider placement="bottom-right">
        <router-view />
      </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
  import { NNotificationProvider, NGlobalStyle, NConfigProvider, darkTheme, GlobalThemeOverrides } from 'naive-ui';

  const themeOverrides: GlobalThemeOverrides = {
    common: {
      fontFamily: 'Poppins',
      fontWeight: '350'
    },
    Input: {
      borderRadius: '5px'
    }
  }

  document.addEventListener('contextmenu', (e) => { e.preventDefault() });
</script>
