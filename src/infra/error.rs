use thiserror::Error;

#[derive(Error, Debug)]
pub enum AstroError {
    #[error("reqwest error")]
    Reqwest(#[from] reqwest::Error),

    #[error("sled error: {0}")]
    Sled(#[from] sled::Error),

    #[error("bincode error")]
    Bincode(#[from] bincode::Error),

    #[error("other error")]
    Other(&'static str),
}
