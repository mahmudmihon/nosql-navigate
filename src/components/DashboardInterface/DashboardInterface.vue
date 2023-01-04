<template>
  <div class="flex flex-1_1_100% flex-nowrap">
    <ConnectionDatabasesVue />
    <router-view />
  </div>
</template>

<script setup lang="ts">
  import ConnectionDatabasesVue from './ConnectionDatabases.vue';
</script>
