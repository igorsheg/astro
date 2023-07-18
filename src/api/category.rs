use axum::extract::State;
use axum::{response::IntoResponse, Json};

use crate::domain::category::InsertCategory;
use crate::infra::error::{AppError, AstroError};
use crate::AppState;

pub async fn insert(
    State(state): State<AppState>,
    Json(body): Json<InsertCategory>,
) -> Result<impl IntoResponse, AppError> {
    let category = body.to_category();

    let repo = state.dbs.category_repo;
    match repo.insert(category).await {
        Ok(category) => Ok(format!(
            "Succesfuly created new category: {}",
            &category.name
        )),
        Err(err) => Err(AppError(AstroError::Axum(format!(
            "Error fetching category: {}",
            err
        )))),
    }
}

pub async fn list(State(state): State<AppState>) -> Result<impl IntoResponse, AppError> {
    let repo = state.dbs.category_repo;

    match repo.list().await {
        Ok(categories) => Ok(Json(categories).into_response()),
        Err(err) => Err(AppError(AstroError::Axum(format!(
            "Error fetching categories: {}",
            err
        )))),
    }
}
