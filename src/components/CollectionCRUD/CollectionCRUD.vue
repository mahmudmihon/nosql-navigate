<template>
    <summary class="flex items-center px-3 py-1 text-white rounded-lg cursor-pointer bg-base">
        <span class="mr-1.5 text-xs font-medium">{{$props.dbName}}</span>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clip-rule="evenodd" />
        </svg>

        <span class="ml-1.5 text-xs font-medium">{{$props.collectionName}}</span>
    </summary>

    <div class="flex flex-col">
        <GenericSkeletonVue v-if="dataLoading" />

        <div v-else>
            <DocumentsFilterAndPaginationVue @trigger-filter="triggerFilter" :db-name="props.dbName" :collection-name="props.collectionName" :documents-count="0" />

            <div class="h-screen overflow-y-auto mb-1">
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

    let dataLoading = ref<boolean>(true);
    let showSearchedData = ref<boolean>(false);
    let searchedData = reactive<object[]>([]);
    let documentListKey = ref<string>(uid());

    var collectionDocuments: CollectionDocuments[] = documentsStore.collectionDocuments;

    if(collectionDocuments.some(x => x.collectionName == `${props.dbName}.${props.collectionName}`)) {
        dataLoading.value = false;
    }
    else { 
        const promises = [
            invoke('get_collection_documents', { dbName: props.dbName, collectionName: props.collectionName, filters: "{}", limit: 50, skip: 0 }),
            invoke('get_collection_documents_count', { dbName: props.dbName, collectionName: props.collectionName, filters: "{}" })
        ];
        
        Promise.allSettled(promises).then(results => {
            const listResult = results[0];
            const countResult = results[1];

            if(listResult.status == 'fulfilled') {
                if(listResult.value != 'error') {
                    const documentList = listResult.value as object[];

                    if (documentList.length > 0) {
                        const firstDocument = documentList[0];
                        const parsedObject = EJSONService.BsonDocToObject(firstDocument);
                        const objectKeys = extractObjectKeys(parsedObject) as string[];

                        fieldsStore.addNewFields({ documentOf: `${props.dbName}.${props.collectionName}`, documentFields: objectKeys });

                        documentsStore.addNewDocuments({ collectionName: `${props.dbName}.${props.collectionName}`, CollectionDocuments: documentList });
                    }                  
                }
            }

            if(countResult.status == 'fulfilled') {
                if(countResult.value != 'error') {
                    const documentsCount = countResult.value as number;

                    countStore.addNewCount({ documentsOf: `${props.dbName}.${props.collectionName}`, documentsCount: documentsCount });
                }
            }

            dataLoading.value = false;
        });
    }

    const triggerFilter = (conditions: string) => {
        invoke('get_collection_documents', { dbName: props.dbName, collectionName: props.collectionName, filters: conditions, limit: 50, skip: 0 }).then((value: any) => {
            if(value != 'error') {
                searchedData = value as object[];
                showSearchedData.value = true;
                documentListKey.value = uid();
            }
        })
    }
</script>