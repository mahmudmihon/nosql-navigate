export interface ImportExportSummary {
    id: string;
    operationType: ImportExportOperationType;
    documentType: ImportExportDocumentType;
    operationStatus: ImportExportStatus;
    dbName: string;
    collectionName: string;
    path: string;
    documentsCount: number;
    createdOn: Date;
}

export enum ImportExportOperationType {
    Import,
    Export
}

export enum ImportExportDocumentType {
    Documents,
    Aggregation
}

export enum ImportExportStatus {
    Pending,
    Completed,
    Failed
}