<template>
  <div class="bg-base p-3 h-screen">
    <div class="mt-1 mb-4 pr-[220px]">
      SAVED <span class="bg-green-100 text-green-800 text-xs font-semibold ml-2 px-2.5 py-0.5 rounded-full dark:bg-green-200 dark:text-green-900">{{connections.savedConnections.length}}</span>
    </div>

    <div v-for="(cData, index) in connections.savedConnections" :key="index" @click="updateSelectedDb(index)" class="bg-base rounded-lg pl-3 pr-[70px] py-[7px] mb-2 relative group hover:cursor-pointer">
      <div class="z-40 absolute top-2 right-1 hidden group-hover:flex">
        <svg @click="DeleteConnection(cData.id)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 ml-2 text-red-500 hover:cursor-pointer">
            <path fill-rule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                clip-rule="evenodd"
            />
        </svg>
      </div>
      <div>
        <p>{{ cData.name }}</p>
        <p class="text-xs">{{ cData.url }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { SqlLiteService } from '../../services/data/sqlLite-service';
  import { useConnectionCRUDEventsStore } from '../../stores/connection-crud-events';
  import { DbConnection } from '../../types/DbConnections/db-connection';

  let connections = reactive<{savedConnections: DbConnection[]}>({savedConnections: []});

  const crudEventsStore = useConnectionCRUDEventsStore();

  (async () => {
    await SqlLiteService.checkAndCreateInitialTable();
  })();

  async function getSavedConnections() {
    connections.savedConnections = await SqlLiteService.getSavedConnections();
  };

  getSavedConnections();

  async function DeleteConnection(id: string) {
    await SqlLiteService.deleteSavedConnection(id);

    await getSavedConnections();
  }

  function updateSelectedDb(index: number) {
    crudEventsStore.updateSelectedConnection(connections.savedConnections[index]);
  }

  crudEventsStore.$subscribe((mutation, state) => {
    if (state.connectionSaved) {
      getSavedConnections();;

      crudEventsStore.updateConnectionSavedEvent(false);
    }
  });
</script>
