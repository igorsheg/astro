use std::convert::TryFrom;

use chrono::{DateTime, NaiveDateTime, Utc};

use crate::{domain::category::entity::Category, infrastructure::error::AstroError};

pub struct NewCategoryDTO {
    pub(crate) id: String,
    pub(crate) name: String,
    pub(crate) description: String,
    pub(crate) icon: String,
    pub(crate) created_at: NaiveDateTime,
}

impl TryFrom<NewCategoryDTO> for Category {
    type Error = AstroError;

    fn try_from(dto: NewCategoryDTO) -> Result<Self, Self::Error> {
        Ok(Category {
            id: dto.id,
            name: dto.name,
            description: dto.description,
            icon: dto.icon,
            created_at: DateTime::<Utc>::from_utc(dto.created_at, Utc {}),
        })
    }
}
