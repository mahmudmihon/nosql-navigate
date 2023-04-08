import { invoke } from "@tauri-apps/api";

export class SqlLiteService {
    static checkAndCreateInitialTable = async () => {
        await invoke('create_initial_tables');
    };   
}
