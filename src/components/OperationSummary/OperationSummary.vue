<template>
  <div class="flex w-full">
    <n-button strong secondary round type="success" size="small">
      Refresh
    </n-button>
  </div>

  <div class="mt-5">
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
</script>
