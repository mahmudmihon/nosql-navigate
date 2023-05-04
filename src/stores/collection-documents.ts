import { CollectionDocuments } from '../types/CollectionDocuments/collection-documents';
import { defineStore } from 'pinia';

interface CollectionDocumentsState {
    collectionDocuments: CollectionDocuments[];
}

export const useCollectionDocumentsStore = defineStore('collection-documents', {
    state: (): CollectionDocumentsState => {
        return {
            collectionDocuments: []
        }
    },
    actions: {
        addNewDocuments(newDocuments: CollectionDocuments) {

            const existingData = this.$state.collectionDocuments.filter(x => x.collectionName == newDocuments.collectionName)[0];

            if(existingData != null) {
                const dataIndex = this.$state.collectionDocuments.indexOf(existingData);

                this.$state.collectionDocuments.splice(dataIndex, 1, newDocuments);
            }
            else {
                this.$state.collectionDocuments.push(newDocuments);
            }            
        },
        removeDocuments(collectionName: string) {
            const collectionToDelete = this.$state.collectionDocuments.filter(x => x.collectionName == collectionName)[0];

            if(collectionToDelete != null) {
                const deleteIndex = this.$state.collectionDocuments.indexOf(collectionToDelete);

                this.$state.collectionDocuments.splice(deleteIndex, 1);
            }
        }
    }
})
