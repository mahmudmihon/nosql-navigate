<template>
    <div class="flex flex-col">
        <div v-if="fullPageLoading" class="mt-2">
            <GenericSkeletonVue />
        </div>

        <div v-else>
            <DocumentsFilterAndPaginationVue @trigger-filter="triggerFilter" :db-name="props.dbName" :collection-name="props.collectionName" :documents-count="0" />

            <div v-if="searchedDataLoading" class="mt-1">
                <GenericSkeletonVue />
            </div>
            <div v-else class="h-screen overflow-y-auto mb-1">
                <DocumentListVue
                    :key="documentListKey"
                    :db-name="props.dbName"
                    :collection-name="props.collectionName"
                    :show-searched-data="showSearchedData"
                    :searched-data="searchedData"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { invoke } from '@tauri-apps/api/tauri';
    import { reactive, ref } from 'vue';
    import { extractObjectKeys } from '../../helpers/object-keys';
    import { useCollectionDocumentsStore } from '../../stores/collection-documents';
    import { useDocumentFieldsStore } from '../../stores/document-fields';
    import { CollectionDocuments } from '../../types/CollectionDocuments/collection-documents';
    import { v4 as uid } from 'uuid';
    import { EJSONService } from '../../services/ejson-service';
    import { useDocumentsCountStore } from '../../stores/documents-count';
    import { DocumentsFilteringPagination } from '../../types/DocumentFilter&Pagination/documents-filtering-pagination';
    import { useImportExportEventsStore } from '../../stores/import-export-events';
    import DocumentsFilterAndPaginationVue from '../DocumentsFilterAndPagination/DocumentsFilterAndPagination.vue';
    import GenericSkeletonVue from '../Common/GenericSkeleton.vue';
    import DocumentListVue from '../DocumentList/DocumentList.vue';
           
    const props = defineProps<{
        dbName: string
        collectionName: string
    }>();

    const fieldsStore = useDocumentFieldsStore();
    const documentsStore = useCollectionDocumentsStore();
    const countStore = useDocumentsCountStore();
    const importExportStore = useImportExportEventsStore();

    let fullPageLoading = ref<boolean>(true);
    let searchedDataLoading = ref<boolean>(false);
    let showSearchedData = ref<boolean>(false);
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

                    if(triggeredFromFilterAndPagination) {
                        searchedData = documentList;
                        showSearchedData.value = true;                       
                    }
                    else {
                        if (documentList.length > 0) {
                            const firstDocument = documentList[0];
                            const parsedObject = EJSONService.BsonDocToObject(firstDocument);
                            const objectKeys = extractObjectKeys(parsedObject) as string[];

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
</script>