<template>
    <n-tabs type="segment" size="small" :bar-width="28">
        <n-tab-pane name="documents" tab="Documents">
            <DocumentsCRUDVue
                :db-name="props.dbName"
                :collection-name="props.collectionName"
            />
        </n-tab-pane>
        <n-tab-pane name="aggregation" tab="Aggregation">
            <DocumentsAggregationVue
                :db-name="props.dbName"
                :collection-name="props.collectionName"
            />
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
    import { NTabs, NTabPane } from 'naive-ui';
    import DocumentsCRUDVue from '../DocumentsCRUD/DocumentsCRUD.vue';
    import DocumentsAggregationVue from '../DocumentsAggregation/DocumentsAggregation.vue';

    const props = defineProps<{
        dbName: string
        collectionName: string
    }>();
</script>