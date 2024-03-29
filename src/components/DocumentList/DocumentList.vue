<template>
    <div v-if="componentState.documentList.length > 0" class="max-h-[calc(100vh-280px)] overflow-y-auto">
        <div v-for="(document, index) in componentState.documentList" :key="index" class="mb-3.5 relative group hover:cursor-pointer last:h-max">
            <div class="mr-2 z-40 absolute top-3 right-7 hidden group-hover:flex">
                <svg @click="editDoc(document)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-emerald-500 hover:cursor-pointer">
                    <path
                        d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                    <path
                        d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                </svg>

                <svg @click="deleteDoc(document)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 ml-2 text-red-500 hover:cursor-pointer">
                    <path fill-rule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                        clip-rule="evenodd" />
                </svg>
            </div>

            <JSONView :editor-value="document" />
        </div>
    </div>

    <div v-else class="flex bg-base rounded-lg text-white p-16 justify-center text-xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 mr-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
        </svg>

        No Documents Found.
    </div>

    <n-modal v-model:show="componentState.showDocEditModal" class="rounded-xl" preset="card"
        style="width: 50%; background-color: #313131; border: #313131;" :bordered="true" size="medium">
        <div class="mb-6 overflow-y-auto">
            <vue-jsoneditor
                mode="text"
                v-model:text="componentState.editableDoc"
                :mainMenuBar="false"
                :navigationBar="false"
                :statusBar="false"
                :darkTheme="true"
            />
        </div>

        <div class="flex justify-end mt-3 gap-2">
            <button class="bg-[#4bb153] text-white rounded-lg py-[3px] px-6" @click="updateDoc">
                Update
            </button>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
    import { reactive } from 'vue';
    import { useCollectionDocumentsStore } from '../../stores/collection-documents';
    import { NModal, useNotification } from 'naive-ui';
    import { EJSONService } from '../../services/ejson-service';   
    import { ComponentStateModel } from './Models/ViewModels';   
    import { useTabDataStore } from '../../stores/tab-data';   
    import { MongoDbService } from '../../services/data/mongo-service';   
    import { useCRUDEventsStore } from '../../stores/crud-events';
    import JSONView from '../JsonViewer/JSONView.vue';
    import VueJsoneditor from 'vue3-ts-jsoneditor';

    const props = defineProps<{
        dbName: string
        collectionName: string
        tabStoreKey: string
        showSearchedData: boolean
        searchedData: object[]
    }>();

    const documentsStore = useCollectionDocumentsStore();
    const tabsDataStore = useTabDataStore();
    const crudEventStore = useCRUDEventsStore();
    const notification = useNotification();

    const componentState: ComponentStateModel = reactive({
        documentList: [],
        editableDoc: '',
        showDocEditModal: false
    });

    const updateDocumentList = () => {
        const documents = documentsStore.collectionDocuments.filter(x => x.collectionName == `${props.dbName}.${props.collectionName}`)[0]?.CollectionDocuments;

        if(documents != null && documents.length > 0) {
            componentState.documentList = documents.map(x => EJSONService.BsonDocToObject(x));
        }
    }

    if(props.showSearchedData) {
        componentState.documentList = props.searchedData.map(x => EJSONService.BsonDocToObject(x));
    }
    else {
        updateDocumentList();
    }

    const editDoc = (document: object): void => {
        componentState.editableDoc = JSON.stringify(document, null, 2);
        componentState.showDocEditModal = true;
    }

    const docFilterQuery = (documentId: any): string => {
        return `
            {
                "_id": {
                    "$eq": "${documentId}"
                }
            }
        `;
    }

    const updateDoc = async () => {
        const parsedObject = JSON.parse(componentState.editableDoc);

        if(!parsedObject.hasOwnProperty('_id')) {
            notification.error({title: "Invalid document!"});

            return;
        }

        const updateFilter = docFilterQuery(parsedObject["_id"]);

        const updateDoc = {"$set": parsedObject};

        const result = await MongoDbService.updateDocument(props.dbName, props.collectionName, updateFilter, JSON.stringify(updateDoc));

        if(typeof result === "string") {
            const updatedDoc = componentState.documentList.filter(x => x._id == parsedObject._id)[0];

            if(updatedDoc != null) {
                const updatedDocIndex = componentState.documentList.indexOf(updatedDoc);

                componentState.documentList[updatedDocIndex] = EJSONService.BsonDocToObject(parsedObject);

                componentState.showDocEditModal = false;
            }

            documentsStore.removeDocuments(`${props.dbName}.${props.collectionName}`);

            notification.success({title: result});
        }
        else {
            notification.error({title: result.message});
        }
    }

    const updateDocumentsCount = () => {
        let existingTabData = tabsDataStore.tabsData.filter(x => x.storeKey == props.tabStoreKey)[0];

        if(existingTabData != null) {
            existingTabData = {
                ...existingTabData,
                documentsCount: componentState.documentList.length
            }

            tabsDataStore.upsertData(existingTabData);
        }
    }

    const deleteDoc = async (document: object) => {
        const deleteFilter = docFilterQuery(document["_id"]);

        const result = await MongoDbService.deleteDocument(props.dbName, props.collectionName, deleteFilter);

        if(typeof result === "string") {

            const deletedDocument = componentState.documentList.filter(x => x._id == document["_id"])[0];

            if(deletedDocument != null) {
                const deletedDocumentIndex = componentState.documentList.indexOf(deletedDocument);

                componentState.documentList.splice(deletedDocumentIndex, 1);

                documentsStore.removeDocuments(`${props.dbName}.${props.collectionName}`);

                updateDocumentsCount();

                notification.success({title: "Document deleted."});
            }
        }
        else {
            notification.error({title: result.message});
        }
    }

    crudEventStore.$subscribe((mutation, state) => {
        if(state.updateDocumentList) {
            updateDocumentList();

            crudEventStore.updateDocumentList(false);
        }
    });
</script>