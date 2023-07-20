use std::sync::Arc;

use axum::{debug_handler, extract::Query, Extension, Json};
use serde::Deserialize;

use crate::{
    application::services::domain::service::{dto::NewServiceDTO, service::ServiceService},
    domain::service::entity::Service,
    infrastructure::{domain::service::repository::ServiceRepository, error::AppError},
};

use super::dto::{ServiceResponse, UpdateServicePayload};

#[derive(Debug, Deserialize)]
pub struct Filter {
    category_id: Option<String>,
}

pub async fn list_services(
    Extension(svc_service): Extension<Arc<ServiceService<ServiceRepository>>>,
    Query(filter): Query<Filter>,
) -> Result<Json<Vec<ServiceResponse>>, AppError> {
    match svc_service.find(filter.category_id).await {
        Ok(users) => {
            let responses: Result<Vec<ServiceResponse>, _> =
                users.into_iter().map(ServiceResponse::try_from).collect();
            Ok(Json(responses?))
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
