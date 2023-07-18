use super::entity::Service;
use crate::infrastructure::error::Result;

use async_trait::async_trait;
#[async_trait]
pub trait Repository {
    async fn create(&self, service: &Service) -> Result<Service>;
    async fn find(&self) -> Result<Vec<Service>>;
    async fn find_one(&self, id: &str) -> Result<Service>;
    async fn update(&self, id: &str, user: &Service) -> Result<Service>;
}
