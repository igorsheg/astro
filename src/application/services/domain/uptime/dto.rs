use std::convert::TryFrom;

use chrono::NaiveDateTime;

use crate::{domain::uptime::entity::Uptime, infrastructure::error::AstroError};

#[derive(Debug)]
pub struct NewUptimeDTO {
    pub(crate) service_id: String,
    pub(crate) checked_at: NaiveDateTime,
    pub(crate) ok: bool,
    pub(crate) latency: i64, // latency in milliseconds
}

impl TryFrom<NewUptimeDTO> for Uptime {
    type Error = AstroError;

    fn try_from(dto: NewUptimeDTO) -> Result<Self, Self::Error> {
        Ok(Uptime {
            service_id: dto.service_id,
            checked_at: dto.checked_at,
            ok: dto.ok,
            latency: dto.latency,
        })
    }
}
