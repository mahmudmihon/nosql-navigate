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

        <div class="document-filtering w-full">
            <div v-if="simpleFiltering" class="flex flex-col">
                <div v-for="(filterModel, index) in multipleFilters" :key="index" class="flex gap-2">
                    <div>
                        <n-checkbox size="small" v-model="filterModel.shouldApply"></n-checkbox>
                    </div>

                    <div>
                        <n-select size="small" v-model="filterModel.field" filterable :options="documentFields"/>
                    </div>

                    <div class="w-48">
                        <n-select size="small" v-model="filterModel.type" :options="filterTypes"/>
                    </div>
                    
                    <div class="w-full">
                        <n-input size="small" v-model="filterModel.value" type="text" />
                    </div>
                </div>
            </div>
        </div>

        <div class="w-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useDocumentFieldsStore } from '../../stores/document-fields';
    import { DocumentFields } from '../../types/DocumentFields/document-fields';
    import { NSwitch, NCheckbox, NSelect, NInput } from 'naive-ui';
    import { SelectMixedOption } from 'naive-ui/es/select/src/interface';

    const props = defineProps<{
        dbName: string
        collectionName: string
    }>();

    let simpleFiltering = ref<boolean>(true);
    let documentFields: SelectMixedOption[] = [];
    let multipleFilters: any[] = [
        {
            shouldApply: false,
            field: null,
            type: "Equal",
            value: null
        }
    ];

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
</script>