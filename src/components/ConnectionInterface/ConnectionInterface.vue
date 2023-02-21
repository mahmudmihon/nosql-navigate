<template>
  <div class="flex flex-auto flex-nowrap">
    <SavedConnections />    
    <NewConnection />
  </div>
</template>

<script setup lang="ts">
  import SavedConnections from '../SavedConnections/SavedConnections.vue';
  import NewConnection from '../NewConnection/NewConnection.vue';
</script>
