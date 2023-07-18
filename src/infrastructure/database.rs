use async_once::AsyncOnce;
use lazy_static::lazy_static;
use log::info;
use sqlx::pool::Pool;
use sqlx::sqlite::{Sqlite, SqlitePoolOptions};
use std::env;

use crate::infrastructure::error::{AstroError, Result};

const DB_POOL_MAX_CONNECTIONS: u32 = 5;

pub type DbPool = Pool<Sqlite>;

lazy_static! {
    static ref DB_POOL: AsyncOnce<Result<DbPool>> = AsyncOnce::new(async { create_pool().await });
}

pub async fn create_pool() -> Result<Pool<Sqlite>> {
    let db_uri = env::var("DATABASE_URL").expect("Missing \"DATABASE_URL\" environment variable");

    SqlitePoolOptions::new()
        .max_connections(DB_POOL_MAX_CONNECTIONS)
        .connect(&db_uri)
        .await
        .map_err(AstroError::from)
}

pub async fn get_db_pool() -> Result<DbPool> {
    DB_POOL.get().await.clone()
}

pub async fn ping() -> Result<()> {
    info!("Checking on database connection...");
    let pool = get_db_pool().await?;

    sqlx::query("SELECT 1")
        .fetch_one(&pool)
        .await
        .expect("Failed to PING database");
    info!("Database PING executed successfully!");

    Ok(())
}
