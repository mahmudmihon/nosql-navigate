<template>
    <div class="flex flex-col">
        <div class="h-80">
            <AggregationPipelineEditor
                @trigger-aggregation="triggerAggregation"
                :db-name="props.dbName"
                :collection-name="props.collectionName"
                :tab-store-key="props.tabStoreKey"
            />
        </div>

        <div v-if="componentState.aggregationDataLoading" class="mt-1">
            <GenericSkeleton />
        </div>
        <div v-else class="max-h-[calc(100vh-420px)] overflow-y-auto mb-1">
            <AggregationResult
                :document-list="componentState.aggregationData"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { invoke } from '@tauri-apps/api';
    import { reactive } from 'vue';
    import { AggregationPipelines } from '../../types/AggregationBuilder/aggregation-pipelines';
    import { useTabDataStore } from '../../stores/tab-data';
    import { EJSONService } from '../../services/ejson-service';
    import { clearObjectKeys, extractObjectKeys } from '../../utilities/object-keys';
    import { useNotification } from 'naive-ui';
    import { CommonConsts } from '../../utilities/common-consts';
    import { ComponentStateModel } from './Models/ViewModels';
    import AggregationPipelineEditor from '../AggregationPipelineEditor/AggregationPipelineEditor.vue';
    import AggregationResult from '../AggregationResult/AggregationResult.vue';
    import GenericSkeleton from '../Common/GenericSkeleton.vue';

    const props = defineProps<{
        dbName: string
        collectionName: string
        tabStoreKey: string
    }>();

    const tabsDataStore = useTabDataStore();
    const notification = useNotification();

    const componentState: ComponentStateModel = reactive({
        aggregationDataLoading: false,
        aggregationData: []
    });

    const triggerAggregation = (data: AggregationPipelines) => {
        if(data.pipelines.length > 0) {
            componentState.aggregationDataLoading = true;

            invoke('documents_aggregation', { dbName: props.dbName, collectionName: props.collectionName, aggregations: data.pipelines, limit: CommonConsts.defaultAggregationPageSize }).then((value: any) => {

                if(value != 'error') {
                    componentState.aggregationData = value.map(x => EJSONService.BsonDocToObject(x));

                    if(componentState.aggregationData.length > 0) {
                        const firstData = componentState.aggregationData[0];

                        const fields = extractObjectKeys(firstData).sort();

                        clearObjectKeys();

                        updateTabStoreData(fields);
                    }
                }

                componentState.aggregationDataLoading = false;
            }).catch(e => {
                notification.error({ title: "Error occured while running the pipeline." });

                componentState.aggregationDataLoading = false;
            });
        }
        else {
            componentState.aggregationData = [];

            updateTabStoreData([]);
        }
    }

    const updateTabStoreData = (fields: any[]): void => {
        let existingData = tabsDataStore.tabsData.filter(x => x.storeKey == props.tabStoreKey)[0];

        if(existingData != null) {
            existingData = {
                ...existingData,
                aggregationResultFields: fields,
                aggregationDocumentsCount: componentState.aggregationData.length,
                isExporting: false
            }
        }
        else {
            existingData = {
                storeKey: props.tabStoreKey,
                documentsCount: 0,
                aggregationResultFields: fields,
                aggregationDocumentsCount: componentState.aggregationData.length,
                isExporting: false
            }
        }

        tabsDataStore.upsertData(existingData);
    }
</script>