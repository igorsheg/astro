use std::sync::Arc;

use chrono::Utc;
use futures::stream::{self, StreamExt, TryStreamExt};
use reqwest::get;
use tokio::time::{sleep, timeout, Duration, Instant};

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
) {
    loop {
        // Fetch all services
        let services = match service_repo.find(None).await {
            Ok(services) => services,
            Err(e) => {
                error!("Failed to fetch services: {:?}", e);
                continue;
            }
        };

        // Create a stream from the services and process each service concurrently
        stream::iter(services)
            .for_each_concurrent(6, |service| {
                let uptime_repo = uptime_repo.clone();
                async move {
                    match ping_service(&service).await {
                        Ok(uptime) => {
                            if let Err(e) = uptime_repo.create(uptime).await {
                                error!("Failed to create uptime entry: {:?}", e);
                            }
                        }
                        Err(e) => {
                            error!("Failed to ping service: {:?}", e);
                        }
                    };
                }
            })
            .await;

        // Wait for the specified interval
        sleep(interval).await;
    }
}

pub async fn ping_service(service: &Service) -> Result<NewUptimeDTO, AstroError> {
    let start = Instant::now();

    // Perform a GET request to the service's URL with a timeout of 10 seconds
    let response = match timeout(Duration::from_secs(3), get(&service.url)).await {
        Ok(result) => result?,
        Err(_) => {
            return Err(AstroError::HttpError(format!(
                "Request timed out for {}",
                service.name
            )))
        }
    };

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
