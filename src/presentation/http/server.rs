use std::{net::SocketAddr, sync::Arc};

use axum::{http::Method, routing::get, Extension};
use tower_http::cors::{Any, CorsLayer};

use crate::{
    application::services::domain::{
        category::service::CategoryService, service::service::ServiceService,
    },
    infrastructure::{
        database::get_db_pool,
        domain::{
            category::repository::CategoryRepository, service::repository::ServiceRepository,
        },
    },
    presentation::http::handler,
};

pub struct Server {
    host: String,
    port: u16,
}

impl Server {
    pub fn new(host: String, port: u16) -> Self {
        Self { host, port }
    }

    pub async fn run(&self) {
        let addr: SocketAddr = format!("{}:{}", self.host, self.port)
            .parse()
            .expect("Unable to parse address");

        let cors = CorsLayer::new()
            .allow_methods(vec![
                Method::GET,
                Method::POST,
                Method::PATCH,
                Method::PUT,
                Method::OPTIONS,
            ])
            .allow_origin(Any)
            .allow_headers(vec![
                axum::http::header::CONTENT_TYPE,
                axum::http::header::CACHE_CONTROL,
                axum::http::header::AUTHORIZATION,
            ]);

        let sqlite_db = get_db_pool()
            .await
            .expect("Unable to connect to the database");

        let service_repository = ServiceRepository::new(sqlite_db.clone());
        let service_service = Arc::new(ServiceService::new(service_repository));

        let category_repository = CategoryRepository::new(sqlite_db.clone());
        let category_service = Arc::new(CategoryService::new(category_repository));

        let category_routes = axum::Router::new()
            .route("/", get(handler::find_all_cetegories))
            .layer(Extension(category_service));

        let service_routes = axum::Router::new()
            .route("/", get(handler::find_all))
            .layer(Extension(service_service));

        let api_routes = axum::Router::new()
            .nest("/categories", category_routes)
            .nest("/services", service_routes);
        // let api_routes = axum::Router::new().nest("/services", service_routes);

        let app = axum::Router::new().nest("/api/v1", api_routes).layer(cors);

        debug!("listening on {}", &addr);

        axum::Server::bind(&addr)
            .serve(app.into_make_service())
            .await
            .unwrap();

        println!("Server running on port {}", self.port);
    }
}
