use std::sync::Arc;

use serde::{Deserialize, Serialize};
use sled::Tree;

#[derive(Serialize, Deserialize, Debug)]
pub struct UptimeStatus {
    pub service_id: String,
    pub checked_at: chrono::DateTime<chrono::Utc>,
    pub uptime: bool,
    pub latency: u128, // latency in milliseconds
}

#[derive(Clone)]
pub struct UptimeStatusRepository {
    db: Arc<Tree>, // This tree is dedicated for uptime status logs
}

impl UptimeStatusRepository {
    pub fn new(db: Arc<Tree>) -> Self {
        Self { db }
    }

    pub fn insert(&self, status: &UptimeStatus) -> sled::Result<()> {
        let key = format!(
            "{}_{}",
            &status.service_id,
            &status.checked_at.timestamp_nanos()
        );
        let encoded_status =
            bincode::serialize(status).map_err(|err| sled::Error::Unsupported(err.to_string()))?;
        self.db.insert(key, encoded_status)?;
        Ok(())
    }

    pub fn list_for_service(&self, service_id: &str) -> sled::Result<Vec<UptimeStatus>> {
        let mut statuses = Vec::new();

        for result in self.db.scan_prefix(service_id) {
            let (_, value) = result?;
            let status: UptimeStatus = bincode::deserialize(&value)
                .map_err(|err| sled::Error::Unsupported(err.to_string()))?;
            statuses.push(status);
        }

        Ok(statuses)
    }
}
