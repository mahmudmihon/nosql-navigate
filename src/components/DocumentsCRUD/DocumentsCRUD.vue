<template>
    <div class="flex flex-col">
        <div v-if="componentState.fullPageLoading" class="mt-2">
            <GenericSkeleton />
        </div>

        <div v-else>
            <DocumentsFilterAndPagination
                @trigger-filter="triggerFilter"
                @trigger-doc-insert-modal="triggerDocInsertModal"
                :db-name="props.dbName"
                :collection-name="props.collectionName"
                :tab-store-key="props.tabStoreKey"
            />

            <div v-if="componentState.searchedDataLoading" class="mt-1">
                <GenericSkeleton />
            </div>
            <div v-else class="mb-1">
                <DocumentList
                    :db-name="props.dbName"
                    :collection-name="props.collectionName"
                    :tab-store-key="props.tabStoreKey"
                    :show-searched-data="componentState.showSearchedData"
                    :searched-data="componentState.searchedData"
                />
            </div>
        </div>
    </div>

    <n-modal
        v-model:show="componentState.showDocInsertModal"
        class="rounded-xl"
        preset="card"
        style="width: 50%;
        background-color: #313131;
        border: #313131;"
        :bordered="true"
        size="medium"
    >
        <div class="mb-6 overflow-y-auto">
            <vue-jsoneditor
                mode="text"
                v-model:text="componentState.docToInsert"
                :mainMenuBar="false"
                :navigationBar="false"
                :statusBar="false"
                :darkTheme="true"
                :height="350"
            />
        </div>

        <div class="flex justify-end mt-3 gap-2">
            <button class="bg-[#4bb153] text-white rounded-lg py-[3px] px-6" @click="insertDoc">
                Insert
            </button>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
    import { reactive } from 'vue';
    import { NModal, useNotification } from 'naive-ui';
    import { clearObjectKeys, extractObjectKeys } from '../../utilities/object-keys';
    import { useCollectionDocumentsStore } from '../../stores/collection-documents';
    import { useDocumentFieldsStore } from '../../stores/document-fields';
    import { EJSONService } from '../../services/ejson-service';
    import { useDocumentsCountStore } from '../../stores/documents-count';
    import { DocumentsFilteringPagination } from '../../types/DocumentFilter&Pagination/documents-filtering-pagination';
    import { useCRUDEventsStore } from '../../stores/crud-events';
    import { ObjectId } from 'bson';
    import { CommonConsts } from '../../utilities/common-consts';
    import { MongoDbService } from '../../services/data/mongo-service';
    import { ComponentStateModel } from './Models/ViewModels';
    import { useTabDataStore } from '../../stores/tab-data';  
    import { TriggerDocumentCreate } from '../../types/DocumentCRUD/document-crud';
    import DocumentsFilterAndPagination from '../DocumentsFilterAndPagination/DocumentsFilterAndPagination.vue';
    import GenericSkeleton from '../Common/GenericSkeleton.vue';
    import DocumentList from '../DocumentList/DocumentList.vue';
    import VueJsoneditor from 'vue3-ts-jsoneditor';

    const props = defineProps<{
        dbName: string
        collectionName: string
        tabStoreKey: string
    }>();

    const fieldsStore = useDocumentFieldsStore();
    const documentsStore = useCollectionDocumentsStore();
    const countStore = useDocumentsCountStore();
    const tabsDataStore = useTabDataStore();
    const crudEventStore = useCRUDEventsStore();
    const notification = useNotification();

    const componentState: ComponentStateModel = reactive({
        fullPageLoading: true,
        searchedDataLoading: false,
        showSearchedData: false,
        showDocInsertModal: false,
        docToInsert: '',
        searchedData: [],
        collectionDocuments: []
    });

    const getStoreCollectionDocumentsAndCount = async (filters: string, sort: string, limit: number, skip: number, triggeredFromFilterAndPagination: boolean = false) => {

        const promises = [
            await MongoDbService.getCollectionDocuments(props.dbName, props.collectionName, filters, sort, limit, skip),
            await MongoDbService.getCollectionDocumentsCount(props.dbName, props.collectionName, filters)
        ];

        if(triggeredFromFilterAndPagination) {
            componentState.searchedDataLoading = true;
        }

        Promise.allSettled(promises).then(results => {
            const listResult = results[0];
            const countResult = results[1];

            if(listResult.status == 'fulfilled') {
                if(listResult.value != 'error') {
                    const documentList = listResult.value as object[];

                    if(triggeredFromFilterAndPagination) {
                        componentState.searchedData = documentList;
                        componentState.showSearchedData = true;
                    }
                    else {
                        if (documentList.length > 0) {
                            const firstDocument = documentList[0];
                            const parsedObject = EJSONService.BsonDocToObject(firstDocument);
                            const objectKeys = extractObjectKeys(parsedObject).sort() as string[];

                            clearObjectKeys();

                            fieldsStore.upsertDocumentFields({ documentOf: `${props.dbName}.${props.collectionName}`, documentFields: objectKeys });

                            documentsStore.addNewDocuments({ collectionName: `${props.dbName}.${props.collectionName}`, CollectionDocuments: documentList });
                        }
                    }

                    let existingTabData = tabsDataStore.tabsData.filter(x => x.storeKey == props.tabStoreKey)[0];

                    if(existingTabData != null) {
                        existingTabData = {
                            ...existingTabData,
                            documentsCount: documentList.length
                        }
                    }
                    else {
                        existingTabData = {
                            storeKey: props.tabStoreKey,
                            documentsCount: documentList.length,
                            aggregationResultFields: [],
                            aggregationDocumentsCount: 0,
                            isExporting: false
                        }
                    }

                    tabsDataStore.upsertData(existingTabData);
                }
            }

            if(countResult.status == 'fulfilled') {
                if(countResult.value != 'error') {
                    const documentsCount = countResult.value as number;

                    countStore.upsertCount({ documentsOf: `${props.dbName}.${props.collectionName}`, documentsCount: documentsCount });
                }
            }

            componentState.fullPageLoading = false;
            componentState.searchedDataLoading = false;
        });
    }

    if(componentState.collectionDocuments.some(x => x.collectionName == `${props.dbName}.${props.collectionName}`)) {
        componentState.fullPageLoading = false;
    }
    else {
        getStoreCollectionDocumentsAndCount('{}', '{}', CommonConsts.defaultDocumentPageSize, 0);
    }

    const triggerFilter = (data: DocumentsFilteringPagination) => {
        getStoreCollectionDocumentsAndCount(data.filters, data.sort, data.limit, data.skip, true);
    }

    crudEventStore.$subscribe((mutation, state) => {
        if(state.documentsImported) {
            getStoreCollectionDocumentsAndCount('{}', '{}', CommonConsts.defaultDocumentPageSize, 0);

            crudEventStore.updateDocumentsImported(false);
        }
    });

    const triggerDocInsertModal = (data: TriggerDocumentCreate) => {
        componentState.showDocInsertModal = data.triggerModal;
    }

    const insertDoc = async () => {
        let parsedObject = JSON.parse(componentState.docToInsert);

        if(Object.keys(parsedObject).length > 0) {
            if(!Object.keys(parsedObject).includes('_id')) {
                parsedObject = { "_id": ObjectId.generate().toString('hex'), ...parsedObject }
            }

            try {
                await MongoDbService.insertDocument(props.dbName, props.collectionName, JSON.stringify(parsedObject));

                notification.success({ title: "Document inserted." });

                componentState.showDocInsertModal = false;
                componentState.docToInsert = '';
            }
            catch(exception: any) {
                notification.error({ title: exception.message });
            }
        }
    }
</script>