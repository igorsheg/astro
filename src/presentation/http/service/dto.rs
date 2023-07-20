use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use crate::{domain::service::entity::Service, infrastructure::error::AppError};

#[derive(Serialize, Deserialize)]
pub struct ServiceResponse {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub tags: Option<String>,
    pub logo: Option<String>,
    pub url: String,
    pub category_id: String,
    pub target: Option<String>,
    pub created_at: NaiveDateTime,
    pub grid_order: i64,
    pub grid_w: i64,
    pub grid_h: i64,
}

impl TryFrom<Service> for ServiceResponse {
    type Error = AppError; // Replace with your actual error type

    fn try_from(service: Service) -> Result<Self, Self::Error> {
        Ok(Self {
            id: service.id,
            name: service.name,
            description: service.description,
            tags: service.tags,
            logo: service.logo,
            url: service.url,
            category_id: service.category_id,
            target: service.target,
            created_at: service.created_at,
            grid_order: service.grid_order,
            grid_w: service.grid_w,
            grid_h: service.grid_h,
        })
    }
}

#[derive(Serialize, Deserialize)]
pub struct UpdateServicePayload {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub tags: Option<String>,
    pub logo: Option<String>,
    pub url: String,
    pub category_id: String,
    pub target: Option<String>,
    pub created_at: NaiveDateTime,
    pub grid_order: i64,
    pub grid_w: i64,
    pub grid_h: i64,
}
