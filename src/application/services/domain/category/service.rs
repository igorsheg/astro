use super::dto;
use crate::domain::category::entity::Category;
use crate::domain::category::repository::Repository as CategoryRepository;
use crate::infrastructure::error::Result;

pub struct CategoryService<R>
where
    R: CategoryRepository,
{
    category_repository: R,
}

impl<R> CategoryService<R>
where
    R: CategoryRepository,
{
    pub fn new(category_repository: R) -> Self {
        Self {
            category_repository,
        }
    }

    pub async fn create_user(&self, category: dto::NewCategoryDTO) -> Result<Category> {
        let category = Category::try_from(category)?;
        let category = self.category_repository.create(&category).await?;

        Ok(category)
    }

    pub async fn find(&self) -> Result<Vec<Category>> {
        self.category_repository.find().await
    }

    pub async fn find_one(&self, id: &str) -> Result<Category> {
        self.category_repository.find_one(id).await
    }

    pub async fn update(&self, id: &str, category: dto::NewCategoryDTO) -> Result<Category> {
        let category = Category::try_from(category)?;

        self.category_repository.update(id, &category).await
    }
}
