import { defineStore } from 'pinia';
import { DatabaseCollections } from '../../types/DbCollections/db-collections';

interface DatabaseCollectionsState {
    dbCollections:  DatabaseCollections[];
}

export const useDatabaseCollectionsStore = defineStore('db-collections', {
    state: (): DatabaseCollectionsState => {
        return {
            dbCollections: []
        }
    },
    actions: {
        addDbsWithCollections(dbCollections: DatabaseCollections[]) {
            this.$state.dbCollections = dbCollections;
        }
    }
})
