use std::sync::Arc;

use axum::{response::IntoResponse, Extension, Json};

use crate::domain::category::{CategoryRepository, InsertCategory};
use crate::infra::error::{AppError, AstroError};
use crate::Trees;

pub async fn insert(
    Extension(trees): Extension<Trees>,
    Json(body): Json<InsertCategory>,
) -> Result<impl IntoResponse, AppError> {
    let category = body.to_category();

    let repo = CategoryRepository::new(Arc::clone(&trees.categories_tree));
    repo.insert(&category)?;
    Ok(format!(
        "Succesfuly created new service: {}",
        &category.name
    ))
}

pub async fn list(Extension(trees): Extension<Trees>) -> Result<impl IntoResponse, AppError> {
    let repo = CategoryRepository::new(Arc::clone(&trees.categories_tree));

    match repo.list() {
        Ok(categories) => Ok(Json(categories).into_response()),
        Err(err) => Err(AppError(AstroError::Axum(format!(
            "Error fetching categories: {}",
            err
        )))),
    }
}
