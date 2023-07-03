use std::{mem::size_of, sync::Arc};

use bincode;
use serde::{Deserialize, Serialize};
use sled::Db;

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

pub struct ServiceRepository {
    db: Arc<Db>,
}

impl ServiceRepository {
    pub fn new(db: Arc<Db>) -> Self {
        Self { db }
    }

    pub fn insert(&self, service: Service) -> sled::Result<()> {
        let key = format!(
            "{}:{}",
            service
                .clone()
                .category_id
                .unwrap_or("unsorted".to_string()),
            service.id
        );
        let encoded_service = bincode::serialize(&service)
            .map_err(|err| sled::Error::Unsupported(err.to_string()))?;
        self.db.insert(key, encoded_service)?;
        Ok(())
    }

    pub fn list_all(&self, category_id: Option<&str>) -> sled::Result<Vec<Service>> {
        let mut services = Vec::new();

        match category_id {
            Some(id) => {
                let prefix = format!("{}:", id);

                for result in self.db.scan_prefix(&prefix) {
                    let (_, value) = result?;
                    let service: Service = bincode::deserialize(&value)
                        .map_err(|err| sled::Error::Unsupported(err.to_string()))?;
                    services.push(service);
                }
            }
            None => {
                for result in self.db.iter() {
                    let (_, value) = result?;
                    // only deserialize the part of the value that corresponds to the Service
                    let (_, service_bytes) = value.split_at(size_of::<u64>());
                    let service: Service = bincode::deserialize(service_bytes)
                        .map_err(|err| sled::Error::Unsupported(err.to_string()))?;
                    services.push(service);
                }
            }
        }
        Ok(services)
    }
}
