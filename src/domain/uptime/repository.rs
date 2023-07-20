use super::entity::Uptime;
use crate::infrastructure::error::Result;

use async_trait::async_trait;

#[async_trait]
pub trait Repository {
    async fn create(&self, service: &Uptime) -> Result<Uptime>;
    async fn find(&self, category_id: Option<String>) -> Result<Vec<Uptime>>;
}
