use axum::{http::Method, routing::get, Router};
use std::{net::SocketAddr, sync::Arc};
use structopt::StructOpt;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::domain::{
    category::CategoryRepository, client_config::ConfigRepository, service::ServiceRepository,
    uptime::UptimeStatusRepository,
};

pub mod api;

pub mod domain {
    pub mod category;
    pub mod client_config;
    pub mod service;
    pub mod uptime;
}

pub mod application {
    pub mod uptime_check;
}

pub mod infra {
    pub mod db;
    pub mod error;
}

pub mod utils {
    pub mod example_seed;
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

    #[structopt(short = "db", long, help = "Sqlite database path")]
    db_path: String,
}

#[derive(Clone)]
pub struct AppState {
    dbs: DbState,
}

#[derive(Clone)]
pub struct DbState {
    service_repo: ServiceRepository,
    config_repo: ConfigRepository,
    category_repo: CategoryRepository,
    uptime_repo: UptimeStatusRepository,
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

    let sqlite_db_path = format!("sqlite://{}/{}", options.db_path, "astro.sqlite");
    println!("sqlite_db_path: {}", sqlite_db_path);

    let sqlite_db = infra::db::create_pool(&sqlite_db_path).await;

    let sled_db = Arc::new(
        sled::Config::default()
            .use_compression(true)
            .path(&options.db_path)
            .open()
            .unwrap(),
    );

    let service_repo = ServiceRepository::new(Arc::clone(&sqlite_db));
    let category_repo = CategoryRepository::new(Arc::clone(&sqlite_db));
    let config_repo = ConfigRepository::new(Arc::clone(&sqlite_db)); // If you have `ConfigRepository`

    let uptime_tree = Arc::new(
        sled_db
            .open_tree("uptime_tree")
            .expect("Failed to open uptime_tree"),
    );

    let uptime_repo = UptimeStatusRepository::new(Arc::clone(&uptime_tree));

    let app_state = AppState {
        dbs: DbState {
            service_repo,
            config_repo, // if exists
            category_repo,
            uptime_repo,
        },
    };

    let cors = CorsLayer::new()
        .allow_methods(vec![Method::GET, Method::POST, Method::PATCH])
        .allow_origin(Any)
        .allow_headers(vec![
            axum::http::header::CONTENT_TYPE,
            axum::http::header::CACHE_CONTROL,
        ]);

    let app = Router::new()
        .nest("/api/v1", api::handler())
        .fallback(get(api::static_paths::handle_static_files))
        .layer(cors)
        .with_state(app_state);

    log::debug!("listening on {}", &options.listen_address);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
