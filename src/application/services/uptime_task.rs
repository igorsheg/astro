use std::{sync::Arc, time::Duration};

use chrono::Utc;
use reqwest::get;
use tokio::time::{sleep, Instant};

use crate::{
    domain::service::entity::Service,
    infrastructure::{
        domain::{service::repository::ServiceRepository, uptime::repository::UptimeRepository},
        error::AstroError,
    },
};

use super::domain::{
    service::service::ServiceService,
    uptime::{dto::NewUptimeDTO, uptime::UptimeService},
};

pub async fn periodic_ping(
    service_repo: Arc<ServiceService<ServiceRepository>>,
    uptime_repo: Arc<UptimeService<UptimeRepository>>,
    interval: Duration,
) -> Result<(), AstroError> {
    loop {
        // Fetch all services
        let services = service_repo.find(None).await?;

        // Ping each service
        for service in services {
            let uptime = ping_service(&service).await?;

            info!("Pinged service: {:?}", uptime);
            let _ = uptime_repo.create(uptime).await;
        }

        // Wait for the specified interval
        sleep(interval).await;
    }
}

pub async fn ping_service(service: &Service) -> Result<NewUptimeDTO, AstroError> {
    let start = Instant::now();

    // Perform a GET request to the service's URL
    let response = get(&service.url).await?;

    let elapsed = start.elapsed();

    // Check the HTTP status code of the response
    let ok = response.status().is_success();
    let latency = elapsed.as_millis() as i64;

    Ok(NewUptimeDTO {
        service_id: service.id.clone(),
        checked_at: Utc::now().naive_utc(),
        ok,
        latency,
    })
}
