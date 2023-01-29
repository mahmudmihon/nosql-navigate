<template>
    <div class="flex flex-col flex-nowrap mt-4">
        <div class="flex flex-row">
            <div class="filter-switch w-32">
                <n-switch v-model:value="simpleFiltering">
                    <template #checked>
                        Simple
                    </template>
                    <template #unchecked>
                        Advance
                    </template>
                </n-switch>
            </div>

            <div class="document-filtering w-full">
                <div v-if="simpleFiltering" class="flex flex-col gap-2 h-24 overflow-y-auto">
                    <div v-for="(filterModel, index) in multipleFilters" :key="index" class="flex gap-2">
                        <div>
                            <n-checkbox size="large" v-model:checked="filterModel.shouldApply"></n-checkbox>
                        </div>

                        <div>
                            <n-select size="small" v-model:value="filterModel.field" filterable :options="documentFields" :render-option="renderOption" :placeholder="'Field'" />
                        </div>

                        <div class="w-48">
                            <n-select size="small" v-model:value="filterModel.filterType" :options="DocumentFiltering.filterTypes" :render-option="renderOption" :placeholder="'Fiter type'" />
                        </div>

                        <div class="w-full flex pr-1">
                            <n-input-group>
                                <!-- <n-select size="small" v-model:value="filterModel.dataType" :style="{ width: '20%' }" :options="dataTypes" :placeholder="'Data type'" /> -->
                                <n-input size="small" v-model:value="filterModel.value" type="text" :placeholder="'Value'" />
                            </n-input-group>

                            <svg v-if="simpleFiltering && index == 0" @click="addNewFilter" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 ml-1 text-green-400 hover:cursor-pointer">
                                <path fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                                    clip-rule="evenodd" />
                            </svg>

                            <svg v-if="index != 0" @click="removeFilter(index)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 ml-1 text-red-600 hover:cursor-pointer">
                                <path fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div v-if="!simpleFiltering" class="flex">
                    <div class="w-full h-24 overflow-y-auto">
                        <vue-jsoneditor                   
                            height="50"
                            mode="text"
                            v-model:text="rawQuery"
                            :mainMenuBar="false"
                            :navigationBar="false"
                            :statusBar="false"
                            :darkTheme="true"
                        />
                    </div>

                    <div class="w-8" title="Import simple filters">                     
                        <svg @click="importFiltersFromSimpleBuilder" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-green-400 ml-1 hover:cursor-pointer">
                            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="flex justify-center w-8">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-blue-400 ml-1 hover:cursor-pointer" @click="searchDocuments">
                    <path d="M8.25 10.875a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z" />
                    <path fill-rule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.125 4.5a4.125 4.125 0 102.338 7.524l2.007 2.006a.75.75 0 101.06-1.06l-2.006-2.007a4.125 4.125 0 00-3.399-6.463z"
                        clip-rule="evenodd" />
                </svg>
            </div>
        </div>

        <div class="flex justify-end px-3 py-2 text-white rounded-lg bg-base mt-3 mb-3">
            <div class="max-w-[47%]">
                <n-pagination v-model:page="pageNumber" :page-size="50" :page-count="totalPage" show-quick-jumper size="small" :on-update:page="updateDocumentListOnPageNumberChange">
                    <template #goto>
                        Go
                    </template>
                </n-pagination>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, VNode, h, reactive } from 'vue';
    import { useDocumentFieldsStore } from '../../stores/document-fields';
    import { DocumentFields } from '../../types/DocumentFields/document-fields';
    import { NSwitch, NCheckbox, NSelect, NInput, NTooltip, NInputGroup, NPagination } from 'naive-ui';
    import { SelectMixedOption, SelectOption } from 'naive-ui/es/select/src/interface';   
    import { DocumentFiltering } from '../../services/document-filter-service';
    import { useDocumentsCountStore } from '../../stores/documents-count';
    import VueJsoneditor from 'vue3-ts-jsoneditor';

    const props = defineProps<{
        dbName: string
        collectionName: string
        documentsCount: number
    }>();

    const emit = defineEmits<{
        (e: 'triggerFilter', conditions: string): void
    }>();

    const renderOption = ({ node, option }: { node: VNode; option: SelectOption }) => {
        return h(NTooltip, null, {
            trigger: () => node,
            default: () => option.label
        });
    }

    const fieldsStore = useDocumentFieldsStore();
    const countStore = useDocumentsCountStore();

    const calculateTotalPageCount = () => {
        const countData = countStore.countsList.filter(x => x.documentsOf == `${props.dbName}.${props.collectionName}`)[0];

        if(countData != null) {
            return Math.ceil(countData.documentsCount / 50);
        }

        return 0;
    }

    let simpleFiltering = ref<boolean>(true);
    let pageNumber = ref<number>(1);
    let totalPage = ref<number>(calculateTotalPageCount());
    let documentFields: SelectMixedOption[] = [];
    let rawQuery = ref('{}');
    let multipleFilters: any[] = reactive([
        {
            shouldApply: false,
            field: null,
            filterType: "Equal",
            dataType: null,
            value: null
        }
    ]);

    const checkAndUpdateFields = (fieldsData: DocumentFields[]) => {
        if (fieldsData.some(x => x.documentOf == `${props.dbName}.${props.collectionName}`)) {
            documentFields = fieldsData.filter(x => x.documentOf == `${props.dbName}.${props.collectionName}`)[0].documentFields.map(x => {
                const selectOption = { label: x, value: x };
                return selectOption;
            });
        }
    }

    checkAndUpdateFields(fieldsStore.fieldsList);

    fieldsStore.$subscribe((mutation, state) => {
        checkAndUpdateFields(state.fieldsList);
    });

    const addNewFilter = () => {
        multipleFilters.push({
            shouldApply: false,
            field: null,
            filterType: "Equal",
            dataType: null,
            value: ''
        });
    }

    const removeFilter = (index: number): void => {
        multipleFilters.splice(index, 1);
    }

    const searchDocuments = (): void => {
        let filters = '';

        if(simpleFiltering.value) {
            filters = JSON.stringify(DocumentFiltering.extractSimpleBuilderFilters(multipleFilters));
        }
        else {
            filters = rawQuery.value;
        }

        emit('triggerFilter', filters);
    }

    const importFiltersFromSimpleBuilder = (): void => {
        const filters = DocumentFiltering.extractSimpleBuilderFilters(multipleFilters);
        rawQuery.value = JSON.stringify(filters, null, 2);
    }

    const updateDocumentListOnPageNumberChange = (page: number) => {
        pageNumber.value = page;
    }
</script>