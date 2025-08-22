import type { User } from "../types/user";
import { createEntity } from "./entityFactory";

export const webUsers = createEntity<User>({
  reducerPath: "webUsersApi",
  entityEndpoint: "users/web",
});
