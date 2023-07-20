use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use crate::{
    domain::{service::entity::Service, uptime::entity::Uptime},
    infrastructure::error::AppError,
};

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
    pub uptime_status: Vec<UptimeResponse>,
}

impl TryFrom<(Service, Vec<Uptime>)> for ServiceResponse {
    type Error = AppError; // Replace with your actual error type

    fn try_from(service_with_uptime: (Service, Vec<Uptime>)) -> Result<Self, Self::Error> {
        let (service, uptime_status) = service_with_uptime;
        let uptime_status = uptime_status
            .into_iter()
            .map(UptimeResponse::try_from)
            .collect::<Result<Vec<_>, _>>()?;
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
            uptime_status,
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

#[derive(Serialize, Deserialize)]
pub struct UpdateServicesOrderPayload {
    pub id: String,
    pub grid_order: i64,
}

#[derive(Serialize, Deserialize)]
pub struct UptimeResponse {
    pub service_id: String,
    pub checked_at: NaiveDateTime,
    pub ok: bool,
    pub latency: i64, // latency in milliseconds
}

impl TryFrom<Uptime> for UptimeResponse {
    type Error = AppError;

    fn try_from(uptime: Uptime) -> Result<Self, Self::Error> {
        Ok(Self {
            service_id: uptime.service_id,
            ok: uptime.ok,
            latency: uptime.latency,
            checked_at: uptime.checked_at,
        })
    }
}

pub struct ServiceWithUptime {
    pub service: Service,
    pub uptime_status: Vec<Uptime>,
}

impl TryFrom<ServiceWithUptime> for ServiceResponse {
    type Error = AppError; // Replace with your actual error type

    fn try_from(service_with_uptime: ServiceWithUptime) -> Result<Self, Self::Error> {
        let uptime_status = service_with_uptime
            .uptime_status
            .into_iter()
            .map(UptimeResponse::try_from)
            .collect::<Result<Vec<_>, _>>()?;

        Ok(Self {
            id: service_with_uptime.service.id,
            name: service_with_uptime.service.name,
            description: service_with_uptime.service.description,
            tags: service_with_uptime.service.tags,
            logo: service_with_uptime.service.logo,
            url: service_with_uptime.service.url,
            category_id: service_with_uptime.service.category_id,
            target: service_with_uptime.service.target,
            created_at: service_with_uptime.service.created_at,
            grid_order: service_with_uptime.service.grid_order,
            grid_w: service_with_uptime.service.grid_w,
            grid_h: service_with_uptime.service.grid_h,
            uptime_status,
        })
    }
}
