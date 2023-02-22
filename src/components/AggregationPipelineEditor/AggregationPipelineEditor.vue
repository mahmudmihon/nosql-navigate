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
                    <n-checkbox
                        size="large"
                        v-model:checked="stage.shouldApply"
                        @update:checked="parseAndTriggerAggregation"
                    >
                    </n-checkbox>

                    <div class="w-full">
                        <JSONView :editor-value="JSON.parse(stage.query)" />
                    </div>
                </div>
            </div>
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
                    <n-select
                        size="small"
                        v-model:value="lookUpModel.from"
                        filterable
                        :options="AggregationBuilderService.getOtherCollectionNames(props.dbName, props.collectionName)"
                        :render-option="NaiveUiService.renderOption"
                        :placeholder="'From'"
                        @update:value="handleForeignCollectionSelect"
                    />

                    <n-select
                        size="small"
                        v-model:value="lookUpModel.foreignField"
                        filterable
                        :options="foreignFields"
                        :render-option="NaiveUiService.renderOption"
                        :placeholder="'Foreign Field'"
                    />
                </div>

                <div class="flex gap-2 mt-2">
                    <n-select
                        size="small"
                        v-model:value="lookUpModel.localField"
                        filterable
                        :options="foreignFields"
                        :render-option="NaiveUiService.renderOption"
                        :placeholder="'From'"
                    />

                    <n-input
                        size="small"
                        v-model:value="lookUpModel.as"
                        :placeholder="'As'"
                    />
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
    import { NModal, NSelect, NCheckbox, NInput } from 'naive-ui';
    import { AggregationBuilderService } from '../../services/aggregation-builder-service';
    import { NaiveUiService } from '../../services/naive-ui-service';
    import { StageQuery } from '../../types/AggregationBuilder/stage-query';
    import { SelectMixedOption, SelectOption } from 'naive-ui/es/select/src/interface';
    import { LookupModel } from './Models/ViewModels';
    import VueJsoneditor from 'vue3-ts-jsoneditor';
    import JSONView from '../Editor/JSONView.vue';

    const props = defineProps<{
        dbName: string
        collectionName: string
        documentsCount: number
    }>();

    const emit = defineEmits<{
        (e: 'triggerAggregation', pipelines: string[]): void
    }>();

    const pipelineStage = ref<string>();
    const stageQuery = ref<string>('');
    const showEditorModal = ref<boolean>(false);
    const stagesQuery = reactive<StageQuery[]>([]);
    const showLookupSection = ref<boolean>(false);
    let foreignFields = ref<SelectMixedOption[]>([]);
    const lookUpModel = reactive<LookupModel>({
        from: '',
        foreignField: '',
        localField: '',
        as: ''
    });

    const triggerPipelineEditorModal = () => {
        showEditorModal.value = true
    }

    const handleStageSelect = (value: string, option: SelectOption) => {
        if(pipelineStage.value == '$lookup') {
            showLookupSection.value = true;

            return;
        }

        const selectedStageOutput = AggregationBuilderService.populateSelectedStageOutput(pipelineStage.value ?? "");
        stageQuery.value = JSON.stringify(selectedStageOutput, null, 2);
    }

    const handleForeignCollectionSelect = async (value: string, option: SelectOption) => {
        foreignFields.value = await AggregationBuilderService.getForeignFields(props.dbName, lookUpModel.from);

        console.log(foreignFields.value);
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

        emit('triggerAggregation', pipelines);
    }
</script>