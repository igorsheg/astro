use axum::extract::{Path, Query};
use axum::response::IntoResponse;
use axum::{Extension, Json};
use serde::Deserialize;
use std::sync::Arc;

use crate::domain::service::{InsertService, ServiceRepository};
use crate::domain::uptime::UptimeStatusRepository;
use crate::infra::error::{AppError, AstroError};
use crate::Trees;

#[derive(Debug, Deserialize)]
pub struct ListServicesFilter {
    category_id: Option<String>,
}

pub async fn list(
    Extension(trees): Extension<Trees>,
    Query(query): Query<ListServicesFilter>,
) -> Result<impl IntoResponse, AppError> {
    let repo = ServiceRepository::new(Arc::clone(&trees.services_tree));

    match repo.list(query.category_id.as_deref()) {
        Ok(services) => Ok(Json(services).into_response()),
        Err(err) => Err(AppError(AstroError::Axum(format!(
            "Error fetching services: {}",
            err
        )))),
    }
}

pub async fn insert(
    Extension(trees): Extension<Trees>,
    Json(body): Json<InsertService>,
) -> Result<String, AppError> {
    let service = body.to_service();

    let repo = ServiceRepository::new(Arc::clone(&trees.services_tree));
    repo.insert(&service)?;
    Ok(format!("Succesfuly created new service: {}", &service.name))
}

pub async fn get_service_uptime(
    Extension(trees): Extension<Trees>,
    Path(service_id): Path<String>,
) -> Result<impl IntoResponse, AppError> {
    let repo = UptimeStatusRepository::new(Arc::clone(&trees.uptime_tree));

    let service_uptime = repo
        .list_for_service(&service_id)
        .map_err(|err| AstroError::Axum(format!("Error fething service uptime: {}", err)))?;

    Ok(Json(service_uptime).into_response())
}
