use axum::extract::{Path, Query, State};
use axum::response::IntoResponse;
use axum::Json;
use serde::{Deserialize, Serialize};

use crate::domain::service::{InsertService, UpdateService};
use crate::infra::error::{AppError, AstroError};
use crate::AppState;

#[derive(Debug, Deserialize, Serialize)]
pub struct ListServicesFilter {
    category_id: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UpdateGridOrder {
    pub id: String,
    pub grid_order: i64,
}

pub async fn list(
    State(state): State<AppState>,
    Query(query): Query<ListServicesFilter>,
) -> Result<impl IntoResponse, AppError> {
    let repo = state.dbs.service_repo;

    match repo.list(query.category_id.as_deref()).await {
        Ok(services) => Ok(Json(services).into_response()),
        Err(err) => Err(AppError(AstroError::Axum(format!(
            "Error fetching services: {}",
            err
        )))),
    }
}

pub async fn insert(
    State(state): State<AppState>,
    Json(body): Json<InsertService>,
) -> Result<String, AppError> {
    let service = body.to_service();
    let repo = state.dbs.service_repo;

    match repo.insert(service).await {
        Ok(svc) => Ok(format!("Succesfuly created new service: {}", &svc.name)),
        Err(err) => Err(AppError(AstroError::Axum(format!(
            "Error inserting service: {}",
            err
        )))),
    }
}
pub async fn update(
    State(state): State<AppState>,
    Json(body): Json<UpdateService>,
) -> Result<String, AppError> {
    let service = body.to_service();
    let repo = state.dbs.service_repo;

    match repo.update(service).await {
        Ok(svc) => Ok(format!("Succesfuly created new service: {}", &svc.name)),
        Err(err) => Err(AppError(AstroError::Axum(format!(
            "Error inserting service: {}",
            err
        )))),
    }
}

pub async fn get_service_uptime(
    State(state): State<AppState>,
    Path(service_id): Path<String>,
) -> Result<impl IntoResponse, AppError> {
    let repo = state.dbs.uptime_repo;

    let service_uptime = repo
        .list_for_service(&service_id)
        .map_err(|err| AstroError::Axum(format!("Error fething service uptime: {}", err)))?;

    Ok(Json(service_uptime).into_response())
}

pub async fn update_grid_order(
    State(state): State<AppState>,
    Json(body): Json<Vec<UpdateGridOrder>>,
) -> Result<String, AppError> {
    let repo = state.dbs.service_repo;

    for change in body.iter() {
        let mut service = match repo.get(&change.id).await {
            Ok(s) => s,
            Err(e) => return Err(AppError(AstroError::SQLx(e))),
        };
        service.grid_order = change.grid_order;
        match repo.update(service).await {
            Ok(_) => (),
            Err(e) => return Err(AppError(AstroError::SQLx(e))),
        };
    }

    Ok(format!(
        "Successfully updated grid order for {} services",
        body.len()
    ))
}
