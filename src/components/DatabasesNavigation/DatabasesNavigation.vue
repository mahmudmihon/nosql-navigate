<template>
  <div class="flex flex-col bg-base p-3 h-screen w-80 overflow-x-auto">
    <GenericSkeleton v-if="dataLoading" />

    <div v-else>
      <p class="bg-base text-ellipsis text-sm rounded-lg pl-3 pt-3 pb-3">mongodb://localhost:27027</p>

      <div class="flex mt-2 align-middle justify-center gap-2">
        <span class="bg-base p-2.5 rounded-full hover:cursor-pointer" title="Add Database" @click="addNewDatabase">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V10.5z" clip-rule="evenodd" />
          </svg>
        </span>

        <span class="bg-base p-2.5 rounded-full hover:cursor-pointer" title="Disconnect" @click="disconnectDb">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664" />
          </svg>
        </span>

        <span class="bg-base p-2.5 rounded-full hover:cursor-pointer" title="Refresh" @click="refreshDb">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </span>
      </div>

      <div class="inline-flex flex-col justify-center relative text-white mt-5">
          <div class="relative">
              <input type="text" class="p-1 pl-8 rounded-lg border border-gray-200 bg-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:bg-base focus:border-transparent  w-full" placeholder="search..." />
              <svg class="w-4 h-4 absolute left-2.5 top-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
          </div>
      </div>

      <nav aria-label="Dbs" class="flex flex-col mt-4 space-y-0 overflow-auto">
        <details v-for="db in dbsWithCollections?.sort()" :key="db.db_collections.length" class="group">
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

            <span class="ml-1.5 text-sm font-medium">{{db.db_name}}</span>

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
    v-model:show="showCollectionAddModal"
    class="rounded-xl"
    preset="card"
    style="width: 50%; background-color: #313131; border: #313131;"
    :bordered="true"
    size="medium"
  >
    <div class="mb-6" v-if="addNewDb">
      <label class="block mb-2 text-lg font-medium text-white">Database Name</label>
      <input type="text" v-model="collectionAddModel.dbName"
        class="border border-gray-300 text-white text-sm rounded-xl block w-full p-2 bg-[#313131]">
    </div>

    <div class="mb-6">
      <label class="block mb-2 text-lg font-medium text-white">Collection Name</label>
      <input type="text" v-model="collectionAddModel.collectionName"
        class="border border-gray-300 text-white text-sm rounded-xl block w-full p-2 bg-[#313131]">
    </div>

    <div class="flex justify-end mt-3 gap-2">
      <button class="inline-flex bg-[#4bb153] text-white rounded-lg py-[3px] px-6" :disabled="creatingCollection"
        @click="createCollection">
        <svg v-if="creatingCollection" class="animate-spin mt-1 -ml-1 mr-2 h-4 w-4 text-black"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <span v-if="addNewDb">Create Database</span>
        <span v-else>Create Collection</span>
      </button>
    </div>
  </n-modal>

  <n-modal
    v-model:show="showDeleteConfirmationModal"
    class="rounded-xl"
    preset="card"
    style="width: 50%; background-color: #313131; border: #313131;"
    :bordered="true"
    size="medium"
  >
    <div  class="bg-base p-4 rounded-xl w-full text-lg">
      Are you sure you want to delete <span class="text-red-500">{{ deleteEntityName }}</span>
    </div>

    <div class="flex justify-end mt-3 gap-2">
      <button class="inline-flex bg-[#4bb153] text-white rounded-lg py-[3px] px-6" :disabled="deletingEntity"
        @click="dropEntity">
        <svg v-if="deletingEntity" class="animate-spin mt-1 -ml-1 mr-2 h-4 w-4 text-black"
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
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { invoke } from '@tauri-apps/api';
  import { DbsNavigationViewModel } from './Models/ViewModels';
  import { NModal, useNotification } from 'naive-ui';
  import { useCollectionTabsStore } from '../../stores/collection-tabs';
  import { useRouter } from 'vue-router';
  import { v4 as uid } from 'uuid';
  import { useCollectionDocumentsStore } from '../../stores/collection-documents';
  import { useDocumentFieldsStore } from '../../stores/document-fields';
  import { useDocumentsCountStore } from '../../stores/documents-count';
  import { useRefreshEventsStore } from '../../stores/refresh-events';
  import { useImportExportEventsStore } from '../../stores/import-export-events';
  import { useDatabaseCollectionsStore } from '../../stores/db-collections';
  import GenericSkeleton from '../Common/GenericSkeleton.vue';

  const tabsStore = useCollectionTabsStore();
  const documentsStore = useCollectionDocumentsStore();
  const collectionsStore = useDatabaseCollectionsStore();
  const fieldsStore = useDocumentFieldsStore();
  const countsStore = useDocumentsCountStore();
  const refreshEventsStore = useRefreshEventsStore();
  const importExportStore = useImportExportEventsStore();
  const router = useRouter();
  const notification = useNotification();

  let dataLoading = ref(true);
  let showCollectionAddModal = ref<boolean>(false);
  let showDeleteConfirmationModal = ref<boolean>(false);
  let deleteEntityName = ref<string>("");
  let creatingCollection = ref<boolean>(false);
  let deletingEntity = ref<boolean>(false);
  let addNewDb = ref<boolean>(true);
  let collectionAddModel = reactive<any>({
    dbName: '',
    collectionName: ''
  });
  let dbsWithCollections: DbsNavigationViewModel[] = reactive<DbsNavigationViewModel[]>([]);

  const getDbsWithCollections = () => {
    invoke('get_dbs_with_collections').then(value => {
      if(value !== 'error') {
        dbsWithCollections = value as DbsNavigationViewModel[];
        dataLoading.value = false;

        collectionsStore.addDbsWithCollections(dbsWithCollections.map(x => {return {dbName: x.db_name, dbCollections: x.db_collections}}))
      }
    });
  }

  getDbsWithCollections();

  const addNewDatabase = (): void => {
    addNewDb.value = true;
    collectionAddModel.dbName = '';
    showCollectionAddModal.value = true;
  }

  const addNewCollection = (dbName: string): void => {
    addNewDb.value = false;
    collectionAddModel.dbName = dbName;
    showCollectionAddModal.value = true;
  }

  const createCollection = () => {
    creatingCollection.value = true;

    invoke('create_collection', { dbName: collectionAddModel.dbName, collectionName: collectionAddModel.collectionName }).then(value => {
      if(value != 'error') {
        if(addNewDb.value) {
          dbsWithCollections.push({db_name: collectionAddModel.dbName, db_collections: [collectionAddModel.collectionName]});
        }
        else {
          let updatedDb = dbsWithCollections.filter(x => x.db_name == collectionAddModel.dbName)[0];

          if(updatedDb != null) {
            const updatedDbIndex = dbsWithCollections.indexOf(updatedDb);

            dbsWithCollections[updatedDbIndex].db_collections.push(collectionAddModel.collectionName);
            dbsWithCollections[updatedDbIndex].db_collections.sort();
          }
        }

        showCollectionAddModal.value = false;
      }
      else{
        notification.error({title: "Something went wrong! Please try again later."});
      }

      creatingCollection.value = false;
    }).catch(e => {
        notification.error({ title: "Something went wrong!" });

        creatingCollection.value = false;
    });
  }

  const dropEntity = () => {
    const dbCollectionName = deleteEntityName.value.split('->');

    deletingEntity.value = true;

    if(dbCollectionName.length > 1) {
      invoke('drop_collection', { dbName: dbCollectionName[0].trim(), collectionName: dbCollectionName[1].trim() }).then(value => {
        if(value != 'error') {
          let updatedDb = dbsWithCollections.filter(x => x.db_name == collectionAddModel.dbName)[0];

          if(updatedDb != null) {
            const updatedDbIndex = dbsWithCollections.indexOf(updatedDb);

            let newDb = {...updatedDb};

            const deletedCollectionIndex = updatedDb.db_collections.indexOf(dbCollectionName[1].trim());

            newDb.db_collections.splice(deletedCollectionIndex, 1);

            dbsWithCollections.splice(updatedDbIndex, 1, newDb);

            notification.success({title: "Collection deleted."});
          }
        }
        else{
          notification.error({title: "Something went wrong! Please try again later."});
        }
      });
    }

    deletingEntity.value = false;
    showDeleteConfirmationModal.value = false;
  }

  const showConfirmationModal = (dbName: string, collectionName: string) => {
    deleteEntityName.value = dbName;

    if(collectionName != '') {
      deleteEntityName.value += ` -> ${collectionName}`;
    }

    showDeleteConfirmationModal.value = true;
  }

  const addCollectionTabInStore = (dbName: string, collectionName: string) => {
    tabsStore.addNewTab({id: uid(), dbName: dbName, collectionName: collectionName, isActive: true});

    router.push({path: '/collection-tabs'});
  }

  const refreshDb = () => {
    getDbsWithCollections();

    refreshEventsStore.updateRefreshDbSummary(true);
  }

  const disconnectDb = () => {
    invoke('drop_client');

    collectionsStore.$reset();
    documentsStore.$reset();
    fieldsStore.$reset();
    countsStore.$reset();
    tabsStore.$reset();
    refreshEventsStore.$reset();
    importExportStore.$reset();

    router.push({path: '/'});
  }
</script>
