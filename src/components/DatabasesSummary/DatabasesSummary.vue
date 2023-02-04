<template>
  <div class="flex flex-col h-screen w-full" v-if="dataLoading">
    <GenericSkeletonVue />
  </div>

  <div v-else class="flex flex-wrap content-start gap-4">
    <div v-for="dbStats in dbStatsData" class="bg-base rounded-3xl pl-5 pt-3 pb-3 w-64 self-start">
      <p class="text-green-200 text-xl mt-1 text-ellipsis">{{dbStats.db}}</p>
      <p class="text-sm mt-5 text-ellipsis">Collections: {{dbStats.collections}}</p>
      <p class="text-sm mt-2 text-ellipsis">Documents: {{dbStats.objects}}</p>
      <p class="text-sm mt-2 text-ellipsis">Indexes: {{dbStats.indexes}}</p>
      <p class="text-sm mt-2 text-ellipsis">Views: {{dbStats.views}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { invoke } from '@tauri-apps/api';
  import { DbsSummaryViewModel } from './Models/ViewModels';
  import { useRefreshEventsStore } from '../../stores/refresh-events';
  import GenericSkeletonVue from '../Common/GenericSkeleton.vue';

  let dataLoading = ref(true);
  let dbStatsData: DbsSummaryViewModel[] = [];
  
  const refreshEventsStore = useRefreshEventsStore();

  const getDbSummary = () => {
    invoke('dbs_with_stats').then(value => {
      if(value !== 'error') {
        dbStatsData = value as DbsSummaryViewModel[];
        dataLoading.value = false;
      }
    });
  }

  getDbSummary();

  refreshEventsStore.$subscribe((mutation, state) => {
    if(state.refreshDbSummary) {
      getDbSummary();

      refreshEventsStore.updateRefreshDbSummary(false);
    }
  });
</script>
