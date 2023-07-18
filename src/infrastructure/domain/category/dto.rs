use chrono::{DateTime, NaiveDateTime, Utc};
use sqlx::FromRow;

use crate::domain::category::entity::Category;

#[derive(Debug, FromRow)]
pub(crate) struct CategoryDTO {
    id: String,
    name: String,
    description: String,
    icon: String,
    created_at: NaiveDateTime,
}

impl From<CategoryDTO> for Category {
    fn from(dto: CategoryDTO) -> Self {
        Self {
            id: dto.id,
            name: dto.name,
            description: dto.description,
            icon: dto.icon,
            created_at: DateTime::<Utc>::from_utc(dto.created_at, Utc {}),
        }
    }
}
