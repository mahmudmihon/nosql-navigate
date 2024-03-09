<template>
    <div class="flex flex-col flex-nowrap mt-3">
        <div class="flex flex-row">
            <div class="filter-switch w-32">
                <n-switch v-model:value="componentState.simpleFiltering">
                    <template #checked>
                        Simple
                    </template>
                    <template #unchecked>
                        Advance
                    </template>
                </n-switch>
            </div>

            <div class="document-filtering w-full">
                <div v-if="componentState.simpleFiltering" class="flex flex-col gap-2 h-24 overflow-y-auto">
                    <div v-for="(filterModel, index) in componentState.multipleFilters" :key="index" class="flex gap-2">
                        <div>
                            <n-checkbox size="large" v-model:checked="filterModel.shouldApply"></n-checkbox>
                        </div>

                        <div>
                            <n-select 
                                size="small" 
                                v-model:value="filterModel.field" 
                                filterable
                                clearable 
                                :options="componentState.documentFields" 
                                :render-option="NaiveUiService.renderOption" 
                                :placeholder="'Field'" 
                            />
                        </div>

                        <div class="w-48">
                            <n-select 
                                size="small" 
                                clearable
                                v-model:value="filterModel.filterType" 
                                :options="DocumentFiltering.filterTypes" 
                                :render-option="NaiveUiService.renderOption" 
                                :placeholder="'Fiter type'" 
                            />
                        </div>

                        <div class="w-full flex pr-1">
                            <n-input
                                clearable 
                                size="small" 
                                v-model:value="filterModel.value" 
                                type="text" 
                                :placeholder="'Value'" 
                            />

                            <svg v-if="componentState.simpleFiltering && index == 0" @click="addNewFilter" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 ml-1 text-green-400 hover:cursor-pointer">
                                <path fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                                    clip-rule="evenodd" 
                                />
                            </svg>

                            <svg v-if="index != 0" @click="removeFilter(index)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 ml-1 text-red-600 hover:cursor-pointer">
                                <path fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                                    clip-rule="evenodd" 
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div v-if="!componentState.simpleFiltering" class="flex">
                    <div class="w-full h-24 overflow-y-auto">
                        <vue-jsoneditor
                            mode="text"
                            v-model:text="componentState.rawQuery"
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
            <div class="mr-auto">
                <span class="flex items-center text-xs font-medium truncate w-[420px]">
                    {{$props.dbName}}

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="ml-1 mr-1 w-6 h-6">
                        <path fill-rule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clip-rule="evenodd" />
                    </svg>

                    {{$props.collectionName}}
                </span>             
            </div>
            <div v-if="componentState.runningOperation" class="mr-4">
                <n-tag size="small" round :bordered="false" type="success">
                    {{componentState.runningOperationText}}
                </n-tag>
            </div>
            <div class="flex">
                <span class="hover:cursor-pointer hover:text-[#63e2b7]" title="Insert Document" @click="insertDocument">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </span>

                <span class="hover:cursor-pointer hover:text-[#63e2b7]" title="Import Collection" @click="importDocuments">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                </span>

                <span class="hover:cursor-pointer hover:text-[#63e2b7]" title="Export Collection" @click="exportDocuments">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-2 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                </span>

                <div v-if="componentState.documentsCount > 0" class="mr-2">
                    <n-tag size="small" round :bordered="false" type="success">
                        {{componentState.documentsCount}}
                    </n-tag>
                </div>
            </div>

            <div class="max-w-[50%]">
                <n-pagination
                v-model:page="componentState.pageNumber"
                :page-size="CommonConsts.defaultDocumentPageSize"
                :page-count="componentState.totalPage"
                size="small"
                simple
                :on-update:page="updateDocumentListOnPageNumberChange">
                    <template #goto>
                        Go
                    </template>
                </n-pagination>
            </div>

            <button class="bg-[#63ffb729] text-[#63e2b7] text-xs rounded-lg py-[1px] px-2 ml-2" @click="triggerRefresh">
                Refresh
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive } from 'vue';
    import { DocumentFields } from '../../types/DocumentFields/document-fields';
    import { NSwitch, NCheckbox, NSelect, NInput, NPagination, NTag, useNotification } from 'naive-ui';
    import { DocumentFiltering } from '../../services/document-filter-service';
    import { DocumentsFilteringPagination } from '../../types/DocumentFilter&Pagination/documents-filtering-pagination';
    import { DocumentsCount } from '../../types/DocumentsCount/documents-count';
    import { open, save } from '@tauri-apps/api/dialog';
    import { useDocumentsCountStore } from '../../stores/documents-count';
    import { useDocumentFieldsStore } from '../../stores/document-fields';
    import { useCRUDEventsStore } from '../../stores/crud-events';
    import { AdvanceFiltering } from '../../types/DocumentFilter&Pagination/advance-filtering';
    import { NaiveUiService } from '../../services/naive-ui-service';   
    import { CommonConsts } from '../../utilities/common-consts';
    import { ComponentStateModel } from './Models/ViewModels';   
    import { useTabDataStore } from '../../stores/tab-data';   
    import { MongoDbService } from '../../services/data/mongo-service';   
    import { TriggerDocumentCreate } from '../../types/DocumentCRUD/document-crud';
    import VueJsoneditor from 'vue3-ts-jsoneditor';

    const props = defineProps<{
        dbName: string
        collectionName: string
        tabStoreKey: string
    }>();

    const emit = defineEmits<{
        (e: 'triggerFilter', data: DocumentsFilteringPagination): void
        (e: 'triggerDocInsertModal', data: TriggerDocumentCreate): void
    }>();

    const fieldsStore = useDocumentFieldsStore();
    const countStore = useDocumentsCountStore();
    const tabsDataStore = useTabDataStore();
    const crudEventsStore = useCRUDEventsStore();
    const notification = useNotification();

    const calculateTotalPageCount = (counsData: DocumentsCount[]) => {
        const countData = counsData.filter(x => x.documentsOf == `${props.dbName}.${props.collectionName}`)[0];

        if(countData != null) {
            return Math.ceil(countData.documentsCount / CommonConsts.defaultDocumentPageSize);
        }

        return 0;
    }

    const componentState: ComponentStateModel = reactive({
        documentsCount: 0,
        advanceFiltering: {filters: {}, sort: {}},
        simpleFiltering: true,
        pageNumber: 1,
        totalPage: calculateTotalPageCount(countStore.countsList),
        searchInitiated: false,
        runningOperation: false,
        runningOperationText: '',
        documentFields: [],
        rawQuery: JSON.stringify({filters: {}, sort: {}}, null, 2),
        multipleFilters: [{
            shouldApply: true,
            field: '',
            filterType: "Equal",
            value: ''
        }]
    });

    const checkAndUpdateDocumentsCount = () => {
        const tabData = tabsDataStore.tabsData.filter(x => x.storeKey == props.tabStoreKey)[0];

        if(tabData != null) {
            componentState.documentsCount = tabData.documentsCount;
        }
    }

    checkAndUpdateDocumentsCount();

    const checkAndUpdateFields = (fieldsData: DocumentFields[]) => {
        if (fieldsData.some(x => x.documentOf == `${props.dbName}.${props.collectionName}`)) {
            componentState.documentFields = fieldsData.filter(x => x.documentOf == `${props.dbName}.${props.collectionName}`)[0].documentFields.map(x => {
                const selectOption = { label: x, value: x };
                return selectOption;
            });
        }
    }

    checkAndUpdateFields(fieldsStore.fieldsList);

    const addNewFilter = (): void => {
        componentState.multipleFilters.push({
            shouldApply: true,
            field: '',
            filterType: "Equal",
            value: ''
        });
    }

    const removeFilter = (index: number): void => {
        componentState.multipleFilters.splice(index, 1);
    }

    const searchDocuments = (): void => {
        const filters = getFilters();
        const sort = getSort();

        if(filters != '{}') {
            componentState.searchInitiated = true;
        }
        else {
            componentState.searchInitiated = false;
        }

        componentState.pageNumber = 1;

        emit('triggerFilter', {filters: filters, sort: sort, skip: ((componentState.pageNumber - 1) * CommonConsts.defaultDocumentPageSize), limit: CommonConsts.defaultDocumentPageSize});
    }

    const importFiltersFromSimpleBuilder = (): void => {
        const filters = DocumentFiltering.extractSimpleBuilderFilters(componentState.multipleFilters);

        componentState.advanceFiltering.filters = filters;

        componentState.rawQuery = JSON.stringify(componentState.advanceFiltering, null, 2);
    }

    const updateDocumentListOnPageNumberChange = (page: number): void => {
        const values = getFiltersAndSort();

        emit('triggerFilter', {filters: values[0], sort: values[1], skip: ((page - 1) * CommonConsts.defaultDocumentPageSize), limit: CommonConsts.defaultDocumentPageSize});

        componentState.pageNumber = page;
    }

    const triggerRefresh = (): void => {
        const values = getFiltersAndSort();

        emit('triggerFilter', {filters: values[0], sort: values[1], skip: ((componentState.pageNumber - 1) * CommonConsts.defaultDocumentPageSize), limit: CommonConsts.defaultDocumentPageSize});
    }

    const getFilters = (): string => {
        let filters = '';

        if(componentState.simpleFiltering) {
            filters = JSON.stringify(DocumentFiltering.extractSimpleBuilderFilters(componentState.multipleFilters));
        }
        else {
            const advanceFiltering: AdvanceFiltering = JSON.parse(componentState.rawQuery);

            const filtersObject = advanceFiltering.filters;

            if(filtersObject != null && Object.keys(filtersObject).length > 0) {
                filters = JSON.stringify(filtersObject);
            }
            else {
                return '{}';
            }
        }

        return filters;
    }

    const getSort = (): string => {
        if(componentState.simpleFiltering) {
            return '{}';
        }
        else {
            const advanceFiltering: AdvanceFiltering = JSON.parse(componentState.rawQuery);

            const sortObject = advanceFiltering.sort;

            if(sortObject != null && Object.keys(sortObject).length > 0) {
                return JSON.stringify(sortObject);
            }
            else {
                return '{}';
            }
        }
    }

    const getFiltersAndSort = (): string[] => {
        let filters = '{}';
        let sort = '{}';

        filters = getFilters();
        sort = getSort();

        return [filters, sort];
    }

    const insertDocument = () => {
        emit('triggerDocInsertModal', { triggerModal: true });
    }

    const importDocuments = async () => {
        const filePath = await open({
            directory: false,
            multiple: false,
            filters: [{
                name: 'json',
                extensions: ['json']
            }]
        });

        if(filePath != null) {
            componentState.runningOperation = true;
            componentState.runningOperationText = "Importing";

            try {
                await MongoDbService.importCollection(props.dbName, props.collectionName, filePath as string);

                notification.success({ title: "Collection imported." });

                crudEventsStore.updateDocumentsImported(true);               
            }
            catch(exception: any) {
                notification.error({ title: exception.message });
            }

            componentState.runningOperation = false;
            componentState.runningOperationText = "";
        }
    }

    const exportDocuments = async () => {
        const filePath = await save({
            filters: [{
                name: 'json',
                extensions: ['json']
            }],
            defaultPath: props.collectionName
        });

        if(filePath != null) {
            componentState.runningOperation = true;
            componentState.runningOperationText = "Exporting";

            const result = await MongoDbService.exportCollection(props.dbName, props.collectionName, filePath as string);

            if (result != 'error') {
                notification.success({ title: "Collection exported." });
            }

            componentState.runningOperation = false;
            componentState.runningOperationText = "";
        }
    }

    fieldsStore.$subscribe((mutation, state) => {
        checkAndUpdateFields(state.fieldsList);
    });

    countStore.$subscribe((mutation, state) => {
        componentState.totalPage = calculateTotalPageCount(state.countsList);
    });

    tabsDataStore.$subscribe((mutation, state) => {
        checkAndUpdateDocumentsCount();       
    });    
</script>