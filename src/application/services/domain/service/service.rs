use super::dto;
use crate::domain::service::entity::Service;
use crate::domain::service::repository::Repository as ServiceRepository;
use crate::infrastructure::error::Result;

pub struct ServiceService<R>
where
    R: ServiceRepository,
{
    service_repository: R,
}

impl<R> ServiceService<R>
where
    R: ServiceRepository,
{
    pub fn new(service_repository: R) -> Self {
        Self { service_repository }
    }

    pub async fn create_user(&self, service: dto::NewServiceDTO) -> Result<Service> {
        let service = Service::try_from(service)?;
        let service = self.service_repository.create(&service).await?;

        Ok(service)
    }

    pub async fn find(&self) -> Result<Vec<Service>> {
        self.service_repository.find().await
    }

    pub async fn find_one(&self, id: &str) -> Result<Service> {
        self.service_repository.find_one(id).await
    }

    pub async fn update(&self, id: &str, service: dto::NewServiceDTO) -> Result<Service> {
        let service = Service::try_from(service)?;

        self.service_repository.update(id, &service).await
    }
}
