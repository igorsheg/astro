use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    id: String,
    title: String,
    subtitle: String,
    first_timer: String,
}
