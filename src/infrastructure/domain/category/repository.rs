use async_trait::async_trait;

use crate::domain::category::entity::Category;
use crate::domain::category::repository::Repository;
use crate::infrastructure::database::DbPool;
use crate::infrastructure::error::Result;

use super::dto::CategoryDTO;

pub struct CategoryRepository {
    db_pool: DbPool,
}

impl CategoryRepository {
    pub fn new(db_pool: DbPool) -> Self {
        Self { db_pool }
    }
}

#[async_trait]
impl Repository for CategoryRepository {
    async fn create(&self, category: &Category) -> Result<Category> {
        let result: CategoryDTO =
            sqlx::query_as("INSERT INTO categories(name) VALUES ($1) RETURNING *")
                .bind(&category.name)
                .fetch_one(&self.db_pool)
                .await?;

        Ok(Category::from(result))
    }

    async fn find(&self) -> Result<Vec<Category>> {
        let result: Vec<CategoryDTO> = sqlx::query_as("SELECT * FROM categories")
            .fetch_all(&self.db_pool)
            .await?;

        Ok(result.into_iter().map(Category::from).collect())
    }

    async fn find_one(&self, id: &str) -> Result<Category> {
        let result: CategoryDTO = sqlx::query_as("SELECT * FROM categories WHERE id = $1")
            .bind(id)
            .fetch_one(&self.db_pool)
            .await?;

        Ok(Category::from(result))
    }

    async fn update(&self, id: &str, category: &Category) -> Result<Category> {
        let result: CategoryDTO =
            sqlx::query_as("UPDATE categories SET name = $1 WHERE id = $2 RETURNING *")
                .bind(&category.name)
                .bind(id)
                .fetch_one(&self.db_pool)
                .await?;

        Ok(Category::from(result))
    }
}
