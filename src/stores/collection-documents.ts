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
            this.$state.collectionDocuments.push(newDocuments);
        }
    }
})
