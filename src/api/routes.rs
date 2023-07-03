use std::sync::Arc;

use axum::extract::Path;
use axum::http::StatusCode;
use axum::routing::post;
use axum::{response::IntoResponse, routing::get, Router};
use axum::{Extension, Json};
use chrono::Utc;
use serde_json::json;
use sled::{Db, Tree};

use crate::domain::service::{Service, ServiceRepository};
use crate::domain::uptime::UptimeStatusRepository;

pub fn handler() -> Router {
    Router::new()
        .route("/health", get(health_handler))
        .route("/services", get(get_services))
        .route("/uptime/:service_id", get(get_service_uptime))
        .route("/insert_dummy_service", post(insert_dummy_service))
}

async fn health_handler() -> impl IntoResponse {
    tracing::info!("Health Ok");
    StatusCode::OK
}

async fn get_services(Extension(db): Extension<Arc<Db>>) -> impl IntoResponse {
    let repo = ServiceRepository::new(db);
    match repo.list_all(Some("unsorted")) {
        Ok(services) => Json(services).into_response(),
        Err(e) => {
            let error = format!("Error retrieving services: {}", e);
            let json_error = Json(json!({
                "error": error,
            }));
            (StatusCode::INTERNAL_SERVER_ERROR, json_error).into_response()
        }
    }
}

async fn insert_dummy_service(Extension(db): Extension<Arc<Db>>) -> String {
    let service = Service {
        id: "dummy1".to_string(),
        name: "Dummy Service".to_string(),
        description: "This is a dummy service.".to_string(),
        logo: "https://example.com/logo.png".to_string(),
        url: "https://example.com".to_string(),
        target: "_blank".to_string(),
        tags: "dummy,service".to_string(),
        created_at: Utc::now(),
        category_id: Some("unsorted".to_string()),
    };

    let repo = ServiceRepository::new(db);
    match repo.insert(service) {
        Ok(_) => "Dummy service inserted successfully.".to_string(),
        Err(err) => format!("Failed to insert dummy service: {}", err),
    }
}

async fn get_service_uptime(
    Extension(uptime_tree): Extension<Arc<Tree>>,
    Path(service_id): Path<String>,
) -> impl IntoResponse {
    let repo = UptimeStatusRepository::new(uptime_tree);

    match repo.list_for_service(&service_id) {
        Ok(statuses) => Json(statuses).into_response(),
        Err(e) => {
            let error = format!("Error retrieving statuses: {}", e);
            let json_error = Json(json!({
                "error": error,
            }));
            (StatusCode::INTERNAL_SERVER_ERROR, json_error).into_response()
        }
    }
}
