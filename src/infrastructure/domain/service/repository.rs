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

    async fn find(&self) -> Result<Vec<Service>> {
        let result: Vec<ServiceDTO> = sqlx::query_as("SELECT * FROM services")
            .fetch_all(&self.db_pool)
            .await?;

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
            sqlx::query_as("UPDATE services SET name = $1 WHERE id = $2 RETURNING *")
                .bind(&service.name)
                .bind(id)
                .fetch_one(&self.db_pool)
                .await?;

        Ok(Service::from(result))
    }
}
