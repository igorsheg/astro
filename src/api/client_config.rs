use axum::extract::{Path, State};
use axum::response::IntoResponse;
use axum::Json;

use crate::infra::error::{AppError, AstroError};
use crate::AppState;

pub async fn get(
    State(state): State<AppState>,
    Path(config_id): Path<String>,
) -> Result<impl IntoResponse, AppError> {
    let repo = state.dbs.config_repo;
    match repo.get(&config_id).await {
        Ok(services) => Ok(Json(services).into_response()),
        Err(err) => Err(AppError(AstroError::Axum(format!(
            "Error fetching config: {}",
            err
        )))),
    }
}

pub async fn list(State(state): State<AppState>) -> Result<impl IntoResponse, AppError> {
    let repo = state.dbs.config_repo;
    match repo.list().await {
        Ok(configs) => Ok(Json(configs).into_response()),
        Err(err) => Err(AppError(AstroError::Axum(format!(
            "Error fetching configs: {}",
            err
        )))),
    }
}
