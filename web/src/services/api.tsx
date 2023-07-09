import { Service, UptimeStatus } from "../models/service";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Service"],
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    fetchServices: builder.query<Service[] | undefined, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, baseQuery) => {
        // First, fetch services
        const servicesResult = await baseQuery("/services");

        // If the services request failed, propagate the error
        if (!servicesResult.data) {
          return { error: servicesResult.error, meta: servicesResult.meta };
        }
        const services = servicesResult.data as Service[];
        // Fetch service details for each service
        const servicesWithDetails: Service[] = [];
        for (const service of services) {
          const detailsResult = await baseQuery(`/uptime/${service.id}`);
          // If the details request failed, propagate the error
          if (!detailsResult.data) {
            return { error: detailsResult.error, meta: detailsResult.meta };
          }
          const details = detailsResult.data as UptimeStatus[];

          const serviceWithDetails: Service = {
            ...service,
            status: details,
          };

          servicesWithDetails.push(serviceWithDetails);
        }

        return { data: servicesWithDetails };
      },
      providesTags: ["Service"],
    }),
  }),
});

export const { useFetchServicesQuery } = apiSlice;
