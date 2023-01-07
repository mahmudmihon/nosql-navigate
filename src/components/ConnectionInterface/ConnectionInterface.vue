<template>
  <div class="flex flex-auto flex-nowrap">
    <SavedConnectionsVue />    
    <NewConnectionVue />
  </div>
</template>

<script setup lang="ts">
  import SavedConnectionsVue from '../SavedConnections/SavedConnections.vue';
  import NewConnectionVue from '../NewConnection/NewConnection.vue';
</script>
