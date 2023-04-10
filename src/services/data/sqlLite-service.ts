import { invoke } from "@tauri-apps/api";

export class SqlLiteService {
    static checkAndCreateInitialTable = async () => {
        await invoke('create_initial_tables');
    };
    
    static clearImportExportSummary = async () => {
        await invoke('clear_import_export_summary');
    }
}
