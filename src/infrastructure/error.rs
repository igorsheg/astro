use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};

use sqlx::Error as SqlxError;
use thiserror::Error as ThisError;

pub type Result<T> = std::result::Result<T, AstroError>;

#[derive(Clone, Debug, ThisError)]
pub enum AstroError {
    #[error("An error ocurred during database interaction. {0}")]
    DatabaseError(String),

    #[error("An error occurred during HTTP interaction. {0}")]
    HttpError(String),
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

impl From<reqwest::Error> for AstroError {
    fn from(reqwest_error: reqwest::Error) -> Self {
        AstroError::HttpError(reqwest_error.to_string())
    }
}

impl From<SqlxError> for AstroError {
    fn from(sqlx_error: SqlxError) -> Self {
        match sqlx_error.as_database_error() {
            Some(db_error) => AstroError::DatabaseError(db_error.to_string()),
            None => {
                error!("{:?}", sqlx_error);
                AstroError::DatabaseError(String::from("Unrecognized database error!"))
            }
        }
    }
}
