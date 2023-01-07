<template>
  <div class="flex flex-1_1_100% flex-nowrap">
    <DatabasesNavigationVue />
    <div class="p-3 w-full overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
  import DatabasesNavigationVue from '../DatabasesNavigation/DatabasesNavigation.vue';
</script>
