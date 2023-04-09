use std::path::PathBuf;
use rusqlite::{Connection, Result};
use uuid::Uuid;

use crate::models::dtos::ImportExportSummary;

fn get_db_path() -> PathBuf {
    match project_root::get_project_root() {
        Ok(root_path) => {
            return  root_path.join("db").join("navigateDb.db");
        },
        Err(e) => return PathBuf::new()
    };
}

pub fn create_initial_tables() -> Result<()> {
    let db_path = get_db_path();

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

pub fn save_db_connection(connection_name: &str, connection_url: &str) -> Result<()> {
    let db_path = get_db_path();

    let conn = Connection::open(db_path)?;

    let id = Uuid::new_v4().to_string();

    conn.execute(
        "INSERT INTO saved_connections (id, connection_name, connection_url) VALUES (?1, ?2, ?3)",
        (id, connection_name, connection_url)
    )?;

    return Ok(());
}

pub fn delete_db_connection(id: &str) -> Result<()> {
    let db_path = get_db_path();

    let conn = Connection::open(db_path)?;

    conn.execute(
        "DELETE FROM saved_connections WHERE id=?1", 
        [id]
    )?;

    return Ok(());
}

pub fn insert_import_export_summary(summary: &ImportExportSummary) -> Result<()> {
    let db_path = get_db_path();

    let conn = Connection::open(db_path)?;

    conn.execute(
        "INSERT INTO import_export_summary (id, db_name, collection_name, path, operation_type, operation_status, documents_count, created_on) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        (summary.id, summary.db_name, summary.collection_name, summary.path, summary.operation_type, summary.operation_status, summary.documents_count, summary.created_on)
    )?;

    return Ok(());
}

pub fn update_import_export_summary(summary: &ImportExportSummary) -> Result<()> {
    let db_path = get_db_path();

    let conn = Connection::open(db_path)?;

    conn.execute(
        "UPDATE import_export_summary SET operation_status=?1, documents_count=?2 WHERE id=?3",
        (summary.operation_status, summary.documents_count, summary.id)
    )?;

    return Ok(());
}