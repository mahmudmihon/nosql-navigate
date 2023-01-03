<template>
  <div class="flex flex-auto flex-nowrap">
    <ConnectionDatabasesVue />
    <router-view />
  </div>
</template>

<script setup lang="ts">
  import ConnectionDatabasesVue from './ConnectionDatabases.vue';
</script>
