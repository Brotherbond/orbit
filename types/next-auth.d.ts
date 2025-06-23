import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      uuid: string;
      email: string;
      name: string;
      first_name: string;
      last_name: string;
      role: string;
    } & DefaultSession["user"];
    accessToken: string;
  }

  interface User {
    id: string;
    uuid: string;
    email: string;
    name: string;
    first_name: string;
    last_name: string;
    role: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    uuid: string;
    first_name: string;
    last_name: string;
    accessToken: string;
  }
}
