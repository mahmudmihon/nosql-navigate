<template>
  <div class="flex flex-col p-3 w-[350px] bg-base h-screen overflow-x-auto">
    <GenericSkeleton v-if="componentState.dataLoading" />

    <div v-else>
      <n-popover trigger="hover">
        <template #trigger>
          <p class="bg-base w-[251px] truncate text-[13px] rounded-lg pl-3 pt-3 pb-3">{{componentState.connectedUrl}}</p>
        </template>
        <span>{{componentState.connectedUrl}}</span>
      </n-popover>
      
      <div class="flex mt-2 align-middle justify-center gap-2">
        <span class="bg-base p-2.5 rounded-full hover:cursor-pointer" title="Add Database" @click="addNewDatabase">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V10.5z" clip-rule="evenodd" />
          </svg>
        </span>

        <span class="bg-base p-2.5 rounded-full hover:cursor-pointer" title="Refresh" @click="refreshDb">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </span>

        <span class="bg-base p-2.5 rounded-full hover:cursor-pointer" title="Disconnect" @click="disconnectDb">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664" />
          </svg>
        </span>

        <span class="bg-base p-2.5 rounded-full hover:cursor-pointer" title="Logs" @click="triggerLogsModal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
        </span>
      </div>

      <div class="flex mt-5">
        <n-input
          placeholder="Search"
          clearable
          v-model:value="componentState.searchQuery"
        >
          <template #prefix>
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </template>
        </n-input>
      </div>

      <nav aria-label="Dbs" class="flex flex-col mt-4 max-h-[calc(100vh-190px)] overflow-y-auto">
        <details v-for="db, index in dbSearchableData" :key="index" class="group">
          <summary class="group/db flex items-center px-3 py-2 text-white rounded-lg cursor-pointer hover:bg-base hover:text-white">
            <span class="transition duration-300 shrink-0 group-open:rotate-90">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 ml-1.5">
              <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
              <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
              <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" />
              <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" />
            </svg>

            <span class="ml-1.5 text-sm font-medium text-ellipsis overflow-hidden w-48">{{db.db_name}}</span>

            <div class="ml-auto hidden group-hover/db:flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-green-400" @click="addNewCollection(db.db_name)">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-red-500 ml-1" @click="showConfirmationModal(db.db_name, '')">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </summary>

          <nav v-for="(collectionName, index) in db.db_collections?.sort()" :key="index" aria-label="Teams Nav" class="mt-1 ml-7 flex flex-col">
            <a href="#" class="group/collection flex items-center p-1.5 text-white rounded-lg hover:bg-base hover:text-white">
              <span @click="addCollectionTabInStore(db.db_name, collectionName)" class="text-xs font-medium text-ellipsis overflow-hidden w-48">{{collectionName}}</span>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-red-500 ml-auto hidden group-hover/collection:flex" @click="showConfirmationModal(db.db_name, collectionName)">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
          </nav>
        </details>
      </nav>
    </div>
  </div>

  <n-modal
    v-model:show="componentState.showCollectionAddModal"
    class="rounded-xl"
    preset="card"
    style="width: 50%; background-color: #313131; border: #313131;"
    :bordered="true"
    size="medium"
  >
    <div class="mb-6" v-if="componentState.addNewDb">
      <label class="block mb-2 text-lg font-medium text-white">Database Name</label>
      <input type="text" v-model="componentState.collectionAddModel.dbName"
        class="border border-gray-300 text-white text-sm rounded-xl block w-full p-2 bg-[#313131]">
    </div>

    <div class="mb-6">
      <label class="block mb-2 text-lg font-medium text-white">Collection Name</label>
      <input type="text" v-model="componentState.collectionAddModel.collectionName"
        class="border border-gray-300 text-white text-sm rounded-xl block w-full p-2 bg-[#313131]">
    </div>

    <div class="flex justify-end mt-3 gap-2">
      <button class="inline-flex bg-[#63ffb729] text-[#63e2b7] rounded-lg py-[3px] px-6" :disabled="componentState.creatingCollection"
        @click="createCollection">
        <svg v-if="componentState.creatingCollection" class="animate-spin mt-1 -ml-1 mr-2 h-4 w-4 text-black"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <span v-if="componentState.addNewDb">Create Database</span>
        <span v-else>Create Collection</span>
      </button>
    </div>
  </n-modal>

  <n-modal
    v-model:show="componentState.showDeleteConfirmationModal"
    class="rounded-xl"
    preset="card"
    style="width: 50%; background-color: #313131; border: #313131;"
    :bordered="true"
    size="medium"
  >
    <div  class="bg-base p-4 rounded-xl w-full text-lg">
      Are you sure you want to delete <span class="text-red-500">{{ componentState.deleteEntityName }}</span>
    </div>

    <div class="flex justify-end mt-3 gap-2">
      <button class="inline-flex bg-[#63ffb729] text-[#63e2b7] rounded-lg py-[3px] px-6" :disabled="componentState.deletingEntity"
        @click="dropEntity">
        <svg v-if="componentState.deletingEntity" class="animate-spin mt-1 -ml-1 mr-2 h-4 w-4 text-black"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        Confirm
      </button>
    </div>
  </n-modal>

  <n-modal
    v-model:show="componentState.showLogsModal"
    class="rounded-xl"
    preset="card"
    style="width: 50%; background-color: #313131; border: #313131;"
    :bordered="true"
    size="medium"
  >
    <OperationSummary />
  </n-modal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { ComponentStateModel, DbsNavigationViewModel } from './Models/ViewModels';
  import { NModal, useNotification, NInput, NPopover } from 'naive-ui';
  import { useCollectionTabsStore } from '../../stores/collection-tabs';
  import { useRouter } from 'vue-router';
  import { v4 as uid } from 'uuid';
  import { useRefreshEventsStore } from '../../stores/refresh-events';
  import { useDatabaseCollectionsStore } from '../../stores/db-collections'; 
  import { MongoDbService } from '../../services/data/mongo-service';  
  import { StoreService } from '../../services/store-service'; 
  import { SqlLiteService } from '../../services/data/sqlLite-service';
  import { useConnectionEventsStore } from '../../stores/connection-events';
  import { ErrorResult } from '../../types/OperationSummary/error-result';
  import { extractMessageFromMongoError } from '../../utilities/message-extract';
  import GenericSkeleton from '../Common/GenericSkeleton.vue';
  import OperationSummary from '../OperationSummary/OperationSummary.vue';

  const tabsStore = useCollectionTabsStore();
  const collectionsStore = useDatabaseCollectionsStore();
  const refreshEventsStore = useRefreshEventsStore();
  const connectionEventsStore = useConnectionEventsStore();
  const router = useRouter();
  const notification = useNotification();

  const componentState: ComponentStateModel = reactive({
    searchQuery: '',
    deleteEntityName: '',
    connectedUrl: connectionEventsStore.$state.connectedUrl,
    dataLoading: true,
    showCollectionAddModal: false,
    showDeleteConfirmationModal: false,
    showLogsModal: false,
    creatingCollection: false,
    deletingEntity: false,
    addNewDb: false,
    collectionAddModel: {
      dbName: '',
      collectionName: ''
    },
    dbsWithCollections: []
  });

  const getDbsWithCollections = async (): Promise<void> => {
    const result = await MongoDbService.getDbsWithCollectionNames();

    if(result !== 'error') {
      componentState.dbsWithCollections = result as DbsNavigationViewModel[];

      componentState.dataLoading = false;

      collectionsStore.addDbsWithCollections(componentState.dbsWithCollections.map(x => {return {dbName: x.db_name, dbCollections: x.db_collections}}))
    }
  }

  (async () => {
    await getDbsWithCollections();
  })();

  const addNewDatabase = (): void => {
    componentState.addNewDb = true;
    componentState.collectionAddModel.dbName = '';
    componentState.showCollectionAddModal = true;
  }

  const addNewCollection = (dbName: string): void => {
    componentState.addNewDb = false;
    componentState.collectionAddModel.dbName = dbName;
    componentState.showCollectionAddModal = true;
  }

  const createCollection = async (): Promise<void> => {
    componentState.creatingCollection = true;

    const result = await MongoDbService.createCollection(componentState.collectionAddModel.dbName, componentState.collectionAddModel.collectionName);

    if(result != 'error') {

      await refreshDb();

      componentState.showCollectionAddModal = false;
    }
    else{
      notification.error({title: "Operation Failed!"});
    }

    componentState.creatingCollection = false;
  }

  const dropEntity = async (): Promise<void> => {
    const dbCollectionName = componentState.deleteEntityName.split('->');

    componentState.deletingEntity = true;

    try {
      let result: string;

      if(dbCollectionName.length > 1) {
        result = await MongoDbService.dropCollection(dbCollectionName[0].trim(), dbCollectionName[1].trim());
      }
      else {
        result = await MongoDbService.dropDatabase(dbCollectionName[0].trim());
      }

      if(typeof result === "string") {

        await refreshDb();
      }

      componentState.collectionAddModel.dbName = '';
      componentState.collectionAddModel.collectionName = '';
      componentState.deletingEntity = false;
      componentState.showDeleteConfirmationModal = false;
    }
    catch(exception: any) {
      notification.error({title: extractMessageFromMongoError(exception.message)});

      componentState.deletingEntity = false;
    }   
  }

  const showConfirmationModal = (dbName: string, collectionName: string) => {
    componentState.deleteEntityName = dbName;

    if(collectionName != '') {
      componentState.deleteEntityName += ` -> ${collectionName}`;
    }

    componentState.showDeleteConfirmationModal = true;
  }

  const triggerLogsModal = () => {
    componentState.showLogsModal = true;
  }

  const addCollectionTabInStore = (dbName: string, collectionName: string) => {
    tabsStore.addNewTab({id: uid(), dbName: dbName, collectionName: collectionName, isActive: true});

    router.push({path: '/collection-tabs'});
  }

  const refreshDb = async () => {
    await getDbsWithCollections();

    refreshEventsStore.updateRefreshDbSummary(true);
  }

  const dbSearchableData = computed(() => {
    let searchedData: DbsNavigationViewModel[] = [];

    const term = componentState.searchQuery;

    if(term == null || term == '') {
      searchedData = componentState.dbsWithCollections;

      document.body.querySelectorAll('details').forEach((e) => e.removeAttribute('open'));
    }
    else {
      for(let i = 0; i < componentState.dbsWithCollections.length; i++) {
        const dbData = componentState.dbsWithCollections[i];

        if(dbData != null) {
          let data: DbsNavigationViewModel = {db_name: "", db_collections: []};

          if(dbData.db_name.toLowerCase().includes(term.toLowerCase())) {
            data.db_name = dbData.db_name;
          }

          const collections = dbData.db_collections.filter(x => x.toLowerCase().includes(term.toLowerCase()));

          if(collections?.length > 0) {
            data.db_name = dbData.db_name;
            data.db_collections = collections;
          }

          if(data.db_name != '' || data.db_collections?.length > 0) {
            searchedData.push(data);
          }
        }
      }

      document.body.querySelectorAll('details').forEach((e) => e.setAttribute('open', 'true'));
    }

    return searchedData;
  });

  const disconnectDb = async (): Promise<void> => {
    await SqlLiteService.clearImportExportSummary();

    await MongoDbService.dropMongoClient();

    StoreService.resetStores();

    router.push({path: '/'});
  }
</script>
