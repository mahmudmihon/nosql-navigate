<template>

</template>

<script setup lang="ts">
    import { useDocumentFieldsStore } from '../../stores/document-fields';
    import { DocumentFields } from '../../types/DocumentFields/document-fields';

    const props = defineProps<{
        dbName: string
        collectionName: string
    }>();

    let documentFields: string[] = [];

    const filterTypes: string[] = ["Equal, Not equal, Contains, In, Less than, Less than or equal, Greater than, Greater than or equal"];

    const checkAndUpdateFields = (fieldsData: DocumentFields[]) => {
        if (fieldsData.some(x => x.documentOf == `${props.dbName}.${props.collectionName}`)) {
            documentFields = fieldsData.filter(x => x.documentOf == `${props.dbName}.${props.collectionName}`)[0].documentFields;
        }
    }

    const fieldsStore = useDocumentFieldsStore();

    checkAndUpdateFields(fieldsStore.fieldsList);

    let multipleFilters: object[] = [
        {
            shouldApply: false,
            field: null,
            type: "=",
            value: null
        }
    ];

    fieldsStore.$subscribe((mutation, state) => {
        checkAndUpdateFields(state.fieldsList);
    });
</script>