<template>
  <div class="flex flex-nowrap">
    <DatabasesNavigation />
    <div class="p-3 w-full h-screen overflow-y-hidden overflow-x-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
  import DatabasesNavigation from '../DatabasesNavigation/DatabasesNavigation.vue';
</script>
