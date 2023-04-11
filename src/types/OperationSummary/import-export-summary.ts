export interface ImportExportSummary {
    id: string;
    db_name: string;
    collection_name: string;
    path: string;
    operation_type: string;
    operation_status: string;   
    documents_count: number;
    created_on: string;
}