use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

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
    pub created_at: NaiveDateTime,
    pub grid_order: i64,
    pub grid_w: i64,
    pub grid_h: i64,
}
