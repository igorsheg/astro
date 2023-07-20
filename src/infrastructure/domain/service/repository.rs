use async_trait::async_trait;

use crate::domain::service::entity::Service;
use crate::domain::service::repository::Repository;
use crate::infrastructure::database::DbPool;
use crate::infrastructure::error::Result;

use super::dto::ServiceDTO;

pub struct ServiceRepository {
    db_pool: DbPool,
}

impl ServiceRepository {
    pub fn new(db_pool: DbPool) -> Self {
        Self { db_pool }
    }
}

#[async_trait]
impl Repository for ServiceRepository {
    async fn create(&self, service: &Service) -> Result<Service> {
        let result: ServiceDTO =
            sqlx::query_as("INSERT INTO services(name) VALUES ($1) RETURNING *")
                .bind(&service.name)
                .fetch_one(&self.db_pool)
                .await?;

        Ok(Service::from(result))
    }

    async fn find(&self, category_id: Option<String>) -> Result<Vec<Service>> {
        let result: Vec<ServiceDTO> = match category_id {
            Some(category_id) => {
                sqlx::query_as("SELECT * FROM services WHERE category_id = ?")
                    .bind(category_id)
                    .fetch_all(&self.db_pool)
                    .await?
            }
            None => {
                sqlx::query_as("SELECT * FROM services")
                    .fetch_all(&self.db_pool)
                    .await?
            }
        };

        Ok(result.into_iter().map(Service::from).collect())
    }

    async fn find_one(&self, id: &str) -> Result<Service> {
        let result: ServiceDTO = sqlx::query_as("SELECT * FROM services WHERE id = $1")
            .bind(id)
            .fetch_one(&self.db_pool)
            .await?;

        Ok(Service::from(result))
    }

    async fn update(&self, id: &str, service: &Service) -> Result<Service> {
        let result: ServiceDTO =
        sqlx::query_as::<_, ServiceDTO>("UPDATE services SET name = $1, description = $2, tags = $3, logo = $4, url = $5, category_id = $6, target = $7, grid_order = $8, grid_w = $9, grid_h = $10 WHERE id = $11 RETURNING *")
            .bind(&service.name)
            .bind(&service.description)
            .bind(&service.tags)
            .bind(&service.logo)
            .bind(&service.url)
            .bind(&service.category_id)
            .bind(&service.target)
            .bind(service.grid_order)
            .bind(service.grid_w)
            .bind(service.grid_h)
            .bind(id)
            .fetch_one(&self.db_pool)
            .await?;

        Ok(Service::from(result))
    }

    async fn update_batch_order(&self, services: &[(String, i64)]) -> Result<()> {
        let mut tx = self.db_pool.begin().await?;

        for (id, grid_order) in services {
            sqlx::query("UPDATE services SET grid_order = $1 WHERE id = $2")
                .bind(grid_order)
                .bind(id)
                .execute(&mut *tx)
                .await?;
        }

        tx.commit().await?;

        Ok(())
    }
}
