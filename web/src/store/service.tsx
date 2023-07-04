import { Instance, flow, types } from "mobx-state-tree";
import { Category } from "./category";

export type ServiceType = Instance<typeof Service>;
export type UptimeStatusType = Instance<typeof UptimeStatus>;
export type ServiceDetailType = Instance<typeof ServiceDetail>;

const UptimeStatus = types.model("UptimeStatus", {
  checked_at: types.string, // note that MST doesn't directly support Date/DateTime types
  uptime: types.boolean,
  latency: types.integer,
});

const Service = types.model("Service", {
  id: types.identifier,
  name: types.string,
  description: types.string,
  tags: types.string,
  url: types.string,
  logo: types.string,
  category_id: types.string,
  category: types.maybe(types.reference(types.late(() => Category))),
  target: types.string,
  status: types.maybe(types.reference(types.late(() => ServiceDetail))),
});

export const ServiceDetail = types
  .model("ServiceDetail", {
    id: types.identifier,
    details: types.optional(types.array(UptimeStatus), []),
  })
  .actions((self) => ({
    fetchStatus: flow(function* fetchStatus(baseUrl: string) {
      try {
        const response = yield fetch(`${baseUrl}/uptime/${self.id}`);
        const status: UptimeStatusType[] = yield response.json();
        self.details.replace(status);
      } catch (error) {
        console.error(`Failed to fetch status for service ${self.id}`, error);
      }
    }),
  }));

export const ServicesStore = types
  .model({
    services: types.map(Service),
    serviceDetails: types.map(ServiceDetail),
  })
  .views((self) => ({
    getServicesByCategory(category_id: string) {
      return Array.from(self.services.values()).filter(
        (service) => service.category_id === category_id
      );
    },
  }))
  .actions((self) => ({
    fetchServices: flow(function* fetchServices(baseUrl) {
      try {
        const response = yield fetch(`${baseUrl}/services`);
        const services: ServiceType[] = yield response.json();

        for (const service of services) {
          const detailResponse = yield fetch(`${baseUrl}/uptime/${service.id}`);
          const status: UptimeStatusType[] = yield detailResponse.json();

          const serviceDetail = ServiceDetail.create({
            id: service.id,
            details: status,
          });

          self.serviceDetails.put(serviceDetail);
          service.status = serviceDetail;
          self.services.put(service);
        }
      } catch (error) {
        console.error("Failed to fetch services", error);
      }
    }),
  }));
