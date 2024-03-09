import { ImportExportSummary } from "../../../types/OperationSummary/import-export-summary";

export interface ComponentStateModel {
    importExportSummary: ImportExportSummary[];
    dataLoading: boolean;
}