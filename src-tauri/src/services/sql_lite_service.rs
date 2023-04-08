use std::path::PathBuf;
use rusqlite::{Connection, Result};

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
    let dbPath = get_db_path();

    let conn = Connection::open(dbPath)?;

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
            operation_type TEXT NOT NULL,
            operation_status TEXT NOT NULL,
            documents_count INTEGER NOT NULL,
            created_on TEXT NOT NULL
        )",
        (),
    )?;

    return Ok(());
}

pub fn insert_import_export_summary(summary: &ImportExportSummary) -> Result<()> {
    let dbPath = get_db_path();

    let conn = Connection::open(dbPath)?;

    conn.execute(
        "INSERT INTO import_export_summary (id, db_name, collection_name, operation_type, operation_status, documents_count, created_on) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        (&summary.id, &summary.db_name, &summary.collection_name, &summary.operation_type, &summary.operation_status, &summary.documents_count, &summary.created_on)
    )?;

    return Ok(());
}

pub fn update_import_export_summary(summary: &ImportExportSummary) -> Result<()> {
    let dbPath = get_db_path();

    let conn = Connection::open(dbPath)?;

    conn.execute(
        "UPDATE import_export_summary SET operation_status=?1, documents_count=?2 WHERE id=?3",
        (&summary.operation_status, &summary.documents_count, &summary.id)
    )?;

    return Ok(());
}