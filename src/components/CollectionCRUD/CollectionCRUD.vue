<template>
    <summary class="flex items-center px-3 py-2 text-white rounded-lg cursor-pointer bg-base">
        <span class="mr-1.5 text-sm font-medium">{{$props.dbName}}</span>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clip-rule="evenodd" />
        </svg>

        <span class="ml-1.5 text-sm font-medium">{{$props.collectionName}}</span>
    </summary>

    <div class="flex flex-col">
        <GenericSkeletonVue v-if="dataLoading" />

        <CollectionFilterVue :db-name="props.dbName" :collection-name="props.collectionName" />
    </div>
</template>

<script setup lang="ts">
    import { invoke } from '@tauri-apps/api/tauri';
    import { ref } from 'vue';
    import { extractObjectKeys } from '../../helpers/ObjectKeys';
    import { useCollectionDocumentsStore } from '../../stores/collection-documents';
    import { useDocumentFieldsStore } from '../../stores/document-fields';
    import { CollectionDocuments } from '../../types/CollectionDocuments/collection-documents';
    import CollectionFilterVue from '../CollectionFilter/CollectionFilter.vue';
    import GenericSkeletonVue from '../Common/GenericSkeleton.vue';

    const props = defineProps<{
        dbName: string
        collectionName: string
    }>();

    const fieldsStore = useDocumentFieldsStore();
    const documentsStore = useCollectionDocumentsStore();

    let dataLoading = ref<boolean>(true);

    var collectionDocuments: CollectionDocuments[] = documentsStore.collectionDocuments;

    if(collectionDocuments.some(x => x.collectionName == `${props.dbName}.${props.collectionName}`)) {
        dataLoading.value = false;
    }
    else {
        invoke('get_collection_documents', { dbName: props.dbName, collectionName: props.collectionName }).then((value: any) => {
            if (value != 'error') {
                if (value.length > 0) {
                    const firstDocument = value[0] as object;
                    console.log(firstDocument);
                    const objectKeys = extractObjectKeys(firstDocument) as string[];
                    fieldsStore.addNewFields({ documentOf: `${props.dbName}.${props.collectionName}`, documentFields: objectKeys });

                    documentsStore.addNewDocuments({ collectionName: `${props.dbName}.${props.collectionName}`, CollectionDocuments: value as object[] });
                }

                dataLoading.value = false;
            }
        });
    }
</script>