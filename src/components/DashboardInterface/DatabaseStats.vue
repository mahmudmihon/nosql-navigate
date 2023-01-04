<template>
  <div class="flex flex-col p-3 h-screen w-full" v-if="dataLoading">
    <GenericSkeletonVue />
  </div>

  <div class="flex p-3 w-full h-screen g-4">
    <div v-for="dbStats in dbStatsData">
      <div class="bg-base rounded-lg p-3 g-4">
        <p class="text-green-200 text-xl">{{dbStats.db}}</p>
        <p class="text-sm">Collections: {{dbStats.collections}}</p>
        <p class="text-sm">Documents: {{dbStats.objects}}</p>
        <p class="text-sm">Indexes: {{dbStats.indexes}}</p>
        <p class="text-sm">Views: {{dbStats.views}}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { invoke } from '@tauri-apps/api';
  import { DbStatsViewModel } from './models/DbStatsModel';
  import GenericSkeletonVue from '../Common/GenericSkeleton.vue';

  let dataLoading = ref(true);
  let dbStatsData: DbStatsViewModel[] = [];

  invoke('dbs_with_stats').then(value => {
    if(value !== 'error') {
      dbStatsData = value as DbStatsViewModel[];
      dataLoading.value = false;
    }
  });
</script>
