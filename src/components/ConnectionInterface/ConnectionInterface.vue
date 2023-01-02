<template>
  <div class="flex flex-auto flex-nowrap">
    <SavedConnectionsVue />    
    <NewConnectionVue />
  </div>
</template>

<script setup lang="ts">
  import SavedConnectionsVue from './SavedConnections.vue';
  import NewConnectionVue from './NewConnection.vue';
</script>
