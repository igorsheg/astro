use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Uptime {
    pub service_id: String,
    pub checked_at: NaiveDateTime,
    pub ok: bool,
    pub latency: i64, // latency in milliseconds
}
