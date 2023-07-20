use std::{net::SocketAddr, sync::Arc};

use axum::{http::Method, routing::get, Extension};
use tower_http::cors::{Any, CorsLayer};

use crate::{
    application::services::domain::service::service::ServiceService,
    infrastructure::domain::service::repository::ServiceRepository,
    presentation::http::service::controller::{list_services, update_service},
};

pub struct Services {
    pub svc_service: Arc<ServiceService<ServiceRepository>>,
}

pub struct Server {
    host: String,
    port: u16,
    services: Services,
}

impl Server {
    pub fn new(host: String, port: u16, services: Services) -> Self {
        Self {
            host,
            port,
            services,
        }
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

        // let category_routes = axum::Router::new()
        //     .route("/", get(list_services))
        //     .layer(Extension(category_service));

        let service_routes = axum::Router::new()
            .route("/", get(list_services).patch(update_service))
            .layer(Extension(self.services.svc_service.clone()));

        let api_routes = axum::Router::new()
            // .nest("/categories", category_routes)
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
