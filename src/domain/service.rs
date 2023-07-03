use std::sync::Arc;

use bincode;
use serde::{Deserialize, Serialize};
use sled::Db;

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
    db: Arc<Db>,
}

impl ServiceRepository {
    pub fn new(db: Arc<Db>) -> Self {
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

        match category_id {
            Some(id) => {
                let prefix = format!("{}:", id);

                for result in self.db.scan_prefix(&prefix) {
                    let (_, value) = result?;
                    let service: Service =
                        bincode::deserialize(&value).map_err(AstroError::from)?;
                    services.push(service);
                }
            }
            None => {
                for result in self.db.iter() {
                    let (_, value) = result?;
                    let yay: Service = bincode::deserialize(&value).map_err(AstroError::from)?;
                    services.push(yay);
                }
            }
        }
        Ok(services)
    }
}
