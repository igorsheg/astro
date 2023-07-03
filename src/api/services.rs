use axum::extract::{Path, Query};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::{Extension, Json};
use chrono::Utc;
use serde::Deserialize;
use serde_json::json;
use sled::{Db, Tree};
use std::sync::Arc;

use crate::domain::service::{InsertService, Service, ServiceRepository};
use crate::domain::uptime::UptimeStatusRepository;

#[derive(Debug, Deserialize)]
pub struct ListServicesFilter {
    category_id: Option<String>,
}
pub async fn get_services(
    Extension(db): Extension<Arc<Db>>,
    Query(query): Query<ListServicesFilter>,
) -> impl IntoResponse {
    let repo = ServiceRepository::new(db);
    match repo.list_all(query.category_id.as_deref()) {
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

pub async fn insert_service(
    Extension(db): Extension<Arc<Db>>,
    Json(body): Json<InsertService>,
) -> String {
    let service = Service {
        id: uuid::Uuid::new_v4().to_string(),
        name: body.name,
        description: body.description.unwrap_or("".to_string()),
        logo: body.logo.unwrap_or("".to_string()),
        url: body.url.unwrap_or("".to_string()),
        target: body.target.unwrap_or("_blank".to_string()),
        tags: body.tags.unwrap_or("".to_string()),
        created_at: Utc::now(),
        category_id: Some(body.category_id.unwrap_or("unsorted".to_string())),
    };

    let repo = ServiceRepository::new(db);
    match repo.insert(service) {
        Ok(_) => "Service inserted successfully.".to_string(),
        Err(err) => format!("Failed to insert  service: {}", err),
    }
}

pub async fn get_service_uptime(
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
