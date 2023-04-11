import { invoke } from "@tauri-apps/api";
import { ImportExportSummary } from "../../types/OperationSummary/import-export-summary";

export class SqlLiteService {
    static checkAndCreateInitialTable = async () => {
        await invoke('create_initial_tables');
    };
    
    static clearImportExportSummary = async () => {
        await invoke('clear_import_export_summary');
    }

    static getAllImportExportSummary = async (): Promise<ImportExportSummary[]> => {
        return await invoke('get_all_import_export_summary');
    }
}
