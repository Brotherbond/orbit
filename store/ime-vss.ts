import type { User } from "../types/user";
import { createEntity } from "./entityFactory";

export const imeVss = createEntity<User>({
  reducerPath: "imeVssApi",
  entityEndpoint: "users",
});

export const {
  useGetAllQuery: useGetIMEVSSsQuery,
  useGetByIdQuery: useGetIMEVSSQuery,
  useCreateMutation: useCreateIMEVSSMutation,
  useUpdateMutation: useUpdateIMEVSSMutation,
  useDeleteMutation: useDeleteIMEVSSMutation,
} = imeVss;
