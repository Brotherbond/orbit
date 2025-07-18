import { createApi } from "@reduxjs/toolkit/query/react";
import { apiClient } from "../lib/api-client";

type EntityApiOptions<T, CreateT = Partial<T>, UpdateT = Partial<T>> = {
  reducerPath: string;
  entityEndpoint: string;
  tagTypes?: string[];
};

export function createEntity<T, CreateT = Partial<T>, UpdateT = Partial<T>>(
  options: EntityApiOptions<T, CreateT, UpdateT>,
) {
  const { reducerPath, entityEndpoint, tagTypes } = options;

  const customBaseQuery = async ({
    url,
    method,
    body,
  }: {
    url: string;
    method?: string;
    body?: any;
  }): Promise<
    | { data: any }
    | {
        error: {
          status: string | number;
          error: string;
          data?: any;
        };
      }
  > => {
    try {
      let result: any;
      switch ((method || "GET").toUpperCase()) {
        case "GET":
          result = await apiClient.get(url);
          return {
            data:
              (result.data as any).items ||
              (result.data as any).item ||
              result.data,
          };
        case "POST":
          result = await apiClient.post(url, body);
          return { data: (result.data as any).item || result.data };
        case "PUT":
          result = await apiClient.put(url, body);
          return { data: (result.data as any).item || result.data };
        case "DELETE":
          result = await apiClient.delete(url);
          return { data: result.data || { success: true } };
        default:
          return {
            error: {
              status: "METHOD_NOT_SUPPORTED",
              error: "Method not supported",
            },
          };
      }
    } catch (error: any) {
      return {
        error: {
          status: error?.code || "CUSTOM_ERROR",
          error: error?.message || "Unknown error",
          data: error?.errors,
        },
      };
    }
  };

  return createApi({
    reducerPath,
    baseQuery: customBaseQuery,
    tagTypes,
    endpoints: (builder) => ({
      getAll: builder.query<T[], void>({
        query: () => ({ url: `/${entityEndpoint}` }),
      }),
      getById: builder.query<T, string>({
        query: (id: string) => ({ url: `/${entityEndpoint}/${id}` }),
      }),
      create: builder.mutation<T, CreateT>({
        query: (body: CreateT) => ({
          url: `/${entityEndpoint}`,
          method: "POST",
          body,
        }),
      }),
      update: builder.mutation<T, { id: string; data: UpdateT }>({
        query: ({ id, data }: { id: string; data: UpdateT }) => ({
          url: `/${entityEndpoint}/${id}`,
          method: "PUT",
          body: data,
        }),
      }),
      delete: builder.mutation<{ success: boolean }, string>({
        query: (id: string) => ({
          url: `/${entityEndpoint}/${id}`,
          method: "DELETE",
        }),
      }),
    }),
  });
}
