<template>
  <div class="flex flex-col h-72 w-full" v-if="componentState.dataLoading">
    <GenericSkeleton />
  </div>

  <div v-else>
    <div v-if="componentState.importExportSummary.length > 0" class="flex max-h-[calc(100vh-170px)] overflow-y-auto flex-col w-full">
      <div v-for="(summary, index) in componentState.importExportSummary" :key="index" class="bg-base rounded-lg pl-5 pt-3 pb-3 my-2">
        <div class="flex pr-3 gap-2 w-full justify-end">
          <n-tag round type="info">
            {{summary.operation_type}}
          </n-tag>

          <n-tag v-if="summary.operation_status == 'completed'" round type="success">
            {{summary.operation_status}}
          </n-tag>

          <n-tag v-if="summary.operation_status == 'running'" round type="warning">
            {{summary.operation_status}}
          </n-tag>

          <n-tag v-if="summary.operation_status == 'failed'" round type="error">
            {{summary.operation_status}}
          </n-tag>
        </div>

        <p class="text-sm mt-3 overflow-hidden w-full text-ellipsis">Collection: {{summary.db_name}} &#8594; {{summary.collection_name}}</p>
        <p class="text-sm mt-2 overflow-hidden w-full text-ellipsis">Documents Count: {{summary.documents_count}}</p>
        <p class="text-sm mt-2 overflow-hidden w-full text-ellipsis">Path: {{summary.path}}</p>
      </div>
    </div>

    <div v-else class="flex w-full bg-base rounded-lg text-white py-8 justify-center text-xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 mr-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>

        No Import Export Log Found.
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { ComponentStateModel } from './Models/ViewModels';
  import { useRefreshEventsStore } from '../../stores/refresh-events';
  import { SqlLiteService } from '../../services/data/sqlLite-service';
  import { NTag } from 'naive-ui';
  import GenericSkeleton from '../Common/GenericSkeleton.vue';

  const refreshEventsStore = useRefreshEventsStore();

  const componentState: ComponentStateModel = reactive({
    importExportSummary: [], 
    dataLoading: true
  });

  const getImportExportSummaryLog = async () => {
    componentState.importExportSummary = await SqlLiteService.getAllImportExportSummary();

    componentState.dataLoading = false;
  }

  getImportExportSummaryLog();
  
  refreshEventsStore.$subscribe((mutation, state) => {
    if(state.refreshOperationSummary) {
      getImportExportSummaryLog();

      refreshEventsStore.updateRefreshOperationSummary(false);
    }
  });
</script>
