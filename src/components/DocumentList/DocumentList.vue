<template>
    <div v-if="documentList.length > 0" class="h-screen overflow-y-auto">
        <div v-for="(document, index) in documentList" :key="index" class="mb-2">
            <JSONViewVue
                :editor-value="document"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive } from 'vue';
    import { useCollectionDocumentsStore } from '../../stores/collection-documents';
    import JSONViewVue from '../Editor/JSONView.vue';

    const props = defineProps<{
        dbName: string
        collectionName: string
        showSearchedData: boolean
        searchedData: object[]
    }>();

    const documentsStore = useCollectionDocumentsStore();

    let documentList = reactive<object[]>([]);
    
    if(props.showSearchedData) {
        documentList = props.searchedData;
    }
    else {
        const documents = documentsStore.collectionDocuments.filter(x => x.collectionName == `${props.dbName}.${props.collectionName}`)[0]?.CollectionDocuments;

        if(documents != null && documents.length > 0) {
            documentList = documents;
        }
    }
</script>