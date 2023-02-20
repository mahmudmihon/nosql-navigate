<template>
    <div class="flex flex-col">
        <div class="h-64">
            <AggregationPipelineEditorVue
                @trigger-aggregation="triggerAggregation"
                :db-name="props.dbName"
                :collection-name="props.collectionName"
                :documents-count="0"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { invoke } from '@tauri-apps/api';
    import AggregationPipelineEditorVue from '../AggregationPipelineEditor/AggregationPipelineEditor.vue';

    const props = defineProps<{
        dbName: string
        collectionName: string
    }>();

    const triggerAggregation = (pipelines: string[]) => {
        invoke('documents_aggregation', { dbName: props.dbName, collectionName: props.collectionName, aggregations: pipelines }).then(value => {
            console.log(value);
        });
    }
</script>