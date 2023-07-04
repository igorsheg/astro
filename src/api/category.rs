use std::sync::Arc;

use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use serde_json::json;

use crate::domain::category::{Category, CategoryRepository, InsertCategory};
use crate::Trees;

pub async fn insert(
    Extension(trees): Extension<Trees>,
    Json(body): Json<InsertCategory>,
) -> String {
    let category = Category {
        id: uuid::Uuid::new_v4().to_string(),
        name: body.name,
        description: body.description.unwrap_or("".to_string()),
        icon: body.icon.unwrap_or("".to_string()),
    };

    let repo = CategoryRepository::new(Arc::clone(&trees.categories_tree));
    match repo.insert(category) {
        Ok(_) => "Category inserted successfully.".to_string(),
        Err(err) => format!("Failed to insert category: {}", err),
    }
}

pub async fn list(Extension(trees): Extension<Trees>) -> impl IntoResponse {
    let repo = CategoryRepository::new(Arc::clone(&trees.categories_tree));
    match repo.list() {
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
