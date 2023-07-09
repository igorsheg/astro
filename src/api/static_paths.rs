use axum::{
    headers::{ContentLength, ContentType},
    http::{StatusCode, Uri},
    response::IntoResponse,
    TypedHeader,
};
use std::path::Path;

const ASSETS_DIR: &str = "./build";

pub async fn handle_static_files(uri: Uri) -> Result<impl IntoResponse, StatusCode> {
    let mut filename = uri.path().trim_start_matches('/');
    if filename.is_empty() {
        filename = "index.html";
    }

    let path = Path::new(ASSETS_DIR).join(filename);
    if !path.exists() {
        return Err(StatusCode::NOT_FOUND);
    }

    match tokio::fs::read(&path).await {
        Ok(buf) => {
            let mime_type = mime_guess::from_path(&path).first_or_octet_stream();
            Ok((
                TypedHeader(ContentType::from(mime_type)),
                TypedHeader(ContentLength(buf.len() as u64)),
                buf,
            ))
        }
        Err(e) => {
            log::error!("{}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
