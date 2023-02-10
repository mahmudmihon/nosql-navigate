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
