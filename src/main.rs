use std::sync::Arc;

use application::services::domain::service::service::ServiceService;
use configuration::configuration::Configuration;
use infrastructure::{
    database::{get_db_pool, ping},
    domain::service::repository::ServiceRepository,
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

    let service_repository = ServiceRepository::new(db_pool.clone());
    let svc_service = Arc::new(ServiceService::new(service_repository));

    let server = presentation::http::server::Server::new(
        config.server.host,
        config.server.port.parse().unwrap(),
        Services { svc_service },
    );

    server.run().await;

    Ok(())
}
