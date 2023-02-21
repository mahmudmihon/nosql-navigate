<template>
  <div class="flex flex-1_1_100% flex-nowrap">
    <DatabasesNavigation />
    <div class="p-3 w-full overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
  import DatabasesNavigation from '../DatabasesNavigation/DatabasesNavigation.vue';
</script>
