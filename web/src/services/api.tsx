import { Service } from "../models/service";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    fetchServices: builder.query<Service[], void>({
      query: () => "services",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Service" as const, id })),
              { type: "Service", id: "LIST" },
            ]
          : [{ type: "Service", id: "LIST" }],
    }),
    patchGridOrder: builder.mutation<
      void,
      Array<{ id: string; grid_order: number }>
    >({
      query: (services) => ({
        url: `services/grid_order`,
        method: "PATCH",
        body: services,
      }),
      invalidatesTags: (_result, _error, services) =>
        services.map(({ id }) => ({ type: "Service", id })),
    }),
    patchService: builder.mutation<
      void,
      Pick<Service, "id"> & Partial<Service>
    >({
      query: ({ id, ...patch }) => ({
        url: `services`,
        method: "PATCH",
        body: { id, ...patch },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Service", id }],
    }),
  }),
});

export const {
  useFetchServicesQuery,
  usePatchGridOrderMutation,
  usePatchServiceMutation,
} = apiSlice;
