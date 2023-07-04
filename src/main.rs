use axum::{http::Method, routing::get, Extension, Router};
use sled::Tree;
use std::{net::SocketAddr, sync::Arc};
use structopt::StructOpt;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::{
    domain::{
        category::CategoryRepository,
        client_config::{setup_default_config, ConfigRepository},
        service::ServiceRepository,
        uptime::UptimeStatusRepository,
    },
    utils::example_seed::seed_sample_data,
};

pub mod api;

pub mod domain {
    pub mod category;
    pub mod client_config;
    pub mod config;
    pub mod service;
    pub mod uptime;
}

pub mod application {
    pub mod uptime_check;
}

pub mod infra {
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

    #[structopt(short = "db", long, default_value = "./tmp", help = "sled db path")]
    db_store: String,
}
#[derive(Clone)]
pub struct Trees {
    pub services_tree: Arc<Tree>,
    pub configs_tree: Arc<Tree>,
    pub categories_tree: Arc<Tree>,
    pub uptime_tree: Arc<Tree>,
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

    let db = Arc::new(
        sled::Config::default()
            .use_compression(true)
            .path(&options.db_store)
            .open()
            .unwrap(),
    );

    let services_tree = Arc::new(
        db.open_tree("services_tree")
            .expect("Failed to open services_tree"),
    );
    let configs_tree = Arc::new(
        db.open_tree("configs_tree")
            .expect("Failed to open configs_tree"),
    );
    let categories_tree = Arc::new(
        db.open_tree("categories_tree")
            .expect("Failed to open categories_tree"),
    );
    let uptime_tree = Arc::new(
        db.open_tree("uptime_tree")
            .expect("Failed to open uptime_tree"),
    );

    let trees = Trees {
        services_tree,
        configs_tree,
        categories_tree,
        uptime_tree,
    };

    // let uptime_tree = Arc::new(db.open_tree("uptime_tree").expect("Failed to open tree"));
    //
    let service_repo = ServiceRepository::new(Arc::clone(&trees.services_tree));
    let category_repo = CategoryRepository::new(Arc::clone(&trees.categories_tree));
    let status_repo = UptimeStatusRepository::new(Arc::clone(&trees.uptime_tree));
    let config_repo = ConfigRepository::new(Arc::clone(&trees.configs_tree));

    let _ = seed_sample_data(&config_repo, &category_repo, &service_repo);

    application::uptime_check::spawn_uptime_check_task(
        Arc::new(service_repo),
        Arc::new(status_repo),
    );
    //
    // let client_configs_tree = Arc::new(
    //     db.open_tree("client_configs_tree")
    //         .expect("Failed to open tree"),
    // );
    // let config_repo = ConfigRepository::new(Arc::clone(&trees.configs_tree));
    //
    // setup_default_config(&config_repo).await;

    let cors = CorsLayer::new()
        .allow_methods(vec![Method::GET])
        .allow_origin(Any)
        .allow_headers(vec![
            axum::http::header::CONTENT_TYPE,
            axum::http::header::CACHE_CONTROL,
        ]);

    let app = Router::new()
        .nest("/api/v1", api::handler())
        .fallback(get(api::static_paths::handle_static_files))
        .layer(Extension(trees))
        .layer(cors);

    log::debug!("listening on {}", &options.listen_address);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
