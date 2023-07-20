use crate::domain::uptime::entity::Uptime;
use crate::domain::uptime::repository::Repository as UptimeRepository;
use crate::infrastructure::error::Result;

use super::dto;

pub struct UptimeService<R>
where
    R: UptimeRepository,
{
    uptime_repository: R,
}

impl<R> UptimeService<R>
where
    R: UptimeRepository,
{
    pub fn new(uptime_repository: R) -> Self {
        Self { uptime_repository }
    }

    pub async fn create(&self, uptime: dto::NewUptimeDTO) -> Result<Uptime> {
        let uptime = Uptime::try_from(uptime)?;
        let uptime = self.uptime_repository.create(&uptime).await?;

        Ok(uptime)
    }

    pub async fn find(&self, category_id: Option<String>) -> Result<Vec<Uptime>> {
        self.uptime_repository.find(category_id).await
    }
}
