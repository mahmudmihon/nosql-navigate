import { ConnectionInfo } from './../../types/DbConnections/db-connection';
import { invoke } from "@tauri-apps/api";
import { ImportExportSummary } from "../../types/OperationSummary/import-export-summary";

export class SqlLiteService {
    static checkAndCreateInitialTable = async () => {
        await invoke('create_initial_tables');
    };

    static getAllConnectionInfo = async (): Promise<ConnectionInfo[]> => {
        return await invoke('get_all_connection_info');
    }

    static saveConnectionInfo = async (name: string, url: string) => {
        await invoke('save_connection_info', { connectionName: name, connectionUrl: url });
    }

    static deleteConnectionInfo = async (id: string) => {
        await invoke('delete_connection_info', { id: id });
    }
    
    static clearImportExportSummary = async () => {
        await invoke('clear_import_export_summary');
    }

    static getAllImportExportSummary = async (): Promise<ImportExportSummary[]> => {
        return await invoke('get_all_import_export_summary');
    }
}
