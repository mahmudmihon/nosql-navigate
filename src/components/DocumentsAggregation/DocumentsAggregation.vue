<template>
    <div class="flex flex-col">
        <div class="h-64">
            <AggregationPipelineEditorVue
                :db-name="props.dbName"
                :collection-name="props.collectionName"
                :documents-count="0"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import AggregationPipelineEditorVue from '../AggregationPipelineEditor/AggregationPipelineEditor.vue';

    const props = defineProps<{
        dbName: string
        collectionName: string
    }>();
</script>