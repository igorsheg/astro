use std::sync::Arc;

use chrono::DateTime;
use chrono::NaiveDateTime;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use sqlx::SqlitePool;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GridDetails {
    pub order: i64,
    pub w: i64,
    pub h: i64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Service {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub tags: Option<String>,
    pub url: String,
    pub logo: Option<String>,
    pub category_id: String,
    pub target: Option<String>,
    pub created_at: DateTime<Utc>,
    // pub grid_details: GridDetails,
    pub grid_order: i64,
    pub grid_w: i64,
    pub grid_h: i64,
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
    pub grid_order: i64,
    pub grid_w: i64,
    pub grid_h: i64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct UpdateService {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub logo: Option<String>,
    pub url: Option<String>,
    pub target: Option<String>,
    pub tags: Option<String>,
    pub category_id: String,
    pub created_at: DateTime<Utc>,
    pub grid_order: i64,
    pub grid_w: i64,
    pub grid_h: i64,
}

#[derive(FromRow)]
struct ServiceRecord {
    id: String,
    name: String,
    description: Option<String>,
    logo: Option<String>,
    url: String,
    target: Option<String>,
    tags: Option<String>,
    created_at: NaiveDateTime,
    category_id: String,
    grid_order: i64,
    grid_w: i64,
    grid_h: i64,
}

impl From<ServiceRecord> for Service {
    fn from(record: ServiceRecord) -> Self {
        Service {
            id: record.id,
            name: record.name,
            description: record.description,
            logo: record.logo,
            url: record.url,
            target: record.target,
            tags: record.tags,
            created_at: DateTime::<Utc>::from_utc(record.created_at, Utc {}),
            category_id: record.category_id,
            grid_order: record.grid_order,
            grid_w: record.grid_w,
            grid_h: record.grid_h,
        }
    }
}

impl InsertService {
    pub fn to_service(&self) -> Service {
        Service {
            id: uuid::Uuid::new_v4().to_string(),
            name: self.name.clone(),
            description: Some(self.description.clone().unwrap_or("untitled".to_string())),
            logo: Some(self.logo.clone().unwrap_or_default()),
            url: self.url.clone().unwrap_or_default(),
            target: Some(self.target.clone().unwrap_or("_blank".to_string())),
            tags: Some(self.tags.clone().unwrap_or("".to_string())),
            created_at: Utc::now(),
            category_id: self.category_id.clone().unwrap_or("unsorted".to_string()),
            grid_order: 1,
            grid_w: 1,
            grid_h: 1,
        }
    }
}

impl UpdateService {
    pub fn to_service(&self) -> Service {
        Service {
            id: self.id.clone(),
            name: self.name.clone(),
            description: self.description.clone(),
            logo: Some(self.logo.clone().unwrap_or_default()),
            url: self.url.clone().unwrap_or_default(),
            target: Some(self.target.clone().unwrap_or("_blank".to_string())),
            tags: Some(self.tags.clone().unwrap_or("".to_string())),
            created_at: self.created_at,
            category_id: self.category_id.clone(),
            grid_order: self.grid_order,
            grid_w: self.grid_w,
            grid_h: self.grid_h,
        }
    }
}

#[derive(Clone)]
pub struct ServiceRepository {
    db: Arc<SqlitePool>,
}

impl ServiceRepository {
    pub fn new(db: Arc<SqlitePool>) -> Self {
        Self { db }
    }

    pub async fn get(&self, service_id: &str) -> Result<Service, sqlx::Error> {
        let record: ServiceRecord = sqlx::query_as!(
        ServiceRecord,
        r#"
        SELECT id, name, description, logo, url, target, tags, created_at, category_id, grid_order, grid_w, grid_h 
        FROM services WHERE id = ?
        "#,
        service_id
    )
    .fetch_one(self.db.as_ref())
    .await?;

        Ok(Service::from(record))
    }

    pub async fn insert(&self, service: Service) -> Result<Service, sqlx::Error> {
        sqlx::query!(
            r#"
            INSERT INTO services (id, name, description, logo, url, target, tags, created_at, category_id, grid_order, grid_w, grid_h)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
            service.id,
            service.name,
            service.description,
            service.logo,
            service.url,
            service.target,
            service.tags,
            service.created_at,
            service.category_id,
            service.grid_order,
            service.grid_w,
            service.grid_h,
        )
        .execute(self.db.as_ref())
        .await?;

        Ok(service)
    }
    pub async fn update(&self, service: Service) -> Result<Service, sqlx::Error> {
        sqlx::query!(
            r#"
        UPDATE services 
        SET 
            name = ?, 
            description = ?, 
            logo = ?, 
            url = ?, 
            target = ?, 
            tags = ?, 
            created_at = ?, 
            category_id = ?, 
            grid_order = ?, 
            grid_w = ?, 
            grid_h = ?
        WHERE id = ?
        "#,
            service.name,
            service.description,
            service.logo,
            service.url,
            service.target,
            service.tags,
            service.created_at,
            service.category_id,
            service.grid_order,
            service.grid_w,
            service.grid_h,
            service.id,
        )
        .execute(self.db.as_ref())
        .await?;

        Ok(service)
    }

    pub async fn list(&self, category_id: Option<&str>) -> Result<Vec<Service>, sqlx::Error> {
        match category_id {
            Some(id) => {
                let records: Vec<ServiceRecord> = sqlx::query_as!(
                ServiceRecord,
                r#"
                SELECT id, name, description, logo, url, target, tags, created_at, category_id, grid_order, grid_w, grid_h 
                FROM services WHERE category_id = ?
                "#,
                id
            )
            .fetch_all(self.db.as_ref())
            .await?;

                Ok(records.into_iter().map(Service::from).collect())
            }
            None => {
                let records: Vec<ServiceRecord> = sqlx::query_as!(
                ServiceRecord,
                r#"
                SELECT id, name, description, logo, url, target, tags, created_at, category_id, grid_order, grid_w, grid_h 
                FROM services
                "#,
            )
            .fetch_all(self.db.as_ref())
            .await?;

                Ok(records.into_iter().map(Service::from).collect())
            }
        }
    }
}
