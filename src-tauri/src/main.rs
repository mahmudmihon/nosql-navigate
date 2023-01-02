#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod services;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn check_mongo_url(url: &str) -> Result<bool, ()> {
    return Ok(services::mongo_service::validate_url(url).await);
}

#[tauri::command]
fn connection_check() {
  services::mongo_service::connection_check();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![check_mongo_url, connection_check])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
