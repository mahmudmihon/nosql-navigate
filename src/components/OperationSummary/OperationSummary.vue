<template>
  <div class="flex justify-end w-full">
    <button class="bg-[#63ffb729] text-[#63e2b7] rounded-lg py-[1px] px-2 ml-2" @click="triggerSummaryRefresh">
        Refresh
    </button>
  </div>

  <div class="mt-2">
    <n-tabs type="line" animated>
      <n-tab-pane name="import_export" tab="Import Export">
        <ImportExportSummary />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
  import { NButton, NTabs, NTabPane } from 'naive-ui';
  import { useRefreshEventsStore } from '../../stores/refresh-events';
  import ImportExportSummary from '../ImportExportSummary/ImportExportSummary.vue';

  const refreshEventsStore = useRefreshEventsStore();

  const triggerSummaryRefresh = () => {
    refreshEventsStore.updateRefreshOperationSummary(true);
  }
</script>
