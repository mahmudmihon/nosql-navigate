<template>
  <div class="bg-base p-3 h-screen">
    <div class="mt-1 mb-4 pr-[220px]">
      SAVED <span class="bg-green-100 text-green-800 text-xs font-semibold ml-2 px-2.5 py-0.5 rounded-full dark:bg-green-200 dark:text-green-900">{{connections.savedConnections.length}}</span>
    </div>

    <div v-for="(cData, index) in connections.savedConnections" :key="index" class="bg-base rounded-lg pl-3 pr-[70px] py-[7px] mb-2">
      <p>{{cData.name}}</p>
      <p class="text-xs">{{cData.url}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { SqlLiteService } from '../../services/data/sqlLite-service';
  import { DbConnection } from '../../types/DbConnections/db-connection';

  let connections = reactive<{savedConnections: DbConnection[]}>({savedConnections: []});

  (async () => {
    await SqlLiteService.checkAndCreateInitialTable();
  })();

  async function getSavedConnections() {
    connections.savedConnections = await SqlLiteService.getSavedConnections();
  };

  getSavedConnections();
</script>
