use chrono::{DateTime, Utc};
use std::sync::Arc;
use tokio::task::JoinHandle;

use crate::{
    domain::{
        service::{Service, ServiceRepository},
        uptime::{UptimeStatus, UptimeStatusRepository},
    },
    infra::error::AstroError,
};

// imports...

async fn check_service(
    client: &reqwest::Client,
    service: &Service,
) -> Result<UptimeStatus, AstroError> {
    let start = std::time::Instant::now();
    match client.head(&service.url).send().await {
        Ok(response) => {
            let latency = start.elapsed().as_millis();
            let uptime = response.status().is_success();
            Ok(UptimeStatus {
                service_id: service.id.clone(),
                checked_at: Utc::now(),
                uptime,
                latency,
            })
        }
        Err(e) => Err(AstroError::Reqwest(e)),
    }
}

pub fn spawn_uptime_check_task(
    service_repo: Arc<ServiceRepository>,
    status_repo: Arc<UptimeStatusRepository>,
) -> JoinHandle<Result<(), AstroError>> {
    tokio::task::spawn(async move {
        let client = reqwest::Client::new();
        loop {
            let services = service_repo.list(None)?; // Already returns AstroError
            for service in services {
                let status = check_service(&client, &service).await?;
                log::debug!("Writing uptime status {:?}", status);
                status_repo.insert(&status)?; // Already returns AstroError
            }

            let now = Utc::now();
            let target_time: DateTime<Utc> = now + chrono::Duration::minutes(5);
            let wait_duration = (target_time - now).to_std().unwrap();
            tokio::time::sleep(wait_duration).await;
        }
    })
}
