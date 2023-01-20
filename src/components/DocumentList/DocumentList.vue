<template>
    <div v-for="(document, index) in documentList" :key="index" class="mb-2">
        <JSONEditorVue
            :height="'50'"
            :mode="'text'"
            :editor-value="JSON.stringify(document)"
            :read-only="true"
            :mainMenuBar="false"
            :navigation-bar="false"
            :status-bar="false"
            :dark-theme="true"
        />
    </div>
</template>

<script setup lang="ts">
    import { reactive } from 'vue';
    import { useCollectionDocumentsStore } from '../../stores/collection-documents';
    import JSONEditorVue from '../Editor/JSONEditor.vue';

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
        documentList = documentsStore.collectionDocuments.filter(x => x.collectionName == `${props.dbName}.${props.collectionName}`)[0]?.CollectionDocuments as object[];
    }
</script>