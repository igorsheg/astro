use std::convert::TryFrom;

use chrono::{DateTime, NaiveDateTime, Utc};

use crate::{domain::service::entity::Service, infrastructure::error::AstroError};

pub struct NewServiceDTO {
    pub(crate) id: String,
    pub(crate) name: String,
    pub(crate) description: Option<String>,
    pub(crate) tags: Option<String>,
    pub(crate) logo: Option<String>,
    pub(crate) url: String,
    pub(crate) category_id: String,
    pub(crate) target: Option<String>,
    pub(crate) created_at: NaiveDateTime,
    pub(crate) grid_order: i64,
    pub(crate) grid_w: i64,
    pub(crate) grid_h: i64,
}

impl TryFrom<NewServiceDTO> for Service {
    type Error = AstroError;

    fn try_from(dto: NewServiceDTO) -> Result<Self, Self::Error> {
        Ok(Service {
            id: dto.id,
            name: dto.name,
            description: dto.description,
            tags: dto.tags,
            url: dto.url,
            logo: dto.logo,
            category_id: dto.category_id,
            target: dto.target,
            created_at: DateTime::<Utc>::from_utc(dto.created_at, Utc {}),
            grid_order: dto.grid_order,
            grid_w: dto.grid_w,
            grid_h: dto.grid_h,
        })
    }
}
