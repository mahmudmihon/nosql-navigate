import { invoke } from "@tauri-apps/api";
import { DbStats } from "../../types/DbCollections/db-stats";
import { ErrorResult } from "../../types/OperationSummary/error-result";

export class MongoDbService {
    static checkUrl = async (url: string): Promise<boolean> => {
        return await invoke('check_mongo_url', { url: url });
    }

    static getDbsWithCollectionNames = async (): Promise<object[] | string> => {
        return await invoke('get_dbs_with_collections');
    }

    static getDbsStats = async(): Promise<DbStats[] | ErrorResult> => {
        return await invoke('dbs_with_stats');
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

    static updateDocument = async (dbName: string, collectionName: string, filter: string, document: string): Promise<string | ErrorResult> => {
        return await invoke('update_document', { dbName: dbName, collectionName: collectionName, filter: filter, document: document });
    }

    static deleteDocument = async (dbName: string, collectionName: string, filter: string): Promise<string | ErrorResult> => {
        return await invoke('delete_document', { dbName: dbName, collectionName: collectionName, filter: filter });
    }

    static importCollection = async (dbName: string, collectionName: string, path: string): Promise<number> => {
        return await invoke('import_collection', { dbName: dbName, collectionName: collectionName, path: path });
    }

    static exportCollection = async (dbName: string, collectionName: string, path: string): Promise<number | string> => {
        return await invoke('export_collection', { dbName: dbName, collectionName: collectionName, path: path });
    }

    static getAggregatedDocuments = async (dbName: string, collectionName: string, stages: string[], limit: number): Promise<object[] | string> => {
        return await invoke('documents_aggregation', { dbName: dbName, collectionName: collectionName, aggregations: stages, limit: limit });
    }

    static exportAggregationResult = async (dbName: string, collectionName: string, aggregations: string[], path: string): Promise<number | string> => {
        return await invoke('export_aggregation_result', { dbName: dbName, collectionName: collectionName, aggregations: aggregations, path: path });
    }

    static dropMongoClient = async (): Promise<void> => {
        invoke('drop_client');
    }

    static dropDatabase = async (dbName: string): Promise<string> => {
        return invoke('drop_database', { dbName: dbName });
    }
}