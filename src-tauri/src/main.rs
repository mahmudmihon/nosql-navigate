#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod services;
mod models;

use services::mongo_service;
use models::dtos::DbWithCollections;
use models::errors::CustomError;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn check_mongo_url(url: &str) -> Result<bool, ()> {
    return Ok(mongo_service::validate_url(url).await);
}

#[tauri::command]
async fn get_dbs_with_collections() -> Result<Vec<DbWithCollections>, CustomError> {
  return mongo_service::get_dbs_with_collections().await;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![check_mongo_url, get_dbs_with_collections])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
