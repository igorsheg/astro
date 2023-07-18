use std::sync::Arc;

use axum::{Extension, Json};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use crate::{
    application::services::domain::{
        category::service::CategoryService, service::service::ServiceService,
    },
    infrastructure::{
        domain::{
            category::repository::CategoryRepository, service::repository::ServiceRepository,
        },
        error::AppError,
    },
};

#[derive(Serialize, Deserialize)]
pub struct ServiceResponse {
    id: String,
    name: String,
    description: Option<String>,
    tags: Option<String>,
    logo: Option<String>,
    url: String,
    category_id: String,
    target: Option<String>,
    created_at: NaiveDateTime,
    grid_order: i64,
    grid_w: i64,
    grid_h: i64,
}

#[derive(Serialize, Deserialize)]
pub struct CategoryResponse {
    id: String,
    name: String,
    description: String,
    icon: String,
    created_at: NaiveDateTime,
}

pub async fn find_all(
    Extension(svc_service): Extension<Arc<ServiceService<ServiceRepository>>>,
) -> Result<Json<Vec<ServiceResponse>>, AppError> {
    match svc_service.find().await {
        Ok(users) => Ok(Json(
            users
                .into_iter()
                .map(|svc| ServiceResponse {
                    id: svc.id,
                    name: svc.name,
                    description: svc.description,
                    tags: svc.tags,
                    logo: svc.logo,
                    url: svc.url,
                    category_id: svc.category_id,
                    target: svc.target,
                    created_at: NaiveDateTime::from_timestamp_opt(svc.created_at.timestamp(), 0)
                        .unwrap(),
                    grid_order: svc.grid_order,
                    grid_w: svc.grid_w,
                    grid_h: svc.grid_h,
                })
                .collect::<Vec<ServiceResponse>>(),
        )),
        Err(e) => {
            error!("{:?}", e);
            Err(AppError::from(e))
        }
    }
}

pub async fn find_all_cetegories(
    Extension(svc_service): Extension<Arc<CategoryService<CategoryRepository>>>,
) -> Result<Json<Vec<CategoryResponse>>, AppError> {
    match svc_service.find().await {
        Ok(users) => Ok(Json(
            users
                .into_iter()
                .map(|svc| CategoryResponse {
                    id: svc.id,
                    name: svc.name,
                    description: svc.description,
                    icon: svc.icon,
                    created_at: NaiveDateTime::from_timestamp_opt(svc.created_at.timestamp(), 0)
                        .unwrap(),
                })
                .collect::<Vec<CategoryResponse>>(),
        )),
        Err(e) => {
            error!("{:?}", e);
            Err(AppError::from(e))
        }
    }
}
