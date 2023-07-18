use chrono::{DateTime, NaiveDateTime, Utc};
use sqlx::FromRow;

use crate::domain::service::entity::Service;

#[derive(Debug, FromRow)]
pub(crate) struct ServiceDTO {
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

impl From<ServiceDTO> for Service {
    fn from(dto: ServiceDTO) -> Self {
        Self {
            id: dto.id,
            name: dto.name,
            description: dto.description,
            logo: dto.logo,
            url: dto.url,
            target: dto.target,
            tags: dto.tags,
            created_at: DateTime::<Utc>::from_utc(dto.created_at, Utc {}),
            category_id: dto.category_id,
            grid_order: dto.grid_order,
            grid_w: dto.grid_w,
            grid_h: dto.grid_h,
        }
    }
}
