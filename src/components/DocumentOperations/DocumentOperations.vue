<template>
    <n-tabs type="segment" size="small" :bar-width="28">
        <n-tab-pane name="documents" tab="Documents">
            <DocumentsCRUD
                :key="props.tabStoreKey"
                :db-name="props.dbName"
                :collection-name="props.collectionName"
                :tab-store-key="props.tabStoreKey"
            />
        </n-tab-pane>
        <n-tab-pane name="aggregation" tab="Aggregation">
            <DocumentsAggregation
                :key="props.tabStoreKey"
                :db-name="props.dbName"
                :collection-name="props.collectionName"
                :tab-store-key="props.tabStoreKey"
            />
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
    import { NTabs, NTabPane } from 'naive-ui';
    import DocumentsCRUD from '../DocumentsCRUD/DocumentsCRUD.vue';
    import DocumentsAggregation from '../DocumentsAggregation/DocumentsAggregation.vue';

    const props = defineProps<{
        dbName: string
        collectionName: string
        tabStoreKey: string
    }>();
</script>