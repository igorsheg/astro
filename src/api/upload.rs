use axum::{
    extract::Multipart,
    http::{header, StatusCode},
    response::IntoResponse,
};
use chrono::Utc;
use mime::Mime;
use std::{
    convert::Infallible,
    fs::File,
    io::Write,
    path::{Path, PathBuf},
};
use tokio::fs::create_dir_all;

pub async fn upload_handler(mut payload: Multipart) -> Result<impl IntoResponse, Infallible> {
    // Iterate over multipart payload to get file
    let mut file_name: Option<String> = None;
    while let Some(mut field) = payload.next_field().await.unwrap() {
        let content_type = field.content_type().unwrap();
        let mime_type = content_type.parse::<Mime>().unwrap();
        if mime_type.type_() == mime::IMAGE {
            let original_file_name = field.file_name().unwrap();
            let original_path = Path::new(original_file_name);
            let base_name = original_path.file_stem().unwrap().to_str().unwrap();
            let extension = original_path.extension().unwrap().to_str().unwrap();

            let new_file_name = format!(
                "{}_{}.{}",
                base_name,
                Utc::now().format("%Y%m%d%H%M%S"),
                extension
            );
            let path: PathBuf = ["./build/public/logos", &new_file_name].iter().collect();

            // Create directory if it does not exist
            if let Some(dir) = path.parent() {
                create_dir_all(dir).await.unwrap();
            }

            // Write field content to file
            let mut f = File::create(path).unwrap();
            let mut buffer = Vec::new();
            while let Some(chunk) = field.chunk().await.unwrap() {
                buffer.extend_from_slice(&chunk);
            }
            f.write_all(&buffer).unwrap();

            file_name = Some(new_file_name);
            break;
        }
    }

    if let Some(file_name) = file_name {
        Ok((
            StatusCode::OK,
            [(header::CONTENT_TYPE, mime::TEXT_PLAIN_UTF_8.as_ref())],
            format!("/{}", file_name),
        )
            .into_response())
    } else {
        Ok((
            StatusCode::BAD_REQUEST,
            [(header::CONTENT_TYPE, mime::TEXT_PLAIN_UTF_8.as_ref())],
            "Invalid file upload".to_string(),
        )
            .into_response())
    }
}
