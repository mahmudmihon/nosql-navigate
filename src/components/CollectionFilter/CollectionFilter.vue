<template>
    <div class="flex flex-row flex-nowrap mt-4">
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

        <div class="document-filtering w-full h-24 overflow-y-auto">
            <div v-if="simpleFiltering" class="flex flex-col gap-2">
                <div v-for="(filterModel, index) in multipleFilters" :key="index" class="flex gap-2">
                    <div>
                        <n-checkbox size="large" v-model:value="filterModel.shouldApply"></n-checkbox>
                    </div>

                    <div>
                        <n-select size="small" v-model:value="filterModel.field" filterable :options="documentFields" :render-option="renderOption" :placeholder="'Field'" />
                    </div>

                    <div class="w-48">
                        <n-select size="small" v-model:value="filterModel.filterType" :options="filterTypes" :render-option="renderOption" :placeholder="'Fiter type'" />
                    </div>

                    <div class="w-full flex pr-1">
                        <n-input-group>
                            <n-select size="small" v-model:value="filterModel.dataType" :style="{ width: '20%' }" :options="dataTypes" :placeholder="'Data type'" />
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

            <vue-jsoneditor
                v-if="!simpleFiltering"
                height="50"
                mode="text"
                v-model:text="rawQuery"
                :mainMenuBar="false"
                :navigationBar="false"
                :statusBar="false"
                :darkTheme="true"
            />
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
</template>

<script setup lang="ts">
    import { ref, VNode, h, reactive } from 'vue';
    import { useDocumentFieldsStore } from '../../stores/document-fields';
    import { DocumentFields } from '../../types/DocumentFields/document-fields';
    import { NSwitch, NCheckbox, NSelect, NInput, NTooltip, NInputGroup } from 'naive-ui';
    import { SelectMixedOption, SelectOption } from 'naive-ui/es/select/src/interface';
    import VueJsoneditor from 'vue3-ts-jsoneditor';

    const props = defineProps<{
        dbName: string
        collectionName: string
    }>();

    const renderOption = ({ node, option }: { node: VNode; option: SelectOption }) => {
        return h(NTooltip, null, {
            trigger: () => node,
            default: () => option.label
        });
    }

    let simpleFiltering = ref<boolean>(true);
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

    const filterTypes: SelectMixedOption[] =
        [{
            label: "Equal",
            value: "Equal"
        },
        {
            label: "Not equal",
            value: "Not equal"
        },
        {
            label: "Contains",
            value: "Contains"
        },
        {
            label: "In",
            value: "In"
        },
        {
            label: "Less than",
            value: "Less than"
        },
        {
            label: "Less than or equal",
            value: "Less than or equal"
        },
        {
            label: "Greater than",
            value: "Greater than"
        },
        {
            label: "Greater than or equal",
            value: "Greater than or equal"
        }];

    const dataTypes: SelectMixedOption[] =
        [{
            label: "Number",
            value: "Number"
        },
        {
            label: "Boolean",
            value: "Boolean"
        },
        {
            label: "String",
            value: "String"
        },
        {
            label: "Array",
            value: "Array"
        },
        {
            label: "Object",
            value: "Object"
        }];

    const fieldsStore = useDocumentFieldsStore();

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
            value: null
        });
    }

    const removeFilter = (index: number) => {
        multipleFilters.splice(index, 1);
    }

    const searchDocuments = () => {
        console.log(multipleFilters);
    }
</script>