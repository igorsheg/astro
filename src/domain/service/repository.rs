use super::entity::Service;
use crate::infrastructure::error::Result;

use async_trait::async_trait;

#[async_trait]
pub trait Repository {
    async fn create(&self, service: &Service) -> Result<Service>;
    async fn find(&self, category_id: Option<String>) -> Result<Vec<Service>>;
    async fn find_one(&self, id: &str) -> Result<Service>;
    async fn update(&self, id: &str, user: &Service) -> Result<Service>;
    async fn update_batch_order(&self, services: &[(String, i64)]) -> Result<()>;
}
