use std::sync::Arc;

use chrono::{DateTime, Utc};
use tokio::task::JoinHandle;

use crate::domain::{
    service::ServiceRepository,
    uptime::{UptimeStatus, UptimeStatusRepository},
};
// imports...

pub fn spawn_uptime_check_task(
    service_repo: Arc<ServiceRepository>,
    status_repo: Arc<UptimeStatusRepository>,
) -> JoinHandle<()> {
    tokio::task::spawn(async move {
        let client = reqwest::Client::new();
        loop {
            match service_repo.list_all(None) {
                Ok(services) => {
                    for service in services {
                        let start = std::time::Instant::now(); // Start time measurement
                        let status = match client.head(&service.url).send().await {
                            Ok(response) => {
                                let latency = start.elapsed().as_millis(); // Compute latency
                                let uptime = response.status().is_success();
                                UptimeStatus {
                                    service_id: service.id.clone(),
                                    checked_at: Utc::now(),
                                    uptime,
                                    latency,
                                }
                            }
                            Err(e) => {
                                eprintln!("Error pinging service: {}", e);
                                UptimeStatus {
                                    service_id: service.id.clone(),
                                    checked_at: Utc::now(),
                                    uptime: false,
                                    latency: 0,
                                }
                            }
                        };

                        tracing::info!("Wrigin uptime status {:?}", status);

                        if let Err(e) = status_repo.insert(&status) {
                            eprintln!("Error inserting status: {}", e);
                        }
                    }
                }
                Err(e) => {
                    eprintln!("Error listing services: {}", e);
                }
            }

            let now = Utc::now();
            let target_time: DateTime<Utc> = now + chrono::Duration::minutes(5);
            let wait_duration = (target_time - now).to_std().unwrap();

            tokio::time::sleep(wait_duration).await; // Changed from sleep to tokio::time::sleep
        }
    })
}
