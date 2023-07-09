use std::sync::Arc;

use bincode;
use serde::{Deserialize, Serialize};
use sled::Tree;

use crate::infra::error::AstroError;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Service {
    pub id: String,
    pub name: String,
    pub description: String,
    pub logo: String,
    pub url: String,
    pub target: String,
    pub tags: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub category_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct InsertService {
    pub name: String,
    pub description: Option<String>,
    pub logo: Option<String>,
    pub url: Option<String>,
    pub target: Option<String>,
    pub tags: Option<String>,
    pub category_id: Option<String>,
}

pub struct ServiceRepository {
    db: Arc<Tree>,
}

impl ServiceRepository {
    pub fn new(db: Arc<Tree>) -> Self {
        Self { db }
    }

    pub fn insert(&self, service: Service) -> Result<(), AstroError> {
        let key = format!(
            "{}:{}",
            service
                .clone()
                .category_id
                .unwrap_or("unsorted".to_string()),
            service.id
        );
        let encoded_service = bincode::serialize(&service).map_err(AstroError::from)?;
        self.db.insert(key, encoded_service)?;
        Ok(())
    }

    pub fn list_all(&self, category_id: Option<&str>) -> Result<Vec<Service>, AstroError> {
        let mut services = Vec::new();

        for result in self.db.iter() {
            let (key, value) = result?;
            let key_string = String::from_utf8_lossy(&key);

            // check if key matches the format: "CATEGORY_ID:SERVICE_ID"
            if key_string.contains(":") {
                if let Some(id) = category_id {
                    let prefix = format!("{}:", id);
                    // If category_id is provided, only push matching services
                    if key_string.starts_with(&prefix) {
                        let service: Service =
                            bincode::deserialize(&value).map_err(AstroError::from)?;
                        services.push(service);
                    }
                } else {
                    // If category_id is not provided, push all services
                    let service: Service =
                        bincode::deserialize(&value).map_err(AstroError::from)?;
                    services.push(service);
                }
            }
        }

        Ok(services)
    }
}
