use std::path::PathBuf;
use rusqlite::{Connection, Result};
use uuid::Uuid;

use crate::models::dtos::{ImportExportSummary, ConnectionInfo, ErrorResult};

pub fn get_db(handle: tauri::AppHandle) -> PathBuf {
    return handle.path_resolver()
       .resolve_resource("db/navigate.db")
       .expect("failed to resolve resource");
}

pub fn create_initial_tables(db_path: &PathBuf) -> Result<()> {

    let conn = Connection::open(db_path)?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS saved_connections
         (
            id TEXT NOT NULL,
            name  TEXT NOT NULL,
            url  TEXT NOT NULL
        )",
        (),
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS import_export_summary
         (
            id TEXT NOT NULL,
            db_name TEXT NOT NULL,
            collection_name TEXT NOT NULL,
            path TEXT NOT NULL,
            operation_type TEXT NOT NULL,
            operation_status TEXT NOT NULL,
            documents_count INTEGER NOT NULL,
            created_on TEXT NOT NULL
        )",
        (),
    )?;

    return Ok(());
}

pub fn get_all_connection_info(db_path: &PathBuf) -> Result<Vec<ConnectionInfo>> {

    let conn = Connection::open(db_path)?;

    let mut info_list: Vec<ConnectionInfo> = Vec::new();

    let mut stmt = conn.prepare("SELECT id, name, url FROM saved_connections")?;

    let info_iter = stmt.query_map([], |row| {
        Ok(ConnectionInfo {
            id: row.get(0)?,
            name: row.get(1)?,
            url: row.get(2)?
        })
    })?;

    for info in info_iter {
        info_list.push(info.unwrap());
    }

    return Ok(info_list);
}

pub fn save_connection_info(connection_name: &str, connection_url: &str, db_path: &PathBuf) -> Result<String, ErrorResult> {

    let conn = Connection::open(db_path);

    match conn {
        Ok(connection) => {
            let id = Uuid::new_v4().to_string();

            let result = connection.execute(
                "INSERT INTO saved_connections (id, name, url) VALUES (?1, ?2, ?3)",
                (id, connection_name, connection_url)
            );

            match result {
                Ok(_r) => return Ok("Connection info saved.".to_string()),
                Err(e) => return Err(ErrorResult {message: e.to_string() })
            }
        },
        Err(e) => return Err(ErrorResult {message: e.to_string() })
    }
}

pub fn delete_connection_info(id: &str, db_path: &PathBuf) -> Result<String, ErrorResult> {

    let conn = Connection::open(db_path);

    match conn {
        Ok(connection) => {

            let result = connection.execute(
                "DELETE FROM saved_connections WHERE id=?1", 
                [id]
            );

            match result {
                Ok(_r) => return Ok("Connection info deleted.".to_string()),
                Err(e) => {
                    println!("{:?}", e);
                    return Err(ErrorResult {message: e.to_string() });
                }
            }
        },
        Err(e) => return Err(ErrorResult {message: e.to_string() })
    }
}

pub fn get_all_import_export_summary(db_path: &PathBuf) -> Result<Vec<ImportExportSummary>> {

    let conn = Connection::open(db_path)?;

    let mut summary_list: Vec<ImportExportSummary> = Vec::new();

    let mut stmt = conn.prepare("SELECT id, db_name, collection_name, path, operation_type, operation_status, documents_count, created_on FROM import_export_summary")?;

    let summary_iter = stmt.query_map([], |row| {
        Ok(ImportExportSummary {
            id: row.get(0)?,
            db_name: row.get(1)?,
            collection_name: row.get(2)?,
            path: row.get(3)?,
            operation_type: row.get(4)?,
            operation_status: row.get(5)?,
            documents_count: row.get(6)?,
            created_on: row.get(7)?
        })
    })?;

    for summary in summary_iter {
        summary_list.push(summary.unwrap());
    }

    return Ok(summary_list);
}

pub fn insert_import_export_summary(summary: &ImportExportSummary, db_path: &PathBuf) -> Result<()> {

    let conn = Connection::open(db_path)?;

    conn.execute(
        "INSERT INTO import_export_summary (id, db_name, collection_name, path, operation_type, operation_status, documents_count, created_on) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        (&summary.id, &summary.db_name, &summary.collection_name, &summary.path, &summary.operation_type, &summary.operation_status, &summary.documents_count, &summary.created_on)
    )?;

    return Ok(());
}

pub fn update_import_export_summary(summary: &ImportExportSummary, db_path: &PathBuf) -> Result<()> {

    let conn = Connection::open(db_path)?;

    conn.execute(
        "UPDATE import_export_summary SET operation_status=?1, documents_count=?2 WHERE id=?3",
        (&summary.operation_status, &summary.documents_count, &summary.id)
    )?;

    return Ok(());
}

pub fn clear_import_export_summary(db_path: &PathBuf) -> Result<()> {

    let conn = Connection::open(db_path)?;

    conn.execute(
        "DELETE FROM import_export_summary",
        ()
    )?;

    return Ok(());
}