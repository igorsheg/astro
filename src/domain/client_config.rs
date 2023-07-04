use std::sync::Arc;

use serde::{Deserialize, Serialize};
use sled::Tree;

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub id: Option<String>,
    pub title: String,
    pub subtitle: String,
    pub created_at: Option<chrono::NaiveDateTime>,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

pub struct ConfigRepository {
    db: Arc<Tree>,
}

impl ConfigRepository {
    pub fn new(db: Arc<Tree>) -> Self {
        Self { db }
    }

    pub fn list(&self) -> sled::Result<Vec<Config>> {
        let mut configs = Vec::new();

        for result in self.db.iter() {
            let (_, value) = result?;
            let config: Config = bincode::deserialize(&value)
                .map_err(|err| sled::Error::Unsupported(err.to_string()))?;
            configs.push(config);
        }

        Ok(configs)
    }

    pub fn insert(&self, config: &Config) -> sled::Result<()> {
        let encoded_config =
            bincode::serialize(config).map_err(|err| sled::Error::Unsupported(err.to_string()))?;
        let id = config
            .id
            .clone()
            .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());

        match self.db.insert(id.clone(), encoded_config) {
            Ok(_) => {
                log::info!("Successfully inserted config with ID {}", id);
                Ok(())
            }
            Err(e) => {
                log::error!("Failed to insert config with ID {}. Error: {}", id, e);
                Err(e)
            }
        }
    }

    pub fn get(&self, id: &str) -> sled::Result<Option<Config>> {
        let config_ivec = self.db.get(id)?;

        if let Some(encoded_config) = config_ivec {
            let config: Config = bincode::deserialize(&encoded_config)
                .map_err(|err| sled::Error::Unsupported(err.to_string()))?;
            Ok(Some(config))
        } else {
            Ok(None)
        }
    }

    pub fn update(&self, id: &str, new_config: &Config) -> sled::Result<()> {
        let encoded_config = bincode::serialize(new_config)
            .map_err(|err| sled::Error::Unsupported(err.to_string()))?;
        self.db.insert(id, encoded_config)?;
        Ok(())
    }

    pub fn delete(&self, id: &str) -> sled::Result<()> {
        self.db.remove(id)?;
        Ok(())
    }
}

pub async fn setup_default_config(config_repo: &ConfigRepository) {
    let default_config_id = "default-config";

    log::info!("Creating default config");
    match config_repo.get(default_config_id) {
        Ok(None) => {
            let default_config = Config {
                id: Some(default_config_id.to_string()),
                title: "Astro".to_string(),
                subtitle: "Your personal space".to_string(),
                created_at: None,
                updated_at: None,
            };
            config_repo.insert(&default_config).unwrap();
        }
        Ok(Some(_)) => {} // default config already exists
        Err(e) => panic!("Failed to get default config: {}", e), // handle error as you see fit
    }
}
