<template>
    <div class="flex flex-col">
        <div class="h-64">
            <AggregationPipelineEditor
                @trigger-aggregation="triggerAggregation"
                :db-name="props.dbName"
                :collection-name="props.collectionName"
                :documents-count="0"
            />
        </div>

        <div v-if="aggregationDataLoading" class="mt-1">
            <GenericSkeleton />
        </div>
        <div v-else class="h-screen overflow-y-auto mb-1">
            <AggregationResult
                :key="documentListKey"
                :document-list="aggregationData"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { invoke } from '@tauri-apps/api';
    import { reactive, ref } from 'vue';
    import { v4 as uid } from 'uuid';
    import AggregationPipelineEditor from '../AggregationPipelineEditor/AggregationPipelineEditor.vue';
    import AggregationResult from '../AggregationResult/AggregationResult.vue';
    import GenericSkeleton from '../Common/GenericSkeleton.vue';

    const props = defineProps<{
        dbName: string
        collectionName: string
    }>();

    let aggregationDataLoading = ref<boolean>(false);
    let documentListKey = ref<string>(uid());
    let aggregationData = reactive<object[]>([]);

    const triggerAggregation = (pipelines: string[]) => {
        if(pipelines.length > 0) {
            aggregationDataLoading.value = true;

            invoke('documents_aggregation', { dbName: props.dbName, collectionName: props.collectionName, aggregations: pipelines }).then(value => {
                if(value != 'error') {
                    aggregationData = value as object[];                    
                }

                aggregationDataLoading.value = false;
            });
        }
        else {
            aggregationData = [];
        }
               
        documentListKey.value = uid();
    }
</script>