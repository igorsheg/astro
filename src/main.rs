use axum::{routing::get, Extension, Router};
use std::{net::SocketAddr, sync::Arc};
use structopt::StructOpt;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::domain::{service::ServiceRepository, uptime::UptimeStatusRepository};

pub mod api {
    pub mod routes;
    pub mod static_paths;
}

pub mod domain {
    pub mod category;
    pub mod config;
    pub mod service;
    pub mod uptime;
}

pub mod application {
    pub mod uptime_check;
}

#[derive(Debug, StructOpt)]
#[structopt(about = "astro server running options")]
struct Opts {
    #[structopt(
        short = "a",
        long,
        default_value = "0.0.0.0:5432",
        help = "listen address"
    )]
    listen_address: String,

    #[structopt(short = "db", long, default_value = "./tmp", help = "sled db path")]
    db_store: String,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "error".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let options: Opts = Opts::from_args();
    let addr: SocketAddr = options.listen_address.as_str().parse().unwrap();

    // let db = sled::Config::default()
    //     .use_compression(true)
    //     .path(&options.db_store)
    //     .open()
    //     .unwrap();

    let db = Arc::new(
        sled::Config::default()
            .use_compression(true)
            .path(&options.db_store)
            .open()
            .unwrap(),
    );

    let uptime_tree = Arc::new(db.open_tree("my_tree").expect("Failed to open tree"));

    let service_repo = ServiceRepository::new(Arc::clone(&db));
    let status_repo = UptimeStatusRepository::new(Arc::clone(&uptime_tree));

    application::uptime_check::spawn_uptime_check_task(
        Arc::new(service_repo),
        Arc::new(status_repo),
    );

    let app = Router::new()
        .nest("/api/v1", api::routes::handler())
        .fallback(get(api::static_paths::handle_static_files))
        .layer(Extension(db))
        .layer(Extension(uptime_tree));

    tracing::debug!("listening on {}", &options.listen_address);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
