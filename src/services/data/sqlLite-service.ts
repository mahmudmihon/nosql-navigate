import { DbConnection } from './../../types/DbConnections/db-connection';
import SQLite from "tauri-plugin-sqlite-api";

export class SqlLiteService {
  static dbConnection = async (): Promise<SQLite> => {
    return await SQLite.open("./db/navigateDb.db");
  }

  static checkAndCreateInitialTable = async () => {
    const db = await this.dbConnection();

    await db.execute(`CREATE TABLE IF NOT EXISTS saved_connections (id TEXT, name TEXT, url TEXT);`);

    await db.close();
  };

  static saveDbConnection = async (model: DbConnection) => {
    const db = await this.dbConnection();

    await db.execute("INSERT INTO saved_connections VALUES (?1, ?2, ?3)", [model.id, model.name, model.url]);

    await db.close();
  }

  static getSavedConnections = async (): Promise<DbConnection[]> => {
    const db = await this.dbConnection();

    const savedConnections = await db.select<Array<DbConnection>>('SELECT * FROM saved_connections');

    return savedConnections;
  }

  static deleteSavedConnection = async (id: string) => {
    const db = await this.dbConnection();

    await db.execute("DELETE FROM saved_connections WHERE id=?", [id]);

    await db.close();
  }
}