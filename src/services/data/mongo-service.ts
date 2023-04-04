import { invoke } from "@tauri-apps/api";

export class MongoDbService {
    static checkUrl = async (url: string): Promise<boolean> => {
        return await invoke('check_mongo_url', { url: url });
    }

    static getDbsWithCollectionNames = async (): Promise<object[] | string> => {
        return await invoke('get_dbs_with_collections');
    }

    static getCollectionDocuments = async (dbName: string, collectionName: string, filters: string, sort: string, limit: number, skip: number): Promise<object[] | string> => {
        return await invoke('get_collection_documents', { dbName: dbName, collectionName: collectionName, filters: filters, sort: sort, limit: limit, skip: skip });
    }

    static getCollectionDocumentsCount = async (dbName: string, collectionName: string, filters: string): Promise<number | string> => {
        return await invoke('get_collection_documents_count', { dbName: dbName, collectionName: collectionName, filters: filters });
    }

    static createCollection = async (dbName: string, collectionName: string): Promise<string> => {
        return await invoke('create_collection', { dbName: dbName, collectionName: collectionName });
    }

    static dropCollection = async (dbName: string, collectionName: string): Promise<string> => {
        return await invoke('drop_collection', { dbName: dbName, collectionName: collectionName });
    }

    static insertDocument = async (dbName: string, collectionName: string, document: string): Promise<string> => {
        return await invoke('insert_docuemnt', { dbName: dbName, collectionName: collectionName, document: document });
    }

    static dropMongoClient = async (): Promise<void> => {
        invoke('drop_client');
    }

    static dropDatabase = async (dbName: string): Promise<string> => {
        return invoke('drop_database', { dbName: dbName });
    }
}