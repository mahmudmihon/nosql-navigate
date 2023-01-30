<template>
    <summary class="flex items-center px-3 py-1 text-white rounded-lg cursor-pointer bg-base">
        <span class="mr-1.5 text-xs font-medium">{{$props.dbName}}</span>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clip-rule="evenodd" />
        </svg>

        <span class="ml-1.5 text-xs font-medium">{{$props.collectionName}}</span>
    </summary>

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
    import { DocumentsFilteringPagination } from '../../types/documents-filtering-pagination';
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

    let fullPageLoading = ref<boolean>(true);
    let searchedDataLoading = ref<boolean>(false);
    let showSearchedData = ref<boolean>(false);
    let searchedData = reactive<object[]>([]);
    let documentListKey = ref<string>(uid());
    let collectionDocuments: CollectionDocuments[] = documentsStore.collectionDocuments;

    const getStoreCollectionDocumentsAndCount = (filters: string, limit: number, skip: number, triggeredFromFilterAndPagination: boolean = false) => {

        const promises = [
            invoke('get_collection_documents', { dbName: props.dbName, collectionName: props.collectionName, filters: filters, limit: limit, skip: skip }),
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
                        documentListKey.value = uid();
                    }
                    else {
                        if (documentList.length > 0) {
                            const firstDocument = documentList[0];
                            const parsedObject = EJSONService.BsonDocToObject(firstDocument);
                            const objectKeys = extractObjectKeys(parsedObject) as string[];

                            fieldsStore.addNewFields({ documentOf: `${props.dbName}.${props.collectionName}`, documentFields: objectKeys });
                            
                            documentsStore.addNewDocuments({ collectionName: `${props.dbName}.${props.collectionName}`, CollectionDocuments: documentList });
                        }                       
                    }                             
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
        getStoreCollectionDocumentsAndCount('{}', 50, 0);
    }

    const triggerFilter = (data: DocumentsFilteringPagination) => {
        getStoreCollectionDocumentsAndCount(data.filters, data.limit, data.skip, true);        
    }
</script>