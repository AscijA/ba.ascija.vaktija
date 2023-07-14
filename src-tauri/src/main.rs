// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use reqwest::{self, Response, StatusCode};
use serde::Serialize;
use tauri::Manager;
use tauri::SystemTray;
use tauri::{CustomMenuItem, SystemTrayEvent, SystemTrayMenu};

struct Labels {
    // prayers: Vec<&'static str>,
    prayer_next: &'static str,
    prayer_prev: &'static str,
    hour1: &'static str,
    hour2: &'static str,
    hour3: &'static str,
    // connection_error: &'static str,
    // time_label_first_prev: bool,
    // time_label_first_next: bool,
}

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

#[tauri::command]
fn generate_time_phrase(diff: f64) -> String {
    let labels = Labels {
        // prayers: vec!["Zora", "Iz. Sunca", "Podne", "Ikindija", "Aksam", "Jacija"],
        prayer_next: "za",
        prayer_prev: "prije",
        hour1: "sat",
        hour2: "sati",
        hour3: "sata",
        // connection_error: "No Internet Connection",
        // time_label_first_prev: true,
        // time_label_first_next: true,
    };

    let time_difference = diff;

    // Determines which label for prev or next prayer should be shown
    let before_after = if time_difference > 0.0 {
        labels.prayer_next
    } else {
        labels.prayer_prev
    };

    // If less than 1 hour, time diff will be displayed in minutes
    let mut min_or_hour = if f64::abs(f64::abs(time_difference)) < 1.0 {
        (time_difference * 60.0).round() as i32
    } else {
        time_difference.round() as i32
    };

    // Determines if the time unit is minutes or hours
    let time_difference = f64::abs(time_difference);
    let time_unit = if time_difference < 1.0 {
        "min".to_string()
    } else if (time_difference.round() as i32) >= 5 && (time_difference.round() as i32) <= 20 {
        labels.hour2.to_string()
    } else if (time_difference.round() as i32) == 1
        || ((time_difference.round() as i32) == 21 && labels.hour2 != labels.hour3)
    {
        labels.hour1.to_string()
    } else {
        labels.hour3.to_string()
    };

    min_or_hour = if before_after.to_string() == labels.prayer_prev.to_string() {
        -min_or_hour
    } else {
        min_or_hour
    };

    let time_phrase = format!("{} {} {}", before_after, min_or_hour, time_unit);
    time_phrase
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("show".to_string(), "Show");

    let tray_menu = SystemTrayMenu::new().add_item(hide).add_item(quit);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {

            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            make_http_request,
            generate_time_phrase
        ])
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
