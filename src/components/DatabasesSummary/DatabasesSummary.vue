<template>
  <div class="flex flex-col h-screen w-full" v-if="componentState.dataLoading">
    <GenericSkeleton />
  </div>

  <div v-else class="flex flex-wrap content-start gap-4 max-h-[calc(100vh-25px)] overflow-y-auto">
    <div v-for="dbStats in componentState.dbStatsData" class="bg-base rounded-3xl pl-5 pt-3 pb-3 w-64 self-start flex-auto">
      <p class="text-green-200 text-xl mt-1 overflow-hidden w-56 text-ellipsis">{{dbStats.db}}</p>
      <p class="text-sm mt-5 overflow-hidden w-56 text-ellipsis">Collections: {{dbStats.collections}}</p>
      <p class="text-sm mt-2 overflow-hidden w-56 text-ellipsis">Documents: {{dbStats.objects}}</p>
      <p class="text-sm mt-2 overflow-hidden w-56 text-ellipsis">Indexes: {{dbStats.indexes}}</p>
      <p class="text-sm mt-2 overflow-hidden w-56 text-ellipsis">Views: {{dbStats.views}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { ComponentStateModel } from './Models/ViewModels';
  import { useRefreshEventsStore } from '../../stores/refresh-events'; 
  import { MongoDbService } from '../../services/data/mongo-service';
  import GenericSkeleton from '../Common/GenericSkeleton.vue';

  const refreshEventsStore = useRefreshEventsStore();

  const componentState: ComponentStateModel = reactive({
    dbStatsData: [], 
    dataLoading: true
  });
  
  const getDbSummary = async () => {

    const result = await MongoDbService.getDbsStats();

    if(typeof result !== "string") {
      componentState.dbStatsData = result;
      componentState.dataLoading = false;
    }
  }

  getDbSummary();

  refreshEventsStore.$subscribe((mutation, state) => {
    if(state.refreshDbSummary) {
      getDbSummary();

      refreshEventsStore.updateRefreshDbSummary(false);
    }
  });
</script>
