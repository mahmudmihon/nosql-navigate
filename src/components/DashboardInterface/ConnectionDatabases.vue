<template>
  <div class="flex flex-col bg-base p-3 h-screen w-80">
    <GenericSkeletonVue v-if="dataLoading" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { invoke } from '@tauri-apps/api';
  import GenericSkeletonVue from '../Common/GenericSkeleton.vue';

  let dataLoading = ref(true);

  invoke('get_dbs_with_collections').then(value => {
    if(value !== 'error') {
      dataLoading.value = false;
    }    
  });
</script>
