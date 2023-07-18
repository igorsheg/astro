use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{get, patch, post, Router};

use crate::AppState;

mod category;
mod client_config;
mod service;
pub mod static_paths;
mod upload;

pub fn handler() -> Router<AppState> {
    let general_routes = Router::new().route("/health", get(health_handler));

    let services_routes = Router::new()
        .route("/services", get(service::list))
        .route("/services", post(service::insert))
        .route("/services", patch(service::update))
        .route("/services/grid_order", patch(service::update_grid_order))
        .route("/uptime/:service_id", get(service::get_service_uptime));

    let categories_routes = Router::new()
        .route("/categories", get(category::list))
        .route("/categories", post(category::insert));

    let config_routes = Router::new()
        .route("/configs/:config_id", get(client_config::get))
        .route("/configs", get(client_config::list));

    let file_routes = Router::new().route("/upload", post(upload::upload_handler));

    Router::merge(services_routes, categories_routes)
        .merge(general_routes)
        .merge(config_routes)
        .merge(file_routes)
}

async fn health_handler() -> impl IntoResponse {
    log::info!("Health Ok");
    StatusCode::OK
}
