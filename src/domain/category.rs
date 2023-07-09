use std::sync::Arc;

use bincode;
use serde::{Deserialize, Serialize};
use sled::Tree;

use crate::infra::error::AstroError;

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

pub struct CategoryRepository {
    db: Arc<Tree>,
}

impl CategoryRepository {
    pub fn new(db: Arc<Tree>) -> Self {
        Self { db }
    }

    pub fn list(&self) -> Result<Vec<Category>, AstroError> {
        let mut categories = Vec::new();

        for result in self.db.iter() {
            let (_, value) = result?;
            let category: Category = bincode::deserialize(&value).map_err(AstroError::from)?;
            categories.push(category);
        }
        Ok(categories)
    }

    pub fn insert(&self, category: &Category) -> Result<(), AstroError> {
        let encoded_category = bincode::serialize(&category).map_err(AstroError::from)?;
        self.db.insert(&category.id, encoded_category)?;

        Ok(())
    }
}
