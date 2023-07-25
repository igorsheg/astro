use async_trait::async_trait;

use crate::domain::uptime::entity::Uptime;
use crate::domain::uptime::repository::Repository;
use crate::infrastructure::database::DbPool;
use crate::infrastructure::error::Result;

use super::dto::UptimeDTO;

pub struct UptimeRepository {
    db_pool: DbPool,
}

impl UptimeRepository {
    pub fn new(db_pool: DbPool) -> Self {
        Self { db_pool }
    }
}

#[async_trait]
impl Repository for UptimeRepository {
    async fn create(&self, uptime: &Uptime) -> Result<Uptime> {
        let result: UptimeDTO = sqlx::query_as("INSERT INTO uptimes(service_id, checked_at, ok, latency) VALUES ($1, $2, $3, $4) RETURNING *")
        .bind(&uptime.service_id)
        .bind(uptime.checked_at)
        .bind(uptime.ok)
        .bind(uptime.latency)
        .fetch_one(&self.db_pool)
        .await?;

        Ok(Uptime::from(result))
    }

    async fn find(&self, service_id: Option<String>) -> Result<Vec<Uptime>> {
        let result: Vec<UptimeDTO> =
            match service_id {
                Some(service_id) => sqlx::query_as(
                    "SELECT * FROM uptimes WHERE service_id = ? ORDER BY checked_at DESC LIMIT 10",
                )
                .bind(service_id)
                .fetch_all(&self.db_pool)
                .await?,
                None => {
                    sqlx::query_as("SELECT * FROM uptimes ORDER BY checked_at DESC LIMIT 10")
                        .fetch_all(&self.db_pool)
                        .await?
                }
            };

        Ok(result.into_iter().map(Uptime::from).collect())
    }
}
