use std::sync::Arc;

use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;

#[derive(Serialize, Deserialize, Debug)]
pub struct Category {
    pub id: String,
    pub name: String,
    pub description: String,
    pub icon: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct InsertCategory {
    pub name: String,
    pub description: Option<String>,
    pub icon: Option<String>,
}

impl InsertCategory {
    pub fn to_category(&self) -> Category {
        Category {
            id: uuid::Uuid::new_v4().to_string(),
            name: self.name.clone(),
            description: self.description.clone().unwrap_or_default(),
            icon: self.icon.clone().unwrap_or("".to_string()),
        }
    }
}

#[derive(Clone)]
pub struct CategoryRepository {
    db: Arc<SqlitePool>,
}

impl CategoryRepository {
    pub fn new(db: Arc<SqlitePool>) -> Self {
        Self { db }
    }

    pub async fn list(&self) -> Result<Vec<Category>, sqlx::Error> {
        let categories: Vec<Category> = sqlx::query_as!(
            Category,
            r#"
            SELECT * FROM categories
            "#,
        )
        .fetch_all(self.db.as_ref())
        .await?;

        Ok(categories)
    }

    pub async fn insert(&self, category: Category) -> Result<Category, sqlx::Error> {
        sqlx::query!(
            r#"
            INSERT INTO categories (id, name, description, icon)
            VALUES (?, ?, ?, ?)
            "#,
            category.id,
            category.name,
            category.description,
            category.icon,
        )
        .execute(self.db.as_ref())
        .await?;

        Ok(category)
    }
}
