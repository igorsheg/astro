use std::sync::Arc;

use chrono::NaiveDateTime;
use serde::Serialize;
use sqlx::SqlitePool;

#[derive(Debug, Clone, Serialize)]
pub struct Config {
    pub id: String,
    pub title: String,
    pub subtitle: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Clone)]
pub struct ConfigRepository {
    db: Arc<SqlitePool>,
}

impl ConfigRepository {
    pub fn new(db: Arc<SqlitePool>) -> Self {
        Self { db }
    }

    pub async fn list(&self) -> Result<Vec<Config>, sqlx::Error> {
        let configs = sqlx::query_as!(Config, "SELECT * FROM config")
            .fetch_all(&*self.db)
            .await?;
        Ok(configs)
    }

    pub async fn insert(&self, config: &Config) -> Result<(), sqlx::Error> {
        sqlx::query("INSERT INTO config (id, title, subtitle, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
            .bind(config.id.clone())
            .bind(&config.title)
            .bind(&config.subtitle)
            .bind(config.created_at)
            .bind(config.updated_at)
            .execute(&*self.db)
            .await?;

        Ok(())
    }

    pub async fn get(&self, id: &str) -> Result<Option<Config>, sqlx::Error> {
        sqlx::query_as!(Config, "SELECT * FROM config WHERE id = ?", id)
            .fetch_optional(&*self.db)
            .await
    }

    pub async fn update(&self, id: &str, new_config: &Config) -> Result<(), sqlx::Error> {
        sqlx::query!(
            "UPDATE config SET title = ?, 
            subtitle = ?, 
            created_at = ?, 
            updated_at = ? 
            WHERE id = ?",
            new_config.title,
            new_config.subtitle,
            new_config.created_at,
            new_config.updated_at,
            id
        )
        .execute(&*self.db)
        .await?;

        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), sqlx::Error> {
        sqlx::query!("DELETE FROM config WHERE id = ?", id)
            .execute(&*self.db)
            .await?;

        Ok(())
    }
}
