use dotenv::dotenv;
use lazy_static::lazy_static;
use std::env;

lazy_static! {
    static ref CONFIGURATION: Configuration = Configuration::new();
}

pub fn _get_configurations() -> &'static Configuration {
    &CONFIGURATION
}

pub struct DatabaseConfiguration {
    pub uri: String,
}

pub struct ServerConfiguration {
    pub host: String,
    pub port: String,
}

pub struct Configuration {
    pub database: DatabaseConfiguration,
    pub server: ServerConfiguration,
}

impl Default for DatabaseConfiguration {
    fn default() -> Self {
        DatabaseConfiguration {
            uri: env::var("DATABASE_URL").expect("Missing \"DATABASE_URL\" environment variable"),
        }
    }
}

impl Default for ServerConfiguration {
    fn default() -> Self {
        ServerConfiguration {
            host: env::var("HOST").expect("HOST must be set"),
            port: env::var("PORT").expect("PORT must be set"),
        }
    }
}

impl DatabaseConfiguration {
    pub fn new() -> Self {
        DatabaseConfiguration::default()
    }
}

impl ServerConfiguration {
    pub fn new() -> Self {
        ServerConfiguration::default()
    }
}

impl Default for Configuration {
    fn default() -> Configuration {
        Configuration {
            database: DatabaseConfiguration::new(),
            server: ServerConfiguration::new(),
        }
    }
}

impl Configuration {
    pub fn new() -> Self {
        dotenv().expect("Unable to find .env file. Create one based on the .env.example");
        Configuration::default()
    }
}
