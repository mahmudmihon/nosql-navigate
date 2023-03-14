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

            <div v-if="stagesQuery.length > 0" class="w-full flex flex-col gap-3 h-60 overflow-y-auto">
                <div v-for="(stage, index) in stagesQuery" :key="index" class="flex gap-2">
                    <div class="flex flex-col items-center">
                        <n-checkbox
                            size="large"
                            v-model:checked="stage.shouldApply"
                            @update:checked="parseAndTriggerAggregation"
                        >
                        </n-checkbox>

                        <svg @click="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mt-2 text-red-500 hover:cursor-pointer">
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

        <div v-if="showSummarySection" class="flex justify-end px-3 py-2 text-white rounded-lg bg-base mt-3 mb-3">
            <div v-if="dataExporting" class="mr-4">
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
        v-model:show="showEditorModal"
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
                    v-model:value="pipelineStage"
                    filterable
                    :options="AggregationBuilderService.pipelineStages"
                    :render-option="NaiveUiService.renderOption"
                    :placeholder="'Select Stage'"
                    @update:value="handleStageSelect"
                />
            </div>

            <div v-if="showLookupSection" class="mt-3">
                <div class="flex gap-2">
                    <div class="grow flex-col">
                        <p class="text-xs mb-1">From</p>
                        <n-select
                            size="small"
                            v-model:value="lookUpModel.from"
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
                            v-model:value="lookUpModel.foreignField"
                            filterable
                            :options="foreignFields"
                            :render-option="NaiveUiService.renderOption"
                        />
                    </div>                   
                </div>

                <div class="flex basis-0 gap-2 mt-2">
                    <div class="grow flex-col">
                        <p class="text-xs mb-1">Local Field</p>
                        <n-select
                            size="small"
                            v-model:value="lookUpModel.localField"
                            filterable
                            :options="localFields"
                            :render-option="NaiveUiService.renderOption"
                        />
                    </div>

                    <div class="grow flex-col">
                        <p class="text-xs mb-1">As</p>
                        <n-input
                            size="small"
                            v-model:value="lookUpModel.as"
                        />
                    </div>                   
                </div>

                <div class="flex justify-end mt-2 gap-2">
                    <button class="bg-[#4bb153] text-white rounded-lg py-[2px] px-4" @click="populateLookupQuery">
                        Done
                    </button>
                </div>
            </div>

            <div v-if="showProjectSection" class="mt-3">
                <div class="flex flex-col">
                    <p class="text-xs mb-1">Fields</p>
                    <n-select
                        size="small"
                        v-model:value="projectedFields"
                        filterable
                        multiple
                        :options="localFields"
                        :render-option="NaiveUiService.renderOption"
                    />                
                </div>

                <div class="flex justify-end mt-2 gap-2">
                    <button class="bg-[#4bb153] text-white rounded-lg py-[2px] px-4" @click="populateProjectQuery">
                        Done
                    </button>
                </div>
            </div>

            <div v-if="showUnsetSection" class="mt-3">
                <div class="flex flex-col">
                    <p class="text-xs mb-1">Fields</p>
                    <n-select
                        size="small"
                        v-model:value="unsetFields"
                        filterable
                        multiple
                        :options="localFields"
                        :render-option="NaiveUiService.renderOption"
                    />
                </div>

                <div class="flex justify-end mt-2 gap-2">
                    <button class="bg-[#4bb153] text-white rounded-lg py-[2px] px-4" @click="populateUnsetQuery">
                        Done
                    </button>
                </div>
            </div>

            <div v-if="showUnwindSection" class="mt-3">
                <div class="flex flex-col gap-2">
                    <p class="text-xs mb-1">Field</p>
                    <n-select
                        size="small"
                        v-model:value="unwindModel.field"
                        filterable
                        :options="localFields"
                        :render-option="NaiveUiService.renderOption"
                        :placeholder="'Select Field'"
                    />

                    <n-checkbox v-model:checked="unwindModel.preserveNullAndEmptyArrays">
                        Preserve Null & Empty Arrays
                    </n-checkbox>

                    <n-checkbox v-model:checked="unwindModel.includeArrayIndex">
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
                    v-model:text="stageQuery"
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
    import { reactive, ref } from 'vue';
    import { NModal, NSelect, NCheckbox, NInput, NTag, useNotification } from 'naive-ui';
    import { AggregationBuilderService } from '../../services/aggregation-builder-service';
    import { NaiveUiService } from '../../services/naive-ui-service';
    import { StageQuery } from '../../types/AggregationBuilder/stage-query';
    import { SelectMixedOption, SelectOption } from 'naive-ui/es/select/src/interface';
    import { LookupModel, UnwindModel } from './Models/ViewModels';
    import { v4 as uid } from 'uuid';
    import { AggregationPipelines } from '../../types/AggregationBuilder/aggregation-pipelines';
    import { useAggregationResultStore } from '../../stores/aggregation-result';
    import { useDocumentFieldsStore } from '../../stores/document-fields';
    import { save } from '@tauri-apps/api/dialog';
    import { invoke } from '@tauri-apps/api';
    import VueJsoneditor from 'vue3-ts-jsoneditor';
    import JSONView from '../Editor/JSONView.vue';

    let foreignFields = ref<SelectMixedOption[]>([]);
    let localFields = ref<SelectMixedOption[]>([]);

    const props = defineProps<{
        dbName: string
        collectionName: string
        documentsCount: number
    }>();

    const emit = defineEmits<{
        (e: 'triggerAggregation', data: AggregationPipelines): void
    }>();

    const notification = useNotification();
    const globalFieldsStore = useDocumentFieldsStore();
    const aggregationResultStore = useAggregationResultStore();
    const idToStoreFieldsData = uid();
    const pipelineStage = ref<string>();
    const stageQuery = ref<string>('');
    const dataExporting = ref<boolean>(false);
    const showSummarySection = ref<boolean>(false);
    const showEditorModal = ref<boolean>(false);
    const stagesQuery = reactive<StageQuery[]>([]);
    const showLookupSection = ref<boolean>(false);
    const showProjectSection = ref<boolean>(false);
    const showUnsetSection = ref<boolean>(false);
    const showUnwindSection = ref<boolean>(false);
    const projectedFields = ref<string[]>([]);
    const unsetFields = ref<string[]>([]);
    const lookUpModel = reactive<LookupModel>({
        from: '',
        foreignField: '',
        localField: '',
        as: ''
    });
    const unwindModel = reactive<UnwindModel>({
        field: '',
        includeArrayIndex: false,
        preserveNullAndEmptyArrays: false
    });

    const updateLocalFieldsAndSummary = (fromLocalStore: boolean): void => {
        let fields: string[] = [];

        if(fromLocalStore) {
            const resultData = aggregationResultStore.aggregationResult.filter(x => x.storeId == idToStoreFieldsData)[0];

            if(resultData != null) {
                fields = resultData.fields;

                if(resultData.numberOfDocuments > 0) {
                    showSummarySection.value = true;
                }
            }
        }
        else {
            fields = globalFieldsStore.fieldsList.filter(x => x.documentOf == `${props.dbName}.${props.collectionName}`)[0]?.documentFields;
        }

        if(fields?.length > 0) {
            localFields.value = AggregationBuilderService.convertObjectKeysToSelectOptions(fields);
        }
    }

    updateLocalFieldsAndSummary(false);

    const triggerPipelineEditorModal = (): void => {
        showEditorModal.value = true
    }

    const handleStageSelect = (value: string, option: SelectOption) => {
        if(pipelineStage.value == '$lookup') {
            showLookupSection.value = true;
            showProjectSection.value = false;
            showUnwindSection.value = false;
            showUnsetSection.value = false;

            return;
        }
        else if(pipelineStage.value == '$project') {
            showProjectSection.value = true;
            showLookupSection.value = false;
            showUnwindSection.value = false;
            showUnsetSection.value = false;

            return;
        }
        else if(pipelineStage.value == '$unset') {
            showUnsetSection.value = true;
            showProjectSection.value = false;
            showLookupSection.value = false;
            showUnwindSection.value = false;

            return;
        }
        else if(pipelineStage.value == '$unwind') {
            showUnwindSection.value = true;
            showProjectSection.value = false;
            showLookupSection.value = false;
            showUnsetSection.value = false;

            return;
        }

        const selectedStageOutput = AggregationBuilderService.populateSelectedStageOutput(pipelineStage.value ?? "", {});
        stageQuery.value = JSON.stringify(selectedStageOutput, null, 2);
    }

    const handleForeignCollectionSelect = async (value: string, option: SelectOption) => {
        foreignFields.value = await AggregationBuilderService.getForeignFields(props.dbName, lookUpModel.from);
    }

    const populateLookupQuery = (): void => {
        const selectedStageOutput = AggregationBuilderService.populateSelectedStageOutput(pipelineStage.value ?? "", lookUpModel);

        stageQuery.value = JSON.stringify(selectedStageOutput, null, 2);
    }

    const populateunwindQuery = (): void => {
        const selectedStageOutput = AggregationBuilderService.populateSelectedStageOutput(pipelineStage.value ?? "", unwindModel);

        stageQuery.value = JSON.stringify(selectedStageOutput, null, 2);
    }

    const populateProjectQuery = (): void => {
        let fieldsToProject = {};

        if(projectedFields.value.length > 0) {
            projectedFields.value.forEach(x => {fieldsToProject[x]=1});
        }

        const selectedStageOutput = AggregationBuilderService.populateSelectedStageOutput(pipelineStage.value ?? "", fieldsToProject);

        stageQuery.value = JSON.stringify(selectedStageOutput, null, 2);
    }

    const populateUnsetQuery = (): void => {
        let fieldsToUnset = {};

        fieldsToUnset["fields"] = unsetFields.value;

        const selectedStageOutput = AggregationBuilderService.populateSelectedStageOutput(pipelineStage.value ?? "", fieldsToUnset);

        stageQuery.value = JSON.stringify(selectedStageOutput, null, 2);
    }

    const addStageQuery = () => {
        const parsedQuery = JSON.parse(stageQuery.value);

        if(Object.keys(parsedQuery).length > 0) {
            stagesQuery.push({ shouldApply: false, query: stageQuery.value });

            stageQuery.value = '';
            showEditorModal.value = false;
        }
    }

    const parseAndTriggerAggregation = () => {
        const shouldApplyStages = stagesQuery.filter(x => x.shouldApply);

        const pipelines = shouldApplyStages.map(x => {return x.query});

        showSummarySection.value = false;

        emit('triggerAggregation', { idToStoreData: idToStoreFieldsData, pipelines });
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
            const shouldApplyStages = stagesQuery.filter(x => x.shouldApply);

            const pipelines = shouldApplyStages.map(x => { return x.query });

            invoke('export_aggregation_result', { dbName: props.dbName, collectionName: props.collectionName, aggregations: pipelines, path: filePath }).then(value => {
                if (value != 'error') {
                    notification.success({ title: "Result exported." });
                }

                dataExporting.value = false;
            });
        }
    }

    aggregationResultStore.$subscribe((mutation, state) => {
        updateLocalFieldsAndSummary(true);
    });
</script>