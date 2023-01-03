<template>
  <div class="flex flex-col p-3 h-screen w-full">
    <GenericSkeletonVue v-if="dataLoading" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { invoke } from '@tauri-apps/api';
  import GenericSkeletonVue from '../Common/GenericSkeleton.vue';

  let dataLoading = ref(true);

  // invoke('get_dbs_with_collections').then(value => {
  //   if(value !== 'error') {
  //     dataLoading.value = false;
  //   }    
  // });
</script>
