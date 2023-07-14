// use tauri::api::http::ResponseBuilder;

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use reqwest::{self, Response, StatusCode};
use serde::Serialize;

#[derive(Serialize)]
struct HttpResponse {
    status: u16,
    body: String,
    // Add other fields as needed
}

#[tauri::command]
async fn make_http_request(url: String) -> Result<HttpResponse, String> {
    let client: reqwest::Client = reqwest::Client::new();
    let response: Result<Response, reqwest::Error> = client.get(&url).send().await;

    match response {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.map_err(|err| err.to_string())?;
            if status == StatusCode::OK {
                let http_response = HttpResponse {
                    status: status.as_u16(),
                    body,
                };
                Ok(http_response)
            } else {
                Err(format!("Received non-OK status code: {}", status))
            }
        }
        Err(err) => Err(err.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![make_http_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
