use chrono::NaiveDateTime;
use sqlx::FromRow;

use crate::domain::uptime::entity::Uptime;

#[derive(Debug, FromRow)]
pub(crate) struct UptimeDTO {
    service_id: String,
    checked_at: NaiveDateTime,
    ok: bool,
    latency: i64, // latency in milliseconds
}

impl From<UptimeDTO> for Uptime {
    fn from(dto: UptimeDTO) -> Self {
        Self {
            service_id: dto.service_id,
            checked_at: dto.checked_at,
            ok: dto.ok,
            latency: dto.latency,
        }
    }
}
