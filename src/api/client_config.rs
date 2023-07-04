use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::{Extension, Json};
use serde_json::json;
use std::sync::Arc;

use crate::domain::client_config::ConfigRepository;
use crate::Trees;

pub async fn get(
    Extension(trees): Extension<Trees>,
    Path(config_id): Path<String>,
) -> impl IntoResponse {
    let repo = ConfigRepository::new(Arc::clone(&trees.configs_tree));
    match repo.get(&config_id) {
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

pub async fn list(Extension(trees): Extension<Trees>) -> impl IntoResponse {
    let repo = ConfigRepository::new(Arc::clone(&trees.configs_tree));
    match repo.list() {
        Ok(configs) => Json(configs).into_response(),
        Err(e) => {
            let error = format!("Error retrieving services: {}", e);
            let json_error = Json(json!({
                "error": error,
            }));
            (StatusCode::INTERNAL_SERVER_ERROR, json_error).into_response()
        }
    }
}
