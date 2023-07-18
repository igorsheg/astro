use super::entity::Category;
use crate::infrastructure::error::Result;

use async_trait::async_trait;
#[async_trait]
pub trait Repository {
    async fn create(&self, service: &Category) -> Result<Category>;
    async fn find(&self) -> Result<Vec<Category>>;
    async fn find_one(&self, id: &str) -> Result<Category>;
    async fn update(&self, id: &str, user: &Category) -> Result<Category>;
}
