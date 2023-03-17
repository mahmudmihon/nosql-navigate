<template>
    <div class="flex flex-col">
        <div v-if="fullPageLoading" class="mt-2">
            <GenericSkeleton />
        </div>

        <div v-else>
            <DocumentsFilterAndPagination
                @trigger-filter="triggerFilter"
                @trigger-doc-insert-modal="triggerDocInsertModal"
                :db-name="props.dbName"
                :collection-name="props.collectionName"
                :documents-count="documentsCount"
            />

            <div v-if="searchedDataLoading" class="mt-1">
                <GenericSkeleton />
            </div>
            <div v-else class="h-screen overflow-y-auto mb-1">
                <DocumentList
                    :key="documentListKey"
                    :db-name="props.dbName"
                    :collection-name="props.collectionName"
                    :show-searched-data="showSearchedData"
                    :searched-data="searchedData"
                />
            </div>
        </div>
    </div>

    <n-modal
        v-model:show="showDocInsertModal"
        class="rounded-xl"
        preset="card"
        style="width: 50%;
        background-color: #313131;
        border: #313131;"
        :bordered="true"
        size="medium"
    >
        <div class="mb-6 overflow-y-auto">
            <vue-jsoneditor
                mode="text"
                v-model:text="docToInsert"
                :mainMenuBar="false"
                :navigationBar="false"
                :statusBar="false"
                :darkTheme="true"
                :height="350"
            />
        </div>

        <div class="flex justify-end mt-3 gap-2">
            <button class="bg-[#4bb153] text-white rounded-lg py-[3px] px-6" @click="insertDoc">
                Insert
            </button>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
    import { invoke } from '@tauri-apps/api/tauri';
    import { reactive, ref } from 'vue';
    import { NModal, useNotification } from 'naive-ui';
    import { clearObjectKeys, extractObjectKeys } from '../../helpers/object-keys';
    import { useCollectionDocumentsStore } from '../../stores/collection-documents';
    import { useDocumentFieldsStore } from '../../stores/document-fields';
    import { CollectionDocuments } from '../../types/CollectionDocuments/collection-documents';
    import { v4 as uid } from 'uuid';
    import { EJSONService } from '../../services/ejson-service';
    import { useDocumentsCountStore } from '../../stores/documents-count';
    import { DocumentsFilteringPagination } from '../../types/DocumentFilter&Pagination/documents-filtering-pagination';
    import { useImportExportEventsStore } from '../../stores/import-export-events';
    import { ObjectId } from 'bson';
    import DocumentsFilterAndPagination from '../DocumentsFilterAndPagination/DocumentsFilterAndPagination.vue';
    import GenericSkeleton from '../Common/GenericSkeleton.vue';
    import DocumentList from '../DocumentList/DocumentList.vue';
    import VueJsoneditor from 'vue3-ts-jsoneditor';

    const props = defineProps<{
        dbName: string
        collectionName: string
    }>();

    const fieldsStore = useDocumentFieldsStore();
    const documentsStore = useCollectionDocumentsStore();
    const countStore = useDocumentsCountStore();
    const importExportStore = useImportExportEventsStore();
    const notification = useNotification();

    let fullPageLoading = ref<boolean>(true);
    let searchedDataLoading = ref<boolean>(false);
    let showSearchedData = ref<boolean>(false);
    let showDocInsertModal = ref<boolean>(false);
    let documentsCount = ref<number>(0);
    let docToInsert = ref<string>('');
    let searchedData = reactive<object[]>([]);
    let documentListKey = ref<string>(uid());
    let collectionDocuments: CollectionDocuments[] = documentsStore.collectionDocuments;

    const getStoreCollectionDocumentsAndCount = (filters: string, sort: string, limit: number, skip: number, triggeredFromFilterAndPagination: boolean = false) => {

        const promises = [
            invoke('get_collection_documents', { dbName: props.dbName, collectionName: props.collectionName, filters: filters, sort: sort, limit: limit, skip: skip }),
            invoke('get_collection_documents_count', { dbName: props.dbName, collectionName: props.collectionName, filters: filters })
        ];

        if(triggeredFromFilterAndPagination) {
            searchedDataLoading.value = true;
        }

        Promise.allSettled(promises).then(results => {
            const listResult = results[0];
            const countResult = results[1];

            if(listResult.status == 'fulfilled') {
                if(listResult.value != 'error') {
                    const documentList = listResult.value as object[];

                    documentsCount.value = documentList.length;

                    if(triggeredFromFilterAndPagination) {
                        searchedData = documentList;
                        showSearchedData.value = true;
                    }
                    else {
                        if (documentList.length > 0) {
                            const firstDocument = documentList[0];
                            const parsedObject = EJSONService.BsonDocToObject(firstDocument);
                            const objectKeys = extractObjectKeys(parsedObject).sort() as string[];

                            clearObjectKeys();

                            fieldsStore.upsertDocumentFields({ documentOf: `${props.dbName}.${props.collectionName}`, documentFields: objectKeys });

                            documentsStore.addNewDocuments({ collectionName: `${props.dbName}.${props.collectionName}`, CollectionDocuments: documentList });
                        }
                    }

                    documentListKey.value = uid();
                }
            }

            if(countResult.status == 'fulfilled') {
                if(countResult.value != 'error') {
                    const documentsCount = countResult.value as number;

                    countStore.upsertCount({ documentsOf: `${props.dbName}.${props.collectionName}`, documentsCount: documentsCount });
                }
            }

            fullPageLoading.value = false;
            searchedDataLoading.value = false;
        });
    }

    if(collectionDocuments.some(x => x.collectionName == `${props.dbName}.${props.collectionName}`)) {
        fullPageLoading.value = false;
    }
    else {
        getStoreCollectionDocumentsAndCount('{}', '{}', 50, 0);
    }

    const triggerFilter = (data: DocumentsFilteringPagination) => {
        getStoreCollectionDocumentsAndCount(data.filters, data.sort, data.limit, data.skip, true);
    }

    importExportStore.$subscribe((mutation, state) => {
        if(state.documentsImported) {
            getStoreCollectionDocumentsAndCount('{}', '{}', 50, 0);

            importExportStore.updateDocumentsImported(false);
        }
    });

    const triggerDocInsertModal = (value: boolean) => {
        showDocInsertModal.value = value;
    }

    const insertDoc = () => {
        let parsedObject = JSON.parse(docToInsert.value);

        if(Object.keys(parsedObject).length > 0) {
            if(!Object.keys(parsedObject).includes('_id')) {
                parsedObject = { "_id": ObjectId.generate().toString('hex'), ...parsedObject }
            }

            invoke('insert_docuemnt', { dbName: props.dbName, collectionName: props.collectionName, document: JSON.stringify(parsedObject) }).then(value => {
                if(value == 'ok') {
                    notification.success({ title: "Document inserted." });

                    showDocInsertModal.value = false;
                    docToInsert.value = '';
                }
            });
        }
    }
</script>