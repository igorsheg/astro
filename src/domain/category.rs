use bincode;
use serde::{Deserialize, Serialize};
use sled::Db;

use super::service::Service;

#[derive(Serialize, Deserialize, Debug)]
pub struct Category {
    id: String,
    name: String,
    description: String,
    icon: String,
    services: Vec<Service>,
}

pub struct CategoryRepository<'a> {
    db: &'a Db,
}

impl<'a> CategoryRepository<'a> {
    pub fn new(db: &'a Db) -> Self {
        Self { db }
    }

    pub fn insert(&self, category: &Category) -> sled::Result<()> {
        let encoded_category = bincode::serialize(category)
            .map_err(|err| sled::Error::Unsupported(err.to_string()))?;
        self.db.insert(&category.id, encoded_category)?;

        // For each service in the category, insert it into the DB
        // with a key that is a composite of the category id and service id
        for service in &category.services {
            let key = format!("{}:{}", &category.id, &service.id);
            let encoded_service = bincode::serialize(service)
                .map_err(|err| sled::Error::Unsupported(err.to_string()))?;
            self.db.insert(key, encoded_service)?;
        }

        Ok(())
    }

    pub fn get_by_id(&self, id: &str) -> sled::Result<Option<Category>> {
        let category_ivec = self.db.get(id)?;

        if let Some(encoded_category) = category_ivec {
            let mut category: Category = bincode::deserialize(&encoded_category)
                .map_err(|err| sled::Error::Unsupported(err.to_string()))?;

            category.services = Vec::new();

            // Retrieve all services for this category
            for result in self.db.scan_prefix(format!("{}:", id)) {
                let (_, value) = result?;
                let service: Service = bincode::deserialize(&value)
                    .map_err(|err| sled::Error::Unsupported(err.to_string()))?;
                category.services.push(service);
            }

            Ok(Some(category))
        } else {
            Ok(None)
        }
    }
}
