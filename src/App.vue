<template>
  <Toast position="top-right" />
  <router-view />
  <!-- <ConnectionInterfaceVue /> -->
</template>

<script setup lang="ts">
  import Toast from 'primevue/toast';
  import ConnectionInterfaceVue from './components/ConnectionInterface/ConnectionInterface.vue';
</script>
