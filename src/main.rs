use std::{sync::Arc, time::Duration};

use application::services::{
    domain::{service::service::ServiceService, uptime::uptime::UptimeService},
    uptime_task::periodic_ping,
};
use configuration::configuration::Configuration;
use infrastructure::{
    database::{get_db_pool, ping},
    domain::service::repository::ServiceRepository,
    domain::uptime::repository::UptimeRepository,
};
use presentation::http::server::Services;
use sqlx::migrate::Migrator;

#[macro_use]
extern crate log;

mod application;
mod configuration;
mod domain;
mod infrastructure;
mod presentation;

static MIGRATOR: Migrator = sqlx::migrate!();

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let config = Configuration::new();
    env_logger::init();

    let db_pool = get_db_pool()
        .await
        .expect("Unable to connect to the database");
    ping().await.expect("Unable to ping the database");
    MIGRATOR
        .run(&db_pool)
        .await
        .expect("Unable to run migrations");

    let uptime_repository = UptimeRepository::new(db_pool.clone());
    let uptime_service = Arc::new(UptimeService::new(uptime_repository));

    let service_repository = ServiceRepository::new(db_pool.clone());
    let svc_service = Arc::new(ServiceService::new(service_repository));

    // Create the ping interval
    let ping_interval = Duration::from_secs(30); // 5 minutes

    // Start the periodic ping task
    tokio::spawn(periodic_ping(
        svc_service.clone(),
        uptime_service.clone(),
        ping_interval,
    ));

    let server = presentation::http::server::Server::new(
        config.server.host,
        config.server.port.parse().unwrap(),
        Services {
            svc_service,
            uptime_service,
        },
    );

    server.run().await;

    Ok(())
}
