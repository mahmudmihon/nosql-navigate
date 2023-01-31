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
            <div v-if="collectionExporting" class="mr-4">
                <n-tag size="small" round :bordered="false" type="success">
                    Exporting
                </n-tag>
            </div>
            <div class="flex">
                <span class="hover:cursor-pointer" title="Import Documents">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm5.845 17.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V12a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z" clip-rule="evenodd" />
                        <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
                    </svg>
                </span>

                <span class="hover:cursor-pointer" title="Export Collection" @click="exportDocuments">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 ml-2 mr-5">
                        <path fill-rule="evenodd" d="M5.478 5.559A1.5 1.5 0 016.912 4.5H9A.75.75 0 009 3H6.912a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.133.882V18a3 3 0 003 3h15a3 3 0 003-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0017.088 3H15a.75.75 0 000 1.5h2.088a1.5 1.5 0 011.434 1.059l2.213 7.191H17.89a3 3 0 00-2.684 1.658l-.256.513a1.5 1.5 0 01-1.342.829h-3.218a1.5 1.5 0 01-1.342-.83l-.256-.512a3 3 0 00-2.684-1.658H3.265l2.213-7.191z" clip-rule="evenodd" />
                        <path fill-rule="evenodd" d="M12 2.25a.75.75 0 01.75.75v6.44l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 011.06-1.06l1.72 1.72V3a.75.75 0 01.75-.75z" clip-rule="evenodd" />
                    </svg>
                </span>
            </div>
            <div class="max-w-[50%]">
                <n-pagination 
                v-model:page="pageNumber" 
                :page-size="50" 
                :page-count="totalPage" 
                size="small"
                simple 
                :on-update:page="updateDocumentListOnPageNumberChange">
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
    import { NSwitch, NCheckbox, NSelect, NInput, NTooltip, NInputGroup, NPagination, NTag, NIcon } from 'naive-ui';
    import { SelectMixedOption, SelectOption } from 'naive-ui/es/select/src/interface';   
    import { DocumentFiltering } from '../../services/document-filter-service';
    import { useDocumentsCountStore } from '../../stores/documents-count';
    import { DocumentsFilteringPagination } from '../../types/documents-filtering-pagination';    
    import { DocumentsCount } from '../../types/DocumentsCount/documents-count';
    import { save } from '@tauri-apps/api/dialog';
    import { invoke } from '@tauri-apps/api/tauri';
    import VueJsoneditor from 'vue3-ts-jsoneditor';
    import exportFromJSON from 'export-from-json';
    
    const props = defineProps<{
        dbName: string
        collectionName: string
        documentsCount: number
    }>();

    const emit = defineEmits<{
        (e: 'triggerFilter', data: DocumentsFilteringPagination): void
    }>();

    const renderOption = ({ node, option }: { node: VNode; option: SelectOption }) => {
        return h(NTooltip, null, {
            trigger: () => node,
            default: () => option.label
        });
    }

    const fieldsStore = useDocumentFieldsStore();
    const countStore = useDocumentsCountStore();

    const calculateTotalPageCount = (counsData: DocumentsCount[]) => {
        const countData = counsData.filter(x => x.documentsOf == `${props.dbName}.${props.collectionName}`)[0];

        if(countData != null) {
            return Math.ceil(countData.documentsCount / 50);
        }

        return 0;
    }

    let simpleFiltering = ref<boolean>(true);
    let pageNumber = ref<number>(1);
    let totalPage = ref<number>(calculateTotalPageCount(countStore.countsList));
    let searchInitiated = ref<boolean>(false);
    let collectionExporting = ref<boolean>(false);
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

    countStore.$subscribe((mutation, state) => {
        totalPage.value = calculateTotalPageCount(state.countsList);
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
        const filters = getFilters();

        if(filters != '{}') {
            searchInitiated.value = true;        
        }
        else {
            searchInitiated.value = false;         
        }

        pageNumber.value = 1;

        emit('triggerFilter', {filters: filters, skip: ((pageNumber.value - 1) * 50), limit: 50});
    }

    const importFiltersFromSimpleBuilder = (): void => {
        const filters = DocumentFiltering.extractSimpleBuilderFilters(multipleFilters);
        rawQuery.value = JSON.stringify(filters, null, 2);
    }

    const updateDocumentListOnPageNumberChange = (page: number) => {
        let filters = '{}';

        if(searchInitiated.value) {
            filters = getFilters();
        }

        emit('triggerFilter', {filters: filters, skip: ((page - 1) * 50), limit: 50});

        pageNumber.value = page;
    }

    const getFilters = (): string => {
        let filters = '';

        if(simpleFiltering.value) {
            filters = JSON.stringify(DocumentFiltering.extractSimpleBuilderFilters(multipleFilters));
        }
        else {
            filters = rawQuery.value;
        }

        return filters;
    }

    const exportDocuments = async () => {
        const filePath = await save({
            filters: [{
                name: 'JSON',
                extensions: ['json']
            }]
        });

        collectionExporting.value = true;

        invoke('export_collection', { dbName: props.dbName, collectionName: props.collectionName, path: filePath }).then(value => {
            if(value != 'error') {
                
            }

            collectionExporting.value = false;
        });
    }
</script>