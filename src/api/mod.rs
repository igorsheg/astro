use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{get, post, Router};

mod services;
pub mod static_paths;

pub fn handler() -> Router {
    Router::new()
        .route("/health", get(health_handler))
        .route("/services", get(services::get_services))
        .route("/service", post(services::insert_service))
        .route("/uptime/:service_id", get(services::get_service_uptime))
}

async fn health_handler() -> impl IntoResponse {
    tracing::info!("Health Ok");
    StatusCode::OK
}
