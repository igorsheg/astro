use std::sync::Arc;

use axum::{extract::Query, Extension, Json};
use serde::Deserialize;

use crate::{
    application::services::domain::{
        service::{dto::NewServiceDTO, service::ServiceService},
        uptime::uptime::UptimeService,
    },
    domain::service::entity::Service,
    infrastructure::{
        domain::{service::repository::ServiceRepository, uptime::repository::UptimeRepository},
        error::AppError,
    },
};

use super::dto::{
    ServiceResponse, ServiceWithUptime, UpdateServicePayload, UpdateServicesOrderPayload,
};

#[derive(Debug, Deserialize)]
pub struct Filter {
    category_id: Option<String>,
}

pub async fn list_services(
    Extension(svc_service): Extension<Arc<ServiceService<ServiceRepository>>>,
    Extension(uptime_service): Extension<Arc<UptimeService<UptimeRepository>>>,
    Query(filter): Query<Filter>,
) -> Result<Json<Vec<ServiceResponse>>, AppError> {
    match svc_service.find(filter.category_id).await {
        Ok(services) => {
            let mut responses = Vec::new();
            for service in services {
                let uptime_status = uptime_service.find(Some(service.id.clone())).await?;
                let service_with_uptime = ServiceWithUptime {
                    service,
                    uptime_status,
                };
                let response = ServiceResponse::try_from(service_with_uptime)?;
                responses.push(response);
            }
            Ok(Json(responses))
        }
        Err(e) => {
            error!("{:?}", e);
            Err(AppError::from(e))
        }
    }
}

pub async fn update_service(
    Extension(svc_service): Extension<Arc<ServiceService<ServiceRepository>>>,
    Json(body): Json<UpdateServicePayload>,
) -> Result<Json<Service>, AppError> {
    let body_id = body.id.clone();

    let new_service = NewServiceDTO {
        id: body.id,
        name: body.name,
        description: body.description,
        tags: body.tags,
        logo: body.logo,
        url: body.url,
        category_id: body.category_id,
        target: body.target,
        created_at: body.created_at,
        grid_order: body.grid_order,
        grid_w: body.grid_w,
        grid_h: body.grid_h,
    };

    match svc_service.update(&body_id, new_service).await {
        Ok(user) => Ok(Json(user)),
        Err(e) => {
            error!("{:?}", e);
            Err(AppError::from(e))
        }
    }
}

pub async fn update_services_order(
    Extension(svc_service): Extension<Arc<ServiceService<ServiceRepository>>>,
    Json(body): Json<Vec<UpdateServicesOrderPayload>>,
) -> Result<Json<()>, AppError> {
    let services: Vec<(String, i64)> = body
        .iter()
        .map(|service| (service.id.clone(), service.grid_order))
        .collect();

    match svc_service.update_batch_order(&services).await {
        Ok(_) => Ok(Json(())),
        Err(e) => {
            error!("{:?}", e);
            Err(AppError::from(e))
        }
    }
}
