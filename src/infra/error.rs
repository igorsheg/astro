use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AstroError {
    #[error("reqwest error")]
    Reqwest(#[from] reqwest::Error),

    #[error("sled error: {0}")]
    Sled(#[from] sled::Error),

    #[error("bincode error")]
    Bincode(#[from] bincode::Error),

    #[error("axum error: {0}")]
    Axum(String),

    #[error("sqlx error: {0}")]
    SQLx(#[from] sqlx::Error),

    #[error("other error")]
    Other(&'static str),
}

pub struct AppError(pub AstroError);

// Tell axum how to convert `AppError` into a response.
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Something went wrong: {}", self.0),
        )
            .into_response()
    }
}

// Implement `From<AstroError>` for `AppError` to enable easy conversion:
impl From<AstroError> for AppError {
    fn from(err: AstroError) -> Self {
        Self(err)
    }
}
