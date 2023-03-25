import { invoke } from "@tauri-apps/api";

export class MongoDbService {
    static checkUrl = async (url: string): Promise<boolean> => {
        return await invoke('check_mongo_url', { url: url });
    }

    static getCollectionDocuments = async (dbName: string, collectionName: string, filters: string, sort: string, limit: number, skip: number): Promise<object[] | string> => {
        return await invoke('get_collection_documents', { dbName: dbName, collectionName: collectionName, filters: filters, sort: sort, limit: limit, skip: skip });
    }

    static getCollectionDocumentsCount = async (dbName: string, collectionName: string, filters: string): Promise<number | string> => {
        return await invoke('get_collection_documents_count', { dbName: dbName, collectionName: collectionName, filters: filters });
    }

    static insertDocument = async (dbName: string, collectionName: string, document: string): Promise<string> => {
        return await invoke('insert_docuemnt', { dbName: dbName, collectionName: collectionName, document: document });
    }
}