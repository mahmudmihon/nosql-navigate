<template>
  <div class="flex flex-col h-screen w-full" v-if="dataLoading">
    <GenericSkeleton />
  </div>

  <div v-else class="flex flex-wrap content-start gap-4">
    <div v-for="dbStats in componentData.dbStatsData" class="bg-base rounded-3xl pl-5 pt-3 pb-3 w-64 self-start">
      <p class="text-green-200 text-xl mt-1 overflow-hidden w-56 text-ellipsis">{{dbStats.db}}</p>
      <p class="text-sm mt-5 overflow-hidden w-56 text-ellipsis">Collections: {{dbStats.collections}}</p>
      <p class="text-sm mt-2 overflow-hidden w-56 text-ellipsis">Documents: {{dbStats.objects}}</p>
      <p class="text-sm mt-2 overflow-hidden w-56 text-ellipsis">Indexes: {{dbStats.indexes}}</p>
      <p class="text-sm mt-2 overflow-hidden w-56 text-ellipsis">Views: {{dbStats.views}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { invoke } from '@tauri-apps/api';
  import { ComponentDataModel, DbsSummaryViewModel } from './Models/ViewModels';
  import { useRefreshEventsStore } from '../../stores/refresh-events';
  import GenericSkeleton from '../Common/GenericSkeleton.vue';

  let dataLoading = ref(true);
  let componentData: ComponentDataModel = reactive<ComponentDataModel>({dbStatsData: []});
  
  const refreshEventsStore = useRefreshEventsStore();

  const getDbSummary = () => {
    invoke('dbs_with_stats').then(value => {
      if(value !== 'error') {
        componentData.dbStatsData = value as DbsSummaryViewModel[];
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
