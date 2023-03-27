<template>
    <div class="flex flex-col flex-nowrap mt-3">
        <div class="flex flex-row">
            <div class="w-12">
                <div class="flex flex-col">
                    <span class="hover:cursor-pointer" @click="triggerPipelineEditorModal">
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V10.8125V8.625M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 12L8 14L10 16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14 12L16 14L14 16" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </div>
            </div>

            <div v-if="componentState.stagesQuery.length > 0" class="w-full flex flex-col gap-3 h-60 overflow-y-auto">
                <div v-for="(stage, index) in componentState.stagesQuery" :key="index" class="flex gap-2">
                    <div class="flex flex-col items-center">
                        <n-checkbox
                            size="large"
                            v-model:checked="stage.shouldApply"
                            @update:checked="parseAndTriggerAggregation"
                        >
                        </n-checkbox>

                        <svg @click="removeAggregationStage(index)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mt-2 text-red-500 hover:cursor-pointer">
                            <path fill-rule="evenodd"
                                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>

                    <div class="w-full">
                        <JSONView :editor-value="JSON.parse(stage.query)" />
                    </div>
                </div>
            </div>
        </div>

        <div v-if="componentState.showSummarySection" class="flex justify-end px-3 py-2 text-white rounded-lg bg-base mt-3 mb-3">
            <div v-if="componentState.dataExporting" class="mr-4">
                <n-tag size="small" round :bordered="false" type="success">
                    Exporting
                </n-tag>
            </div>

            <span class="hover:cursor-pointer hover:text-blue-400" title="Export Collection" @click="exportAggregationResult">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-2 mr-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
            </span>
        </div>
    </div>

    <n-modal
        v-model:show="componentState.showEditorModal"
        class="rounded-xl"
        preset="card"
        style="width: 50%;
        background-color: #313131;
        border: #313131;"
        :bordered="true"
        size="medium"
    >
        <div class="mb-6 overflow-y-auto">
            <div>
                <n-select
                    size="small"
                    v-model:value="componentState.pipelineStage"
                    filterable
                    :options="AggregationBuilderService.pipelineStages"
                    :render-option="NaiveUiService.renderOption"
                    :placeholder="'Select Stage'"
                    @update:value="handleStageSelect"
                />
            </div>

            <div v-if="componentState.showLookupSection" class="mt-3">
                <div class="flex gap-2">
                    <div class="grow flex-col">
                        <p class="text-xs mb-1">From</p>
                        <n-select
                            size="small"
                            v-model:value="componentState.lookUpModel.from"
                            filterable
                            :options="AggregationBuilderService.getOtherCollectionNames(props.dbName, props.collectionName)"
                            :render-option="NaiveUiService.renderOption"
                            @update:value="handleForeignCollectionSelect"
                        />
                    </div>

                    <div class="grow flex-col">
                        <p class="text-xs mb-1">Foreign Field</p>
                        <n-select
                            size="small"
                            v-model:value="componentState.lookUpModel.foreignField"
                            filterable
                            :options="componentState.foreignFields"
                            :render-option="NaiveUiService.renderOption"
                        />
                    </div>
                </div>

                <div class="flex basis-0 gap-2 mt-2">
                    <div class="grow flex-col">
                        <p class="text-xs mb-1">Local Field</p>
                        <n-select
                            size="small"
                            v-model:value="componentState.lookUpModel.localField"
                            filterable
                            :options="componentState.localFields"
                            :render-option="NaiveUiService.renderOption"
                        />
                    </div>

                    <div class="grow flex-col">
                        <p class="text-xs mb-1">As</p>
                        <n-input
                            size="small"
                            v-model:value="componentState.lookUpModel.as"
                        />
                    </div>
                </div>

                <div class="flex justify-end mt-2 gap-2">
                    <button class="bg-[#4bb153] text-white rounded-lg py-[2px] px-4" @click="populateLookupQuery">
                        Done
                    </button>
                </div>
            </div>

            <div v-if="componentState.showProjectSection" class="mt-3">
                <div class="flex flex-col">
                    <p class="text-xs mb-1">Fields</p>
                    <n-select
                        size="small"
                        v-model:value="componentState.projectedFields"
                        filterable
                        multiple
                        :options="componentState.localFields"
                        :render-option="NaiveUiService.renderOption"
                    />
                </div>

                <div class="flex justify-end mt-2 gap-2">
                    <button class="bg-[#4bb153] text-white rounded-lg py-[2px] px-4" @click="populateProjectQuery">
                        Done
                    </button>
                </div>
            </div>

            <div v-if="componentState.showUnsetSection" class="mt-3">
                <div class="flex flex-col">
                    <p class="text-xs mb-1">Fields</p>
                    <n-select
                        size="small"
                        v-model:value="componentState.unsetFields"
                        filterable
                        multiple
                        :options="componentState.localFields"
                        :render-option="NaiveUiService.renderOption"
                    />
                </div>

                <div class="flex justify-end mt-2 gap-2">
                    <button class="bg-[#4bb153] text-white rounded-lg py-[2px] px-4" @click="populateUnsetQuery">
                        Done
                    </button>
                </div>
            </div>

            <div v-if="componentState.showUnwindSection" class="mt-3">
                <div class="flex flex-col gap-2">
                    <p class="text-xs mb-1">Field</p>
                    <n-select
                        size="small"
                        v-model:value="componentState.unwindModel.field"
                        filterable
                        :options="componentState.localFields"
                        :render-option="NaiveUiService.renderOption"
                        :placeholder="'Select Field'"
                    />

                    <n-checkbox v-model:checked="componentState.unwindModel.preserveNullAndEmptyArrays">
                        Preserve Null & Empty Arrays
                    </n-checkbox>

                    <n-checkbox v-model:checked="componentState.unwindModel.includeArrayIndex">
                        Include Array Index
                    </n-checkbox>
                </div>

                <div class="flex justify-end mt-2 gap-2">
                    <button class="bg-[#4bb153] text-white rounded-lg py-[2px] px-4" @click="populateunwindQuery">
                        Done
                    </button>
                </div>
            </div>

            <div class="mt-3">
                <vue-jsoneditor
                    mode="text"
                    v-model:text="componentState.stageQuery"
                    :mainMenuBar="false"
                    :navigationBar="false"
                    :statusBar="false"
                    :darkTheme="true"
                    :height="350"
                />
            </div>
        </div>

        <div class="flex justify-end mt-3 gap-2">
            <button class="bg-[#4bb153] text-white rounded-lg py-[3px] px-6" @click="addStageQuery">
                Add
            </button>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
    import { reactive } from 'vue';
    import { NModal, NSelect, NCheckbox, NInput, NTag, useNotification } from 'naive-ui';
    import { AggregationBuilderService } from '../../services/aggregation-builder-service';
    import { NaiveUiService } from '../../services/naive-ui-service';
    import { SelectOption } from 'naive-ui/es/select/src/interface';
    import { ComponentStateModel } from './Models/ViewModels';
    import { AggregationPipelines } from '../../types/AggregationBuilder/aggregation-pipelines';
    import { useTabDataStore } from '../../stores/tab-data';
    import { useDocumentFieldsStore } from '../../stores/document-fields';
    import { save } from '@tauri-apps/api/dialog';
    import { invoke } from '@tauri-apps/api';
    import VueJsoneditor from 'vue3-ts-jsoneditor';
    import JSONView from '../JsonViewer/JSONView.vue';

    const props = defineProps<{
        dbName: string
        collectionName: string
        tabStoreKey: string
    }>();

    const emit = defineEmits<{
        (e: 'triggerAggregation', data: AggregationPipelines): void
    }>();

    const notification = useNotification();
    const globalFieldsStore = useDocumentFieldsStore();
    const tabsDataStore = useTabDataStore();

    const componentState: ComponentStateModel = reactive({
        pipelineStage: '',
        stageQuery: '',
        dataExporting: false,
        showSummarySection: false,
        showEditorModal: false,
        showLookupSection: false,
        showProjectSection: false,
        showUnsetSection: false,
        showUnwindSection: false,
        projectedFields: [],
        unsetFields: [],
        stagesQuery: [],
        foreignFields: [],
        localFields: [],
        lookUpModel: {
            from: '',
            foreignField: '',
            localField: '',
            as: ''
        },
        unwindModel: {
            field: '',
            includeArrayIndex: false,
            preserveNullAndEmptyArrays: false
        }
    });

    const updateLocalFieldsAndSummary = (fromLocalStore: boolean): void => {
        let fields: string[] = [];

        if(fromLocalStore) {
            const resultData = tabsDataStore.tabsData.filter(x => x.storeKey == props.tabStoreKey)[0];

            if(resultData != null) {
                fields = resultData.aggregationResultFields;

                if(resultData.aggregationDocumentsCount > 0) {
                    componentState.showSummarySection = true;
                }
            }
        }
        else {
            fields = globalFieldsStore.fieldsList.filter(x => x.documentOf == `${props.dbName}.${props.collectionName}`)[0]?.documentFields;
        }

        if(fields?.length > 0) {
            componentState.localFields = AggregationBuilderService.convertObjectKeysToSelectOptions(fields);
        }
    }

    updateLocalFieldsAndSummary(false);

    const triggerPipelineEditorModal = (): void => {
        componentState.showEditorModal = true
    }

    const handleStageSelect = (value: string, option: SelectOption) => {
        if(componentState.pipelineStage == '$lookup') {
            componentState.showLookupSection = true;
            componentState.showProjectSection = false;
            componentState.showUnwindSection = false;
            componentState.showUnsetSection = false;

            return;
        }
        else if(componentState.pipelineStage == '$project') {
            componentState.showProjectSection = true;
            componentState.showLookupSection = false;
            componentState.showUnwindSection = false;
            componentState.showUnsetSection = false;

            return;
        }
        else if(componentState.pipelineStage == '$unset') {
            componentState.showUnsetSection = true;
            componentState.showProjectSection = false;
            componentState.showLookupSection = false;
            componentState.showUnwindSection = false;

            return;
        }
        else if(componentState.pipelineStage == '$unwind') {
            componentState.showUnwindSection = true;
            componentState.showProjectSection = false;
            componentState.showLookupSection = false;
            componentState.showUnsetSection = false;

            return;
        }

        const selectedStageOutput = AggregationBuilderService.populateSelectedStageOutput(componentState.pipelineStage ?? "", {});
        componentState.stageQuery = JSON.stringify(selectedStageOutput, null, 2);
    }

    const handleForeignCollectionSelect = async (value: string, option: SelectOption) => {
        componentState.foreignFields = await AggregationBuilderService.getForeignFields(props.dbName, componentState.lookUpModel.from);
    }

    const populateLookupQuery = (): void => {
        const selectedStageOutput = AggregationBuilderService.populateSelectedStageOutput(componentState.pipelineStage ?? "", componentState.lookUpModel);

        componentState.stageQuery = JSON.stringify(selectedStageOutput, null, 2);
    }

    const populateunwindQuery = (): void => {
        const selectedStageOutput = AggregationBuilderService.populateSelectedStageOutput(componentState.pipelineStage ?? "", componentState.unwindModel);

        componentState.stageQuery = JSON.stringify(selectedStageOutput, null, 2);
    }

    const populateProjectQuery = (): void => {
        let fieldsToProject = {};

        if(componentState.projectedFields.length > 0) {
            componentState.projectedFields.forEach(x => {fieldsToProject[x]=1});
        }

        const selectedStageOutput = AggregationBuilderService.populateSelectedStageOutput(componentState.pipelineStage ?? "", fieldsToProject);

        componentState.stageQuery = JSON.stringify(selectedStageOutput, null, 2);
    }

    const populateUnsetQuery = (): void => {
        let fieldsToUnset = {};

        fieldsToUnset["fields"] = componentState.unsetFields;

        const selectedStageOutput = AggregationBuilderService.populateSelectedStageOutput(componentState.pipelineStage ?? "", fieldsToUnset);

        componentState.stageQuery = JSON.stringify(selectedStageOutput, null, 2);
    }

    const addStageQuery = () => {
        const parsedQuery = JSON.parse(componentState.stageQuery);

        if(Object.keys(parsedQuery).length > 0) {
            componentState.stagesQuery.push({ shouldApply: false, query: componentState.stageQuery });

            componentState.stageQuery = '';
            componentState.showEditorModal = false;
        }
    }

    const parseAndTriggerAggregation = (): void => {
        const shouldApplyStages = componentState.stagesQuery.filter(x => x.shouldApply);

        const pipelines = shouldApplyStages.map(x => {return x.query});

        componentState.showSummarySection = false;

        emit('triggerAggregation', { pipelines });
    }

    const removeAggregationStage = (index: number): void => {
        componentState.stagesQuery.splice(index, 1);

        parseAndTriggerAggregation();
    }

    const exportAggregationResult = async () => {
        const filePath = await save({
            filters: [{
                name: 'json',
                extensions: ['json']
            }],
            defaultPath: `${props.collectionName}-aggregation`
        });

        if (filePath != null) {
            const shouldApplyStages = componentState.stagesQuery.filter(x => x.shouldApply);

            const pipelines = shouldApplyStages.map(x => { return x.query });

            invoke('export_aggregation_result', { dbName: props.dbName, collectionName: props.collectionName, aggregations: pipelines, path: filePath }).then(value => {
                if (value != 'error') {
                    notification.success({ title: "Result exported." });
                }

                componentState.dataExporting = false;
            });
        }
    }

    tabsDataStore.$subscribe((mutation, state) => {
        updateLocalFieldsAndSummary(true);
    });
</script>