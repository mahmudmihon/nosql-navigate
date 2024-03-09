import { invoke } from "@tauri-apps/api";
import { useDatabaseCollectionsStore } from "../stores/Common/db-collections"

export class CollectionsAndDocumentsService {
    static getDbCollectionNames = (dbName: string): string[] => {
        const collectionsStore = useDatabaseCollectionsStore();

        const dbData = collectionsStore.dbCollections.filter(x => x.dbName == dbName)[0];

        return dbData?.dbCollections ?? [];
    }

    static getCollectionDocuments = async (dbName: string, collectionName: string, filters: string, sort: string, limit: number, skip: number): Promise<object[]> => {
        const value = await invoke('get_collection_documents', { dbName: dbName, collectionName: collectionName, filters: filters, sort: sort, limit: limit, skip: skip });
        
        if(value != 'error') {
            return value as object[];
        }
        else {
            return [];
        }        
    }
}