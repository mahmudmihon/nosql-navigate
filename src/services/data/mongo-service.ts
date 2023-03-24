import { invoke } from "@tauri-apps/api";

export class MongoDbService {
    static checkUrl = async (url: string): Promise<boolean> => {
        return await invoke('check_mongo_url', { url: url });
    }
}