#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod services;
mod models;

use mongodb::bson::{doc, Document};
use services::mongo_service;
use models::dtos::DbWithCollections;
use models::errors::CustomError;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn check_mongo_url(url: &str) -> Result<bool, ()> {
  return Ok(mongo_service::validate_url(url).await);
}

#[tauri::command(async)]
async fn get_collection_documents(db_name: &str, collection_name: &str, filters: &str, limit: i64, skip: u64) -> Result<Vec<Document>, CustomError> {
  return mongo_service::get_collection_documents(db_name, collection_name, filters, limit, skip).await;
}

#[tauri::command(async)]
async fn get_collection_documents_count(db_name: &str, collection_name: &str, filters: &str) -> Result<u64, CustomError> {
  return mongo_service::get_collection_documents_count(db_name, collection_name, filters).await;
}

#[tauri::command]
async fn get_dbs_with_collections() -> Result<Vec<DbWithCollections>, CustomError> {
  return mongo_service::get_dbs_with_collections().await;
}

#[tauri::command(async)]
async fn dbs_with_stats() -> Result<Vec<Document>, CustomError> {
  return mongo_service::get_dbs_stats().await;
}

#[tauri::command(async)]
async fn export_collection(db_name: &str, collection_name: &str, path: &str) -> Result<String, CustomError> {
  return mongo_service::export_collection(db_name, collection_name, path).await;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![check_mongo_url, get_dbs_with_collections, dbs_with_stats, get_collection_documents, get_collection_documents_count, export_collection])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
