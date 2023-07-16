use std::sync::Arc;

use bincode;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use sled::Tree;

use crate::infra::error::AstroError;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GridDetails {
    pub order: usize,
    pub w: usize,
    pub h: usize,
}

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
    pub grid_details: GridDetails,
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

impl InsertService {
    pub fn to_service(&self) -> Service {
        Service {
            id: uuid::Uuid::new_v4().to_string(),
            name: self.name.clone(),
            description: self.description.clone().unwrap_or_default(),
            logo: self.logo.clone().unwrap_or_default(),
            url: self.url.clone().unwrap_or_default(),
            target: self.target.clone().unwrap_or("_blank".to_string()),
            tags: self.tags.clone().unwrap_or_default(),
            created_at: Utc::now(),
            category_id: Some(self.category_id.clone().unwrap_or("unsorted".to_string())),
            grid_details: GridDetails {
                order: 1,
                w: 1,
                h: 1,
            },
        }
    }
}

pub struct ServiceRepository {
    db: Arc<Tree>,
}

impl ServiceRepository {
    pub fn new(db: Arc<Tree>) -> Self {
        Self { db }
    }

    pub fn insert(&self, service: &Service) -> Result<(), AstroError> {
        let key = format!(
            "{}:{}",
            service
                .category_id
                .as_ref()
                .unwrap_or(&"unsorted".to_string()),
            service.id
        );
        let encoded_service = bincode::serialize(&service).map_err(AstroError::from)?;
        self.db.insert(key, encoded_service)?;
        Ok(())
    }

    pub fn list(&self, category_id: Option<&str>) -> Result<Vec<Service>, AstroError> {
        let mut services = Vec::new();

        for result in self.db.iter() {
            let (key, value) = result?;
            let key_string = String::from_utf8_lossy(&key);

            // check if key matches the format: "CATEGORY_ID:SERVICE_ID"
            if key_string.contains(':') {
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
